"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, ChevronDown, Loader2, Pause, Play } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { POEMS, type Poem } from "@/lib/poems";
import { useRecitation } from "@/lib/use-recitation";

type Reading = { loading: boolean; text?: string[]; error?: string };

const paragraphs = (s: string) =>
  s
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

// A full-screen feed: one verse per screen, snap-scrolling like a reel.
export default function Shayari() {
  const { activeKey, loadingKey, error, toggle, stop } = useRecitation();
  const feedRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [readings, setReadings] = useState<Record<string, Reading>>({});

  // Track which verse fills the screen; a recitation stops when you move on.
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setCurrent(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { root: feed, threshold: 0.6 },
    );
    feed.querySelectorAll("[data-index]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    stop();
  }, [current, stop]);

  async function toggleMeaning(poem: Poem) {
    const willOpen = !open[poem.id];
    setOpen((o) => ({ ...o, [poem.id]: willOpen }));
    if (!willOpen || readings[poem.id]?.text) return;

    // A reading we wrote ourselves takes precedence over a generated one.
    if (poem.meaning) {
      setReadings((r) => ({
        ...r,
        [poem.id]: { loading: false, text: paragraphs(poem.meaning!) },
      }));
      return;
    }

    setReadings((r) => ({ ...r, [poem.id]: { loading: true } }));
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: poem.id }),
      });
      const data = (await res.json()) as { explanation?: string; error?: string };
      if (!res.ok || !data.explanation) {
        throw new Error(data.error ?? "Unable to reveal the meaning.");
      }
      setReadings((r) => ({
        ...r,
        [poem.id]: { loading: false, text: paragraphs(data.explanation!) },
      }));
    } catch (err) {
      setReadings((r) => ({
        ...r,
        [poem.id]: {
          loading: false,
          error: err instanceof Error ? err.message : "Something went wrong.",
        },
      }));
    }
  }

  return (
    <main className="relative h-svh">
      <div className="feed-header absolute inset-x-0 top-0 z-20 px-5 py-5">
        <div className="mx-auto max-w-2xl">
          <SiteHeader current="/shayari" />
        </div>
      </div>

      <div
        ref={feedRef}
        className="feed h-svh snap-y snap-mandatory overflow-y-scroll"
      >
        {POEMS.map((poem, i) => {
          const playing = activeKey === poem.id;
          const loading = loadingKey === poem.id;
          const reading = readings[poem.id];
          const long = poem.text.split("\n").length > 5;

          return (
            <section
              key={poem.id}
              data-index={i}
              aria-label={`Verse ${i + 1} of ${POEMS.length}, ${poem.author}`}
              className="flex min-h-svh snap-start snap-always flex-col items-center justify-center px-5 pt-24 pb-20"
            >
              <article className="flex w-full max-w-2xl flex-col items-center">
                <div className="ornament w-24" />

                {poem.urdu && (
                  <blockquote
                    dir="rtl"
                    lang="ur"
                    className="verse-urdu mt-8 text-center text-[1.5rem] whitespace-pre-line sm:text-[2.1rem]"
                  >
                    {poem.urdu}
                  </blockquote>
                )}

                <blockquote
                  className={
                    "text-center whitespace-pre-line " +
                    (poem.urdu
                      ? "translit mt-6 text-lg sm:text-xl"
                      : "verse mt-8 " +
                        (long
                          ? "text-[1.2rem] leading-[1.8] sm:text-[1.5rem]"
                          : "text-[1.7rem] leading-[1.45] sm:text-[2.1rem]"))
                  }
                >
                  {poem.text}
                </blockquote>

                {poem.translation && (
                  <p className="mt-6 max-w-xl text-center text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                    {poem.translation}
                  </p>
                )}

                <p className="mt-7 text-center text-xs tracking-[0.35em] text-primary uppercase">
                  — {poem.author}
                </p>

                <div className="mt-8 flex items-center gap-3">
                  <Button
                    onClick={() => toggle(poem.id, { id: poem.id })}
                    disabled={loading}
                    aria-label={
                      playing ? "Stop recitation" : "Listen to the recitation"
                    }
                    className="glow-btn size-16 rounded-full hover:brightness-110"
                  >
                    {loading ? (
                      <Loader2 className="size-6 animate-spin" />
                    ) : playing ? (
                      <Pause className="size-6" />
                    ) : (
                      <Play className="ml-0.5 size-6" />
                    )}
                  </Button>
                  <Button
                    onClick={() => toggleMeaning(poem)}
                    variant="outline"
                    aria-expanded={!!open[poem.id]}
                    className="h-12 gap-2 rounded-full border-primary/40 bg-transparent px-5 text-sm tracking-wide text-primary hover:bg-primary/10 hover:text-primary"
                  >
                    <BookOpen className="size-4" />
                    {open[poem.id] ? "Hide meaning" : "Meaning"}
                  </Button>
                </div>

                {error?.key === poem.id && (
                  <p
                    role="alert"
                    className="mt-4 text-center text-sm text-[#e7a98f] italic"
                  >
                    {error.message}
                  </p>
                )}

                {open[poem.id] && reading && (
                  <div className="animate-fade-up mt-7 max-w-xl">
                    {reading.loading && (
                      <p className="shimmer text-center text-xs tracking-[0.2em] text-muted-foreground uppercase">
                        Listening for the meaning
                      </p>
                    )}
                    {reading.error && (
                      <p className="text-center text-sm text-[#e7a98f] italic">
                        {reading.error}
                      </p>
                    )}
                    {reading.text && (
                      <div className="meaning text-center text-lg">
                        {reading.text.map((para, j) => (
                          <p key={j}>{para}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </article>
            </section>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex flex-col items-center gap-1 text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
        <span>
          {current + 1} / {POEMS.length}
        </span>
        {current < POEMS.length - 1 && (
          <ChevronDown aria-hidden className="size-4 animate-bounce text-primary/70" />
        )}
      </div>
    </main>
  );
}
