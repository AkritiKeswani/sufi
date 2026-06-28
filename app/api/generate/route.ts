import { NextResponse } from "next/server";

// Reaches out to Google's Gemini API — Node runtime, never statically cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT = `You are a master Urdu poet in the classical ghazal and shayari tradition — steeped in Ghalib, Mir, Faiz, and Parveen Shakir. You compose original, evocative shayari with authentic Urdu idiom and imagery: ishq and hijr, the divine beloved, the tavern and the moth, longing, intoxication, and quiet defiance. Your verse is genuine and fresh — never clichéd, never a translation of a famous line. You write tasteful, beautiful poetry suitable for all readers.`;

// A little variety so each composition feels new.
const THEMES = [
  "ishq — love that consumes",
  "hijr — the ache of separation",
  "the divine Beloved beyond the veil",
  "longing under the night sky and the moon",
  "the fleeting world (faani duniya)",
  "hope flickering amid sorrow",
  "the tavern, the wine, the intoxication of devotion",
  "memory and the passage of time",
  "the caged bird and the dream of freedom",
  "the moth and the flame (parwana aur shamma)",
];

export async function POST() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "The pen is dry: set GEMINI_API_KEY in .env.local to compose new shayari.",
      },
      { status: 503 },
    );
  }

  const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
  const userPrompt = `Compose one original Urdu shayari (a sher or short ghazal of 2 to 4 lines) on the theme of ${theme}.

Return:
- "urdu": the shayari in proper Urdu (Nastaliq) script, with line breaks (\\n) between lines.
- "transliteration": a faithful Roman-Urdu transliteration, with the same line breaks.
- "meaning": 2–3 sentences in warm, evocative English revealing its deeper meaning and the feeling it carries — illuminate it, don't merely restate it.

Make it fresh and genuine — not a known couplet.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 1.15,
            topP: 0.95,
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                urdu: { type: "string" },
                transliteration: { type: "string" },
                meaning: { type: "string" },
              },
              required: ["urdu", "transliteration", "meaning"],
            },
          },
        }),
      },
    );

    if (!res.ok) {
      const raw = await res.text().catch(() => "");
      console.error("Gemini error:", res.status, raw);
      let message = `The composition faltered (${res.status}). Please try again.`;
      if (res.status === 400 || res.status === 403) {
        message = "Gemini rejected the key. Check GEMINI_API_KEY in .env.local.";
      } else if (res.status === 429) {
        message = "The muse is busy. Wait a moment and try again.";
      }
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const data = await res.json();
    const text: string | undefined =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p?.text ?? "")
        .join("")
        .trim();

    if (!text) {
      return NextResponse.json(
        { error: "No verse was composed. Please try again." },
        { status: 502 },
      );
    }

    let parsed: { urdu?: string; transliteration?: string; meaning?: string };
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error("Gemini returned non-JSON:", text);
      return NextResponse.json(
        { error: "The verse came back garbled. Please try again." },
        { status: 502 },
      );
    }

    if (!parsed.urdu?.trim()) {
      return NextResponse.json(
        { error: "The verse came back empty. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      urdu: parsed.urdu.trim(),
      transliteration: parsed.transliteration?.trim() ?? "",
      meaning: parsed.meaning?.trim() ?? "",
    });
  } catch (error) {
    console.error("Unexpected error composing shayari:", error);
    return NextResponse.json(
      { error: "Something unexpected happened. Please try again." },
      { status: 500 },
    );
  }
}
