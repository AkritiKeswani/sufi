"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { SiteHeader } from "@/components/site-header";
import { useCollection } from "@/lib/collection";

// A quiet page to write your own shayari — in Urdu script or Roman letters —
// and keep it in your Bank. Opening /write?id=… edits a saved one.
export default function Write() {
  const { signedIn, status, writings, saveWriting } = useCollection();
  const [editId, setEditId] = useState<string | undefined>();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  // Read ?id= after mount (no Suspense boundary needed) and load that writing.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id") ?? undefined;
    setEditId(id);
  }, []);
  useEffect(() => {
    if (!editId) return;
    const w = writings.find((x) => x.id === editId);
    if (w) {
      setTitle(w.title);
      setBody(w.body);
    }
  }, [editId, writings]);

  async function save() {
    setMessage(null);
    setSaving(true);
    try {
      const row = await saveWriting({ id: editId, title, body });
      setEditId(row.id);
      window.history.replaceState(null, "", `/write?id=${row.id}`);
      setMessage({ ok: true, text: "Saved to your Bank." });
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Couldn't save." });
    } finally {
      setSaving(false);
    }
  }

  function startNew() {
    setEditId(undefined);
    setTitle("");
    setBody("");
    setMessage(null);
    window.history.replaceState(null, "", "/write");
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-5 py-10 sm:py-14">
      <div className="w-full max-w-4xl">
        <SiteHeader current="/write" />

        <div className="mt-12 text-center">
          <h1 className="display text-4xl text-primary sm:text-5xl">Write</h1>
          <p className="mx-auto mt-4 max-w-md text-xl leading-relaxed text-muted-foreground">
            Write a sher of your own, in Urdu script or Roman letters, and keep it in your Bank.
          </p>
        </div>

        {!signedIn ? (
          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground">Sign in to write and save your shayari.</p>
            <SignInButton mode="modal">
              <button className="label mt-5 rounded-full border border-primary/50 bg-primary/10 px-5 py-2 text-primary transition hover:bg-primary/20">
                Sign in
              </button>
            </SignInButton>
          </div>
        ) : (
          <div className="verse-card mx-auto mt-10 max-w-2xl px-6 py-8 sm:px-10">
            <label className="label text-primary" htmlFor="title">Title (optional)</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              placeholder="e.g. Shaam ki tanhāī"
              className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-2 text-lg outline-none placeholder:text-muted-foreground/60 focus:border-primary/60"
            />

            <label className="label mt-6 block text-primary" htmlFor="body">Your shayari</label>
            <textarea
              id="body"
              dir="auto"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={5000}
              rows={8}
              placeholder={"Write line by line…\ndil kī bāt…"}
              className="verse mt-2 w-full resize-y rounded-lg border border-border bg-transparent px-4 py-3 text-xl leading-relaxed outline-none placeholder:text-muted-foreground/60 focus:border-primary/60"
            />
            <p className="mt-1 text-right text-sm text-muted-foreground">{body.length} / 5000</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={save}
                disabled={saving || !body.trim() || status !== "ready"}
                className="glow-btn inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
              >
                {saving && <Loader2 className="size-4 animate-spin" />}
                {editId ? "Save changes" : "Save to Bank"}
              </button>
              {editId && (
                <button type="button" onClick={startNew} className="label text-muted-foreground transition hover:text-primary">
                  Start a new one
                </button>
              )}
              <Link href="/bank" className="label ml-auto text-primary underline-offset-4 hover:underline">
                Open your Bank
              </Link>
            </div>

            {message && (
              <p role="status" className={"mt-4 " + (message.ok ? "text-primary" : "text-[#e7a98f] italic")}>
                {message.text}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
