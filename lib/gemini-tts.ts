// Speech from Gemini TTS with a custom voice made in Google AI Studio (Voice
// design / replication). The voice lives in the Google project that owns
// GEMINI_API_KEY. GEMINI_TTS_VOICE_ID takes its name (e.g. "akriti-voice"),
// a stored "voice_..." id, or a stateless "voicekey_..." key.
const API = "https://generativelanguage.googleapis.com/v1beta";

export const geminiVoiceId = () => process.env.GEMINI_TTS_VOICE_ID;
// The main model, then a faster, lighter one if the main model is overloaded,
// erroring or too slow. Both accept the same voices.
const models = () =>
  [
    process.env.GEMINI_TTS_MODEL || "gemini-3.8-flash-tts",
    process.env.GEMINI_TTS_FALLBACK_MODEL || "gemini-3.8-flash-lite-tts",
  ].filter((m, i, all) => all.indexOf(m) === i);
// How long to wait on the main model before trying the fallback model.
const PRIMARY_TIMEOUT_MS = 15_000;

export class GeminiTTSError extends Error {
  constructor(
    message: string,
    public status: number,
    // True when the voice itself was rejected (so another voice may work).
    public voiceProblem = false,
  ) {
    super(message);
  }
}

// Gemini returns WAV by default, but older models return raw 16-bit PCM
// (audio/L16;rate=24000). Browsers can't play bare PCM, so wrap it.
function pcmToWav(pcm: Buffer, rate: number): Buffer {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

// The API only accepts a custom voice by its "voice_..." id, but AI Studio
// shows its name. Look the name up in this project's voices once, then
// remember the id for the life of the server.
type Resolved = { id: string; languageCode?: string };
const resolved = new Map<string, Resolved>();

type VoiceEntry = {
  id?: string;
  name?: string;
  displayName?: string;
  languageCode?: string;
};
const voiceIdOf = (v: VoiceEntry) =>
  v.id ?? v.name?.replace(/^voices\//, "") ?? "";

async function resolveVoice(apiKey: string, voice: string): Promise<Resolved> {
  if (/^voice(key)?_/.test(voice)) return { id: voice };
  const hit = resolved.get(voice);
  if (hit) return hit;

  const wanted = voice.trim().toLowerCase();
  const custom: string[] = [];
  let pageToken = "";
  for (let page = 0; page < 20; page++) {
    const url = new URL(`${API}/voices`);
    url.searchParams.set("pageSize", "1000");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const res = await fetch(url, { headers: { "x-goog-api-key": apiKey } });
    if (!res.ok) {
      console.error("Gemini voices list error:", res.status, await res.text().catch(() => ""));
      throw new GeminiTTSError(
        `Couldn't look up your voices (${res.status}). Set GEMINI_TTS_VOICE_ID to the voice's "voice_..." id instead.`,
        502,
      );
    }
    const data = (await res.json()) as {
      voices?: VoiceEntry[];
      nextPageToken?: string;
    };
    for (const v of data.voices ?? []) {
      const id = voiceIdOf(v);
      const label = (v.displayName ?? "").trim().toLowerCase();
      if (id && (label === wanted || id.toLowerCase() === wanted)) {
        // Logged once so a mismatch is easy to diagnose from the terminal.
        console.log("Gemini voice found:", JSON.stringify(v));
        const hit = { id, languageCode: v.languageCode };
        resolved.set(voice, hit);
        return hit;
      }
      if (id.startsWith("voice_") && v.displayName) custom.push(v.displayName);
    }
    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;
  }

  console.warn(
    `Gemini voice "${voice}" not in this project's list; trying it by name.` +
      ` Custom voices found: ${custom.join(", ") || "none"}.`,
  );
  return { id: voice };
}

// Returns a playable data: URL. Tries GEMINI_TTS_VOICE_ID first, then
// GEMINI_TTS_FALLBACK_VOICE_ID if the first voice can't be used.
export async function geminiSpeak(text: string, style?: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const voices = [geminiVoiceId(), process.env.GEMINI_TTS_FALLBACK_VOICE_ID]
    .map((v) => v?.trim())
    .filter((v, i, all): v is string => !!v && all.indexOf(v) === i);
  if (!apiKey || !voices.length) {
    throw new GeminiTTSError("Gemini voice is not configured.", 503);
  }

  let lastError: unknown;
  for (const voice of voices) {
    try {
      const audio = await speakWith(apiKey, voice, text, style);
      console.log(`Recited with Gemini voice "${voice}".`);
      return audio;
    } catch (error) {
      lastError = error;
      // Only a voice problem is worth retrying with the other voice; a bad
      // key or an exhausted quota will fail the same way again.
      const retryable =
        error instanceof GeminiTTSError && error.voiceProblem;
      if (!retryable) break;
      console.warn(`Gemini voice "${voice}" failed; trying the next voice.`);
    }
  }
  throw lastError;
}

async function speakWith(
  apiKey: string,
  voice: string,
  text: string,
  style?: string,
): Promise<string> {
  const found = await resolveVoice(apiKey, voice);
  // Custom voices are matched on name *and* language, so send the language
  // the voice was made in (or GEMINI_TTS_LANGUAGE, e.g. "ur-PK", if set).
  const languageCode = process.env.GEMINI_TTS_LANGUAGE || found.languageCode;
  const speechConfig = {
    voiceConfig: /^voice(key)?_/.test(found.id)
      ? { voice: found.id }
      : { prebuiltVoiceConfig: { voiceName: found.id } },
    ...(languageCode ? { languageCode } : {}),
  };

  const body = JSON.stringify({
    // The same "## Transcript:" framing AI Studio uses: the model reads only
    // what follows it.
    // Delivery direction (accent, pace) rides in speech metadata, never in
    // the text, which the model reads out verbatim.
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `## Transcript:\n${text}`,
            ...(style ? { speechMetadata: { style } } : {}),
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 1,
      responseModalities: ["AUDIO"],
      speechConfig,
    },
  });

  // Try the main model; on overload, server error or a slow response, fall
  // back to the lighter model.
  let res: Response | undefined;
  const list = models();
  for (const [i, m] of list.entries()) {
    const last = i === list.length - 1;
    try {
      res = await fetch(`${API}/models/${m}:generateContent`, {
        method: "POST",
        headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
        body,
        signal: last ? undefined : AbortSignal.timeout(PRIMARY_TIMEOUT_MS),
      });
    } catch (error) {
      if (last) throw error;
      console.warn(`Gemini TTS model ${m} timed out; trying ${list[i + 1]}.`);
      continue;
    }
    if (last || ![429, 500, 503, 504].includes(res.status)) break;
    console.warn(`Gemini TTS model ${m} returned ${res.status}; trying ${list[i + 1]}.`);
  }
  if (!res) throw new GeminiTTSError("No audio came back. Please try again.", 502);

  if (!res.ok) {
    const raw = await res.text().catch(() => "");
    console.error("Gemini TTS error:", res.status, raw);
    let message = `Recitation failed (${res.status}). Please try again.`;
    if (res.status === 400 || res.status === 403 || res.status === 404) {
      message =
        "Gemini couldn't use that voice. Check GEMINI_TTS_VOICE_ID, and that it was made in the same Google project as GEMINI_API_KEY.";
    } else if (res.status === 429) {
      message = "The voice is busy. Wait a moment and try again.";
    }
    try {
      const detail = JSON.parse(raw)?.error?.message;
      if (typeof detail === "string" && res.status === 400) message += ` (${detail})`;
    } catch {
      /* keep the generic message */
    }
    throw new GeminiTTSError(
      message,
      502,
      res.status === 400 || res.status === 404,
    );
  }

  const data = await res.json();
  const inline = data?.candidates?.[0]?.content?.parts?.find(
    (p: { inlineData?: { data?: string } }) => p?.inlineData?.data,
  )?.inlineData as { mimeType?: string; data: string } | undefined;
  if (!inline) {
    throw new GeminiTTSError("No audio came back. Please try again.", 502, true);
  }

  const mime = (inline.mimeType ?? "").toLowerCase();
  if (mime.includes("wav")) return `data:audio/wav;base64,${inline.data}`;
  if (mime.includes("mpeg") || mime.includes("mp3")) {
    return `data:audio/mpeg;base64,${inline.data}`;
  }
  const rate = Number(/rate=(\d+)/.exec(mime)?.[1] ?? 24000);
  const wav = pcmToWav(Buffer.from(inline.data, "base64"), rate);
  return `data:audio/wav;base64,${wav.toString("base64")}`;
}
