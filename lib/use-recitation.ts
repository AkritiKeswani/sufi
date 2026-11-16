"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// What the client may ask /api/recite to speak: a poem, or a word (or its
// example sentence) from the Learn Urdu list.
export type ReciteRequest =
  | { id: string }
  | { wordId: string; part?: "word" | "example" };

// If the server can't speak (no key, quota), fall back to the browser's own
// voice for vocabulary so pronunciation practice still works.
export type Fallback = { text: string; lang: string };

// One shared audio element per page: starting a recitation stops the last.
export function useRecitation() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cache = useRef<Map<string, string>>(new Map());
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [error, setError] = useState<{ key: string; message: string } | null>(
    null,
  );

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setActiveKey(null);
  }, []);

  useEffect(() => stop, [stop]);

  const toggle = useCallback(
    async (key: string, request: ReciteRequest, fallback?: Fallback) => {
      setError(null);
      if (activeKey === key) {
        stop();
        return;
      }
      stop();

      try {
        let url = cache.current.get(key);
        if (!url) {
          setLoadingKey(key);
          const res = await fetch("/api/recite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
          });
          const data = (await res.json()) as { audio?: string; error?: string };
          if (!res.ok || !data.audio) {
            throw new Error(data.error ?? "Unable to recite this.");
          }
          url = data.audio;
          cache.current.set(key, url);
        }
        const audio = audioRef.current ?? new Audio();
        audioRef.current = audio;
        audio.src = url;
        audio.onended = () => setActiveKey((k) => (k === key ? null : k));
        await audio.play();
        setActiveKey(key);
      } catch (err) {
        const synth =
          typeof window !== "undefined" ? window.speechSynthesis : undefined;
        if (fallback && synth) {
          const utterance = new SpeechSynthesisUtterance(fallback.text);
          utterance.lang = fallback.lang;
          utterance.rate = 0.85;
          utterance.onend = () => setActiveKey((k) => (k === key ? null : k));
          utterance.onerror = () => setActiveKey((k) => (k === key ? null : k));
          synth.speak(utterance);
          setActiveKey(key);
        } else {
          setError({
            key,
            message:
              err instanceof Error ? err.message : "Something went wrong.",
          });
        }
      } finally {
        setLoadingKey(null);
      }
    },
    [activeKey, stop],
  );

  return { activeKey, loadingKey, error, toggle, stop };
}
