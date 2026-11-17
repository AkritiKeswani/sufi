import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getPoem } from "@/lib/poems";

// The route reaches out to Anthropic, so it must run on the Node.js runtime
// and never be statically cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are a warm, perceptive guide to South Asian and Sufi poetry — at home with Rumi, Faiz Ahmad Faiz, Bulleh Shah, and Javed Akhtar. Read each poet on their own terms: mystical where the verse is mystical, political or romantic or philosophical where it is. You write for a curious reader: clear, evocative, never academic. Avoid clichés and filler. Don't merely restate the poem; illuminate it.`;

function buildUserPrompt(poem: { text: string; author: string; lang: string }): string {
  const translate =
    poem.lang === "en"
      ? ""
      : "The verse is in transliterated " +
        (poem.lang === "ur" ? "Urdu" : "Punjabi") +
        ". Begin with a one-line plain-English rendering of its sense, then explain it. ";

  return `Here is a verse by ${poem.author}:

"${poem.text}"

${translate}In 2–3 sentences, reveal its deeper meaning and the feeling it carries. Return only that short reading as plain prose — no headings, no preamble, no bullet points.`;
}

// Gemini writes the reading. Claude is used only if MEANING_PROVIDER=claude,
// with Gemini still as the fallback.
const CLAUDE_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

async function readWithClaude(prompt: string): Promise<string> {
  const client = new Anthropic();
  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 400,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });
  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

async function readWithGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set.");
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`Gemini ${res.status}: ${await res.text().catch(() => "")}`);
  }
  const data = await res.json();
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p?.text ?? "")
      .join("")
      .trim() ?? ""
  );
}

export async function POST(request: Request) {
  let id: unknown;
  try {
    ({ id } = await request.json());
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const poem = typeof id === "string" ? getPoem(id) : undefined;
  if (!poem) {
    return NextResponse.json({ error: "Unknown poem." }, { status: 400 });
  }

  const prompt = buildUserPrompt(poem);
  let explanation = "";

  if (process.env.MEANING_PROVIDER === "claude" && process.env.ANTHROPIC_API_KEY) {
    try {
      explanation = await readWithClaude(prompt);
    } catch (error) {
      // Log Anthropic's own reason (e.g. low credit, unknown model) so it can
      // be fixed, then fall back to Gemini.
      const detail =
        error instanceof Anthropic.APIError
          ? `${error.status} ${error.message}`
          : String(error);
      console.error(`Claude reading failed (${CLAUDE_MODEL}): ${detail}`);
    }
  }

  if (!explanation) {
    try {
      explanation = await readWithGemini(prompt);
    } catch (error) {
      console.error("Gemini reading failed:", error);
    }
  }

  if (!explanation) {
    return NextResponse.json(
      { error: "The meaning couldn't be revealed just now. Please try again." },
      { status: 502 },
    );
  }
  return NextResponse.json({ explanation });
}
