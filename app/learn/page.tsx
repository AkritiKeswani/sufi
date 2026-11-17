"use client";

import { Loader2, Volume2 } from "lucide-react";
import { FavoriteButton } from "@/components/favorite-button";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { WORDS, type Word } from "@/lib/words";
import { useRecitation } from "@/lib/use-recitation";

export default function Learn() {
  const { activeKey, loadingKey, error, toggle } = useRecitation();
  function speak(word: Word, part: "word" | "example") {
    const text =
      part === "word"
        ? (word.urdu ?? word.translit)
        : (word.example?.urdu ?? word.example?.translit ?? "");
    toggle(`${word.id}:${part}`, { wordId: word.id, part }, { text, lang: "ur-PK" });
  }

  // A plain render helper (not a component) so buttons keep focus across renders.
  function speakButton(word: Word, part: "word" | "example", large = false) {
    const key = `${word.id}:${part}`;
    const busy = loadingKey === key;
    const on = activeKey === key;
    return (
      <Button
        onClick={() => speak(word, part)}
        disabled={busy}
        variant={large ? "default" : "outline"}
        size="icon"
        aria-label={
          part === "word"
            ? `Hear “${word.translit}”`
            : `Hear the example for “${word.translit}”`
        }
        aria-pressed={on}
        className={
          large
            ? "glow-btn size-12 shrink-0 rounded-full hover:brightness-110"
            : "size-9 shrink-0 rounded-full border-primary/40 bg-transparent text-primary hover:bg-primary/10 hover:text-primary"
        }
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Volume2
            className={(large ? "size-5" : "size-4") + (on ? " animate-pulse" : "")}
          />
        )}
      </Button>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-5 py-10 sm:py-14">
      <div className="w-full max-w-4xl">
        <SiteHeader current="/learn" />

        <div className="mt-12 text-center">
          <h1 className="display text-4xl text-primary sm:text-5xl">Become a Shayar</h1>
          <p className="mx-auto mt-4 max-w-md text-xl leading-relaxed text-muted-foreground">
            The words shayari is made of. Tap the speaker, listen, then say
            it aloud.
          </p>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-center text-sm text-[#e7a98f] italic">
            {error.message}
          </p>
        )}

        {/* ── Word cards ───────────────────────────────────────────────── */}
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WORDS.map((word) => (
              <li
                key={word.id}
                className="verse-card word-card flex flex-col px-6 py-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="display text-2xl">{word.translit}</p>
                    {word.urdu && (
                      <p dir="rtl" lang="ur" className="verse-urdu text-left text-2xl">
                        {word.urdu}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <FavoriteButton kind="word" id={word.id} label={`“${word.translit}”`} size="sm" />
                    {speakButton(word, "word", true)}
                  </div>
                </div>

                <p className="mt-3 text-base text-foreground">{word.meaning}</p>
                {word.note && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {word.note}
                  </p>
                )}

                {word.example && (
                  <div className="mt-5 flex flex-1 items-start gap-3 border-t border-border pt-4">
                    {speakButton(word, "example")}
                    <div className="min-w-0 flex-1">
                      <p className="roman text-base">{word.example.translit}</p>
                      {word.example.urdu && (
                        <p dir="rtl" lang="ur" className="verse-urdu text-left text-base">
                          {word.example.urdu}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {word.example.en}
                      </p>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

      </div>
    </main>
  );
}
