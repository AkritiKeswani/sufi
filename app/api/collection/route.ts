import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// The signed-in user's collection (saved shayari and words, and their own
// writings). Clerk says who the user is; this route then reads and writes
// Supabase with the project's secret key, always scoped to that user's id, so
// the browser never needs Supabase to trust Clerk's tokens directly.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SECRET = process.env.SUPABASE_SECRET_KEY;

const KINDS = new Set(["shayari", "word"]);

async function db(path: string, init: RequestInit & { prefer?: string } = {}) {
  const headers: Record<string, string> = {
    apikey: SECRET!,
    "Content-Type": "application/json",
  };
  // Legacy service_role keys are JWTs and also go in Authorization.
  if (SECRET!.startsWith("eyJ")) headers.Authorization = `Bearer ${SECRET}`;
  if (init.prefer) headers.Prefer = init.prefer;
  const res = await fetch(`${URL_}/rest/v1/${path}`, { ...init, headers });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Supabase error:", res.status, detail);
    throw new Error(`Supabase ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

const enc = encodeURIComponent;

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  if (!URL_ || !SECRET) {
    return NextResponse.json({ error: "Saving isn't set up (SUPABASE_SECRET_KEY)." }, { status: 503 });
  }
  try {
    const [favorites, writings] = await Promise.all([
      db(`favorites?select=kind,item_id&user_id=eq.${enc(userId)}`),
      db(`writings?select=*&user_id=eq.${enc(userId)}&order=created_at.desc`),
    ]);
    return NextResponse.json({ favorites, writings });
  } catch {
    return NextResponse.json({ error: "Couldn't load your bank." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  if (!URL_ || !SECRET) {
    return NextResponse.json({ error: "Saving isn't set up (SUPABASE_SECRET_KEY)." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  try {
    switch (body.action) {
      case "favorite":
      case "unfavorite": {
        const kind = String(body.kind);
        const id = String(body.id ?? "");
        if (!KINDS.has(kind) || !id || id.length > 100) {
          return NextResponse.json({ error: "Bad item." }, { status: 400 });
        }
        if (body.action === "favorite") {
          await db("favorites", {
            method: "POST",
            body: JSON.stringify({ user_id: userId, kind, item_id: id }),
            prefer: "return=minimal,resolution=ignore-duplicates",
          });
        } else {
          await db(
            `favorites?user_id=eq.${enc(userId)}&kind=eq.${kind}&item_id=eq.${enc(id)}`,
            { method: "DELETE" },
          );
        }
        return NextResponse.json({ ok: true });
      }
      case "saveWriting": {
        const title = String(body.title ?? "").trim().slice(0, 200);
        const text = String(body.body ?? "").trim();
        if (!text || text.length > 5000) {
          return NextResponse.json({ error: "Write between 1 and 5000 characters." }, { status: 400 });
        }
        const fields = { title, body: text };
        const rows = body.id
          ? await db(`writings?id=eq.${enc(String(body.id))}&user_id=eq.${enc(userId)}`, {
              method: "PATCH",
              body: JSON.stringify({ ...fields, updated_at: new Date().toISOString() }),
              prefer: "return=representation",
            })
          : await db("writings", {
              method: "POST",
              body: JSON.stringify({ ...fields, user_id: userId }),
              prefer: "return=representation",
            });
        return NextResponse.json({ writing: (rows as unknown[])[0] ?? null });
      }
      case "deleteWriting": {
        await db(`writings?id=eq.${enc(String(body.id ?? ""))}&user_id=eq.${enc(userId)}`, {
          method: "DELETE",
        });
        return NextResponse.json({ ok: true });
      }
      default:
        return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Couldn't save just now. Please try again." }, { status: 502 });
  }
}
