"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2, Pause, Pencil, Play, Trash2 } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { SiteHeader } from "@/components/site-header";
import { FavoriteButton } from "@/components/favorite-button";
import { POEMS } from "@/lib/poems";
import { WORDS } from "@/lib/words";
import { useCollection } from "@/lib/collection";
import { useRecitation } from "@/lib/use-recitation";

// Everything the user has kept: hearted shayari, hearted words, and their own
// writings from the Write page.
export default function Bank() {
  const { signedIn, status, error, favoriteIds, writings, deleteWriting } =
    useCollection();
  const { activeKey, loadingKey, toggle } = useRecitation();
  const [deleting, setDeleting] = useState<string | null>(null);

  const poems = favoriteIds("shayari")
    .map((id) => POEMS.find((p) => p.id === id))
    .filter((p) => !!p);
  const words = favoriteIds("word")
    .map((id) => WORDS.find((w) => w.id === id))
    .filter((w) => !!w);

  return (
    <main className="flex min-h-screen flex-col items-center px-5 py-10 sm:py-14">
      <div className="w-full max-w-4xl">
        <SiteHeader current="/bank" />

        <div className="mt-12 text-center">
          <h1 className="display text-4xl text-primary sm:text-5xl">Your Bank</h1>
          <p className="mx-auto mt-4 max-w-md text-xl leading-relaxed text-muted-foreground">
            The verses and words you have kept, and the shayari you have written.
          </p>
        </div>

        {!signedIn ? (
          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground">Sign in to see your bank.</p>
            <SignInButton mode="modal">
              <button className="label mt-5 rounded-full border border-primary/50 bg-primary/10 px-5 py-2 text-primary transition hover:bg-primary/20">
                Sign in
              </button>
            </SignInButton>
          </div>
        ) : status === "loading" || status === "idle" ? (
          <p className="shimmer mt-12 text-center text-muted-foreground">Opening your bank…</p>
        ) : status === "error" ? (
          <p className="mt-12 text-center text-[#e7a98f] italic">{error}</p>
        ) : (
          <>
            {/* ── Saved shayari ───────────────────────────────────────── */}
            <section className="mt-12">
              <h2 className="label text-primary">Shayari · {poems.length}</h2>
              {poems.length === 0 ? (
                <p className="mt-4 text-muted-foreground">
                  Tap the heart on a verse in <Link className="text-primary underline-offset-4 hover:underline" href="/shayari">Shayari</Link> to keep it here.
                </p>
              ) : (
                <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                  {poems.map((poem) => {
                    const key = poem.id;
                    return (
                      <li key={poem.id} className="verse-card flex flex-col px-6 py-6">
                        {poem.urdu && (
                          <p dir="rtl" lang="ur" className="verse-urdu text-right text-xl whitespace-pre-line">
                            {poem.urdu}
                          </p>
                        )}
                        <p className="verse mt-2 text-lg leading-relaxed whitespace-pre-line">{poem.text}</p>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="label text-primary">— {poem.author}</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggle(key, { id: poem.id })}
                              aria-label={activeKey === key ? "Stop recitation" : "Listen"}
                              className="inline-flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:brightness-110"
                            >
                              {loadingKey === key ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : activeKey === key ? (
                                <Pause className="size-4" />
                              ) : (
                                <Play className="ml-0.5 size-4" />
                              )}
                            </button>
                            <FavoriteButton kind="shayari" id={poem.id} label={`this verse by ${poem.author}`} size="sm" />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* ── Saved words ─────────────────────────────────────────── */}
            <section className="mt-12">
              <h2 className="label text-primary">Words · {words.length}</h2>
              {words.length === 0 ? (
                <p className="mt-4 text-muted-foreground">
                  Tap the heart on a word in <Link className="text-primary underline-offset-4 hover:underline" href="/learn">Become a Shayar</Link> to keep it here.
                </p>
              ) : (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {words.map((word) => (
                    <li key={word.id} className="verse-card flex items-start justify-between gap-3 px-5 py-4">
                      <div className="min-w-0">
                        <p className="display text-xl">{word.translit}</p>
                        {word.urdu && (
                          <p dir="rtl" lang="ur" className="verse-urdu text-left text-lg">{word.urdu}</p>
                        )}
                        <p className="mt-1 text-muted-foreground">{word.meaning}</p>
                      </div>
                      <FavoriteButton kind="word" id={word.id} label={`“${word.translit}”`} size="sm" />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* ── Their own shayari ───────────────────────────────────── */}
            <section className="mt-12 pb-12">
              <div className="flex items-center justify-between">
                <h2 className="label text-primary">Your shayari · {writings.length}</h2>
                <Link href="/write" className="label text-primary underline-offset-4 hover:underline">
                  Write new
                </Link>
              </div>
              {writings.length === 0 ? (
                <p className="mt-4 text-muted-foreground">
                  Nothing written yet. <Link className="text-primary underline-offset-4 hover:underline" href="/write">Write your first sher</Link>.
                </p>
              ) : (
                <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                  {writings.map((w) => (
                    <li key={w.id} className="verse-card flex flex-col px-6 py-6">
                      {w.title && <p className="display text-lg text-primary">{w.title}</p>}
                      <p dir="auto" className="verse mt-2 flex-1 text-lg leading-relaxed whitespace-pre-line">{w.body}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {new Date(w.updated_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/write?id=${w.id}`}
                            aria-label="Edit"
                            className="inline-flex size-9 items-center justify-center rounded-full border border-primary/40 text-primary transition hover:bg-primary/10"
                          >
                            <Pencil className="size-4" />
                          </Link>
                          <button
                            type="button"
                            aria-label="Delete"
                            disabled={deleting === w.id}
                            onClick={async () => {
                              if (!window.confirm("Delete this shayari? This can't be undone.")) return;
                              setDeleting(w.id);
                              try {
                                await deleteWriting(w.id);
                              } finally {
                                setDeleting(null);
                              }
                            }}
                            className="inline-flex size-9 items-center justify-center rounded-full border border-primary/40 text-primary transition hover:bg-primary/10 disabled:opacity-50"
                          >
                            {deleting === w.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
