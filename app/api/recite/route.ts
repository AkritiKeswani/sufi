import { NextResponse } from "next/server";
import { getPoem } from "@/lib/poems";
import { getWord } from "@/lib/words";
import { GeminiTTSError, geminiSpeak, geminiVoiceId } from "@/lib/gemini-tts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Recitation voice. Free-tier API keys may only use ElevenLabs' built-in
// "premade" voices — Voice Library voices return 402 (paid plan required).
// Default is the premade "Daniel"; override with ELEVENLABS_VOICE_ID (e.g. set
// it to o85TqPN3F4P7dWae2paA once you're on a paid plan).
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "onwK4e9ZLuTAKqWW03F9";

// Shayari is recited from its Roman transliteration with the multilingual
// model. Vocabulary is spoken from the Urdu script with a model that knows
// Urdu (Eleven v3 by default); if that model isn't available to this key we
// fall back to the transliteration so the learner still hears something.
const VERSE_MODEL = "eleven_multilingual_v2";
const URDU_MODEL = process.env.ELEVENLABS_URDU_MODEL_ID || "eleven_v3";

type Attempt = { text: string; model: string };

function voiceSettings(model: string) {
  // v3 takes a simpler settings object than the v2 models.
  if (model.startsWith("eleven_v3")) return { stability: 0.5 };
  return {
    stability: 0.6,
    similarity_boost: 0.8,
    style: 0.45,
    use_speaker_boost: true,
    speed: 0.9,
  };
}

function synthesize(apiKey: string, { text, model }: Attempt) {
  return fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: voiceSettings(model),
      }),
    },
  );
}

// How the Gemini voice should deliver each kind of text. Without this the
// model picks an accent per request, and English verse drifts American.
const ACCENT = "with a soft Pakistani accent";
const STYLE = {
  en: `Recite warmly in English ${ACCENT}, at a natural pace.`,
  ur: `Recite warmly in Urdu ${ACCENT}, at a natural pace.`,
  pa: `Recite warmly in Punjabi ${ACCENT}, at a natural pace.`,
  word: `Say this Urdu clearly and naturally ${ACCENT}.`,
} as const;

// Generated audio, kept for the life of the server: each verse and word is
// only ever voiced once, and every later play is instant.
const audioCache = new Map<string, string>();

export async function POST(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey && !geminiVoiceId()) {
    return NextResponse.json(
      {
        error:
          "Recitation is not connected: set GEMINI_TTS_VOICE_ID (or ELEVENLABS_API_KEY) in .env.local.",
      },
      { status: 503 },
    );
  }

  let body: { id?: unknown; wordId?: unknown; part?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // The client only ever names a known poem or a known word — never raw text —
  // so this endpoint can't be turned into an open-ended TTS service.
  let attempts: Attempt[];
  // What the Gemini voice speaks: Urdu script when we have it.
  let geminiText: string;
  let geminiStyle: string;
  if (typeof body.id === "string") {
    const poem = getPoem(body.id);
    if (!poem) {
      return NextResponse.json({ error: "Unknown poem." }, { status: 400 });
    }
    geminiText = poem.urdu ?? poem.text;
    geminiStyle = STYLE[poem.lang];
    attempts = [{ text: `${poem.text}\n\n— ${poem.author}`, model: VERSE_MODEL }];
  } else if (typeof body.wordId === "string") {
    const word = getWord(body.wordId);
    if (!word) {
      return NextResponse.json({ error: "Unknown word." }, { status: 400 });
    }
    const example = body.part === "example";
    if (example && !word.example) {
      return NextResponse.json({ error: "Nothing to recite." }, { status: 400 });
    }
    // Urdu script first (when we have it), then the Roman transliteration.
    const script = example ? word.example?.urdu : word.urdu;
    const roman = example ? word.example!.translit : word.translit;
    geminiText = script ?? roman;
    geminiStyle = STYLE.word;
    attempts = [
      ...(script ? [{ text: script, model: URDU_MODEL }] : []),
      { text: roman, model: VERSE_MODEL },
    ];
  } else {
    return NextResponse.json({ error: "Nothing to recite." }, { status: 400 });
  }

  // Your own designed voice, when configured, takes over all recitation.
  if (geminiVoiceId()) {
    const cacheKey = JSON.stringify([geminiText, geminiStyle]);
    const cached = audioCache.get(cacheKey);
    if (cached) return NextResponse.json({ audio: cached });
    try {
      const audio = await geminiSpeak(geminiText, geminiStyle);
      audioCache.set(cacheKey, audio);
      return NextResponse.json({ audio });
    } catch (error) {
      if (error instanceof GeminiTTSError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }
      console.error("Unexpected error from Gemini TTS:", error);
      return NextResponse.json(
        { error: "Something unexpected happened. Please try again." },
        { status: 500 },
      );
    }
  }

  try {
    let res: Response | undefined;
    for (const attempt of attempts) {
      res = await synthesize(apiKey!, attempt);
      if (res.ok) break;
      // A bad key or an exhausted quota won't improve with another model.
      if (res.status === 401 || res.status === 429) break;
      console.warn(`ElevenLabs ${attempt.model} failed (${res.status}).`);
    }

    if (!res || !res.ok) {
      const raw = (await res?.text().catch(() => "")) ?? "";
      console.error("ElevenLabs error:", res?.status, raw);
      let message = `Recitation failed (${res?.status}). Please try again.`;
      try {
        const detail = JSON.parse(raw)?.detail;
        if (detail?.code === "paid_plan_required") {
          message =
            "This voice requires a paid ElevenLabs plan. Set ELEVENLABS_VOICE_ID to a premade voice, or upgrade your plan.";
        } else if (res?.status === 401) {
          message = "ElevenLabs rejected the key (401). Check ELEVENLABS_API_KEY.";
        } else if (typeof detail?.message === "string") {
          message = detail.message;
        }
      } catch {
        /* non-JSON error body — keep the generic message */
      }
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const buf = await res.arrayBuffer();
    const base64 = Buffer.from(buf).toString("base64");
    return NextResponse.json({ audio: `data:audio/mpeg;base64,${base64}` });
  } catch (error) {
    console.error("Unexpected error generating recitation:", error);
    return NextResponse.json(
      { error: "Something unexpected happened. Please try again." },
      { status: 500 },
    );
  }
}
