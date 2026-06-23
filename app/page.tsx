"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Loader2,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { POEMS } from "@/lib/poems";

// A new verse each calendar day (UTC epoch so server and client agree).
function dayIndex(): number {
  const epoch = Date.UTC(2026, 0, 1);
  const days = Math.floor((Date.now() - epoch) / 86_400_000);
  const n = POEMS.length;
  return ((days % n) + n) % n;
}

export default function Home() {
  const [index, setIndex] = useState(() => dayIndex());
  const [today, setToday] = useState("");

  const [meaningOpen, setMeaningOpen] = useState(false);
  const [meaning, setMeaning] = useState<string[]>([]);
  const [meaningLoading, setMeaningLoading] = useState(false);
  const [meaningError, setMeaningError] = useState("");

  const [playing, setPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCache = useRef<Map<string, string>>(new Map());
  const meaningCache = useRef<Map<string, string[]>>(new Map());

  const poem = POEMS[index];

  // Format the date client-side to avoid SSR/timezone hydration mismatches.
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaying(false);
  }

  function goTo(delta: number) {
    stopAudio();
    setMeaningOpen(false);
    setMeaning([]);
    setMeaningError("");
    setAudioError("");
    setIndex((i) => ((i + delta) % POEMS.length + POEMS.length) % POEMS.length);
  }

  async function toggleMeaning() {
    if (meaningOpen) {
      setMeaningOpen(false);
      return;
    }
    setMeaningOpen(true);
    setMeaningError("");

    const cached = meaningCache.current.get(poem.id);
    if (cached) {
      setMeaning(cached);
      return;
    }

    setMeaning([]);
    setMeaningLoading(true);
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
      const parts = data.explanation
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
      meaningCache.current.set(poem.id, parts);
      setMeaning(parts);
    } catch (err) {
      setMeaningError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setMeaningLoading(false);
    }
  }

  async function handlePlay() {
    setAudioError("");
    if (playing && audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }
    try {
      let url = audioCache.current.get(poem.id);
      if (!url) {
        setLoadingAudio(true);
        const res = await fetch("/api/recite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: poem.id }),
        });
        const data = (await res.json()) as { audio?: string; error?: string };
        if (!res.ok || !data.audio) {
          throw new Error(data.error ?? "Unable to recite this verse.");
        }
        url = data.audio;
        audioCache.current.set(poem.id, url);
      }
      const audio = audioRef.current ?? new Audio();
      audioRef.current = audio;
      audio.src = url;
      audio.onended = () => setPlaying(false);
      audio.onpause = () => setPlaying(false);
      await audio.play();
      setPlaying(true);
    } catch (err) {
      setAudioError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoadingAudio(false);
    }
  }

  const isToday = index === dayIndex();

  return (
    <main className="flex min-h-screen flex-col items-center px-5 py-10 sm:py-14">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="flex w-full max-w-2xl items-center justify-between text-xs tracking-[0.25em] text-muted-foreground uppercase">
        <span className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-primary" />
          Sufi
        </span>
        <div className="flex items-center gap-4">
          <span suppressHydrationWarning className="hidden sm:inline">
            {today}
          </span>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="tracking-[0.2em] text-primary uppercase transition hover:text-primary/80">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="rounded-full border border-primary/50 bg-primary/10 px-3 py-1.5 tracking-[0.2em] text-primary uppercase transition hover:bg-primary/20">
                Sign up
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </header>

      <section className="mt-10 flex w-full max-w-2xl flex-1 flex-col sm:mt-14">
        {/* ── The verse card ────────────────────────────────────────── */}
        <article
          key={poem.id}
          className="verse-card animate-fade-up px-7 py-12 sm:px-14 sm:py-16"
        >
          <div className="ornament mx-auto w-24" />

          <blockquote className="verse mt-10 text-center text-[1.75rem] leading-[1.45] whitespace-pre-line sm:text-[2.15rem]">
            {poem.text}
          </blockquote>

          <p className="mt-8 text-center text-xs tracking-[0.35em] text-primary uppercase">
            — {poem.author}
          </p>

          <div className="ornament mx-auto mt-10 w-24" />

          {/* ── The meaning ──────────────────────────────────────────── */}
          {meaningOpen && (
            <div className="animate-fade-up mt-10">
              <p className="mb-4 text-center text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
                The Meaning
              </p>

              {meaningLoading && (
                <p className="shimmer text-center text-sm tracking-[0.2em] text-muted-foreground uppercase">
                  Listening for the meaning
                </p>
              )}

              {meaningError && (
                <p className="text-center text-sm text-[#e7a98f] italic">
                  {meaningError}
                </p>
              )}

              {!meaningLoading && !meaningError && (
                <div className="meaning mx-auto max-w-xl text-center text-lg sm:text-xl">
                  {meaning.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </article>

        {/* ── Controls ──────────────────────────────────────────────── */}
        <div className="mt-10 flex items-center justify-between gap-4">
          <Button
            onClick={() => goTo(-1)}
            variant="outline"
            size="icon"
            aria-label="Previous verse"
            className="size-12 rounded-full border-border/70 bg-transparent text-foreground/70 hover:border-primary/60 hover:text-primary"
          >
            <ChevronLeft className="size-5" />
          </Button>

          <div className="flex items-center gap-3">
            <Button
              onClick={handlePlay}
              disabled={loadingAudio}
              aria-label={playing ? "Pause recitation" : "Listen to the recitation"}
              className="glow-btn size-16 rounded-full hover:brightness-110"
            >
              {loadingAudio ? (
                <Loader2 className="size-6 animate-spin" />
              ) : playing ? (
                <Pause className="size-6" />
              ) : (
                <Play className="ml-0.5 size-6" />
              )}
            </Button>

            <Button
              onClick={toggleMeaning}
              variant="outline"
              aria-expanded={meaningOpen}
              className="h-12 gap-2 rounded-full border-primary/40 bg-transparent px-5 text-sm tracking-wide text-primary hover:bg-primary/10 hover:text-primary"
            >
              <BookOpen className="size-4" />
              {meaningOpen ? "Hide meaning" : "Reveal meaning"}
            </Button>
          </div>

          <Button
            onClick={() => goTo(1)}
            variant="outline"
            size="icon"
            aria-label="Next verse"
            className="size-12 rounded-full border-border/70 bg-transparent text-foreground/70 hover:border-primary/60 hover:text-primary"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>

        {audioError && (
          <p className="mt-4 text-center text-sm text-[#e7a98f] italic">
            {audioError}
          </p>
        )}

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {isToday
            ? "Today's verse — return tomorrow for a new one."
            : "Wandering the archive · use the arrows to keep exploring"}
        </p>
      </section>
    </main>
  );
}
