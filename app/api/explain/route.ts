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

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "The lamp is unlit: set ANTHROPIC_API_KEY in .env.local to reveal the meaning.",
      },
      { status: 500 },
    );
  }

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

  const client = new Anthropic();

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(poem) }],
    });

    const explanation = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    if (!explanation) {
      return NextResponse.json(
        { error: "No reading was returned. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ explanation });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "The key was not accepted. Check ANTHROPIC_API_KEY." },
        { status: 401 },
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "The well is busy. Wait a moment and try again." },
        { status: 429 },
      );
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `The reading faltered (${error.status}). Please try again.` },
        { status: 502 },
      );
    }
    console.error("Unexpected error generating explanation:", error);
    return NextResponse.json(
      { error: "Something unexpected happened. Please try again." },
      { status: 500 },
    );
  }
}
