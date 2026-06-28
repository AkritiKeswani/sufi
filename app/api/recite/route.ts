import { NextResponse } from "next/server";
import { getPoem } from "@/lib/poems";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Recitation voice. Free-tier API keys may only use ElevenLabs' built-in
// "premade" voices — Voice Library voices return 402 (paid plan required).
// Default is the premade "Daniel"; override with ELEVENLABS_VOICE_ID (e.g. set
// it to o85TqPN3F4P7dWae2paA once you're on a paid plan).
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "onwK4e9ZLuTAKqWW03F9";

export async function POST(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Recitation is not connected: set ELEVENLABS_API_KEY in .env.local." },
      { status: 503 },
    );
  }

  let body: { id?: unknown; text?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Two modes: a known curated poem (by id), or freshly generated verse passed
  // as raw text (e.g. a Gemini-composed shayari). Raw text is length-capped so
  // the endpoint can't be turned into an open-ended TTS service.
  let spoken: string;
  if (typeof body.id === "string") {
    const poem = getPoem(body.id);
    if (!poem) {
      return NextResponse.json({ error: "Unknown poem." }, { status: 400 });
    }
    spoken = `${poem.text}\n\n— ${poem.author}`;
  } else if (typeof body.text === "string" && body.text.trim()) {
    const text = body.text.trim();
    if (text.length > 800) {
      return NextResponse.json(
        { error: "That verse is too long to recite." },
        { status: 400 },
      );
    }
    spoken = text;
  } else {
    return NextResponse.json({ error: "Nothing to recite." }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: spoken,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.8,
            style: 0.45,
            use_speaker_boost: true,
            speed: 0.9,
          },
        }),
      },
    );

    if (!res.ok) {
      const raw = await res.text().catch(() => "");
      console.error("ElevenLabs error:", res.status, raw);
      let message = `Recitation failed (${res.status}). Please try again.`;
      try {
        const detail = JSON.parse(raw)?.detail;
        if (detail?.code === "paid_plan_required") {
          message =
            "This voice requires a paid ElevenLabs plan. Set ELEVENLABS_VOICE_ID to a premade voice, or upgrade your plan.";
        } else if (res.status === 401) {
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
