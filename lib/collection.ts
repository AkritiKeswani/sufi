"use client";

// The signed-in user's collection — saved shayari, saved words and their own
// writings — stored in Supabase via the app's own /api/collection route, which
// checks the Clerk sign-in and scopes every read and write to that user.
import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useSyncExternalStore } from "react";

export type Kind = "shayari" | "word";
export type Writing = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
};

type State = {
  status: "idle" | "loading" | "ready" | "error";
  userId: string | null;
  favorites: Set<string>; // "kind:item_id"
  writings: Writing[];
  error?: string;
};

// Saving needs Supabase; the server route reports if its secret key is missing.
export const savingConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

// One shared store, so every page and the header agree.
let state: State = { status: "idle", userId: null, favorites: new Set(), writings: [] };
const listeners = new Set<() => void>();
const set = (next: Partial<State>) => {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const SERVER_STATE: State = state;

const favKey = (kind: Kind, id: string) => `${kind}:${id}`;

async function api(body?: Record<string, unknown>) {
  const res = await fetch("/api/collection", {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Collection error:", res.status, data?.error);
    throw new Error(data?.error ?? "Couldn't save just now. Please try again.");
  }
  return data;
}

export function useCollection() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const snap = useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);

  // Load once per signed-in user; clear on sign-out.
  useEffect(() => {
    if (!isLoaded || !savingConfigured) return;
    if (!isSignedIn || !userId) {
      if (state.userId) set({ status: "idle", userId: null, favorites: new Set(), writings: [] });
      return;
    }
    if (state.userId === userId && state.status !== "error") return;
    set({ status: "loading", userId, error: undefined });
    (async () => {
      try {
        const { favorites: favs, writings } = await api();
        set({
          status: "ready",
          favorites: new Set(
            (favs as { kind: Kind; item_id: string }[]).map((f) => favKey(f.kind, f.item_id)),
          ),
          writings: writings as Writing[],
        });
      } catch (err) {
        set({ status: "error", error: err instanceof Error ? err.message : String(err) });
      }
    })();
  }, [isLoaded, isSignedIn, userId]);

  const isFavorite = useCallback(
    (kind: Kind, id: string) => snap.favorites.has(favKey(kind, id)),
    [snap.favorites],
  );

  // Optimistic: the heart fills at once, and rolls back if the save fails.
  const toggleFavorite = useCallback(
    async (kind: Kind, id: string) => {
      const k = favKey(kind, id);
      const had = state.favorites.has(k);
      const next = new Set(state.favorites);
      if (had) next.delete(k);
      else next.add(k);
      set({ favorites: next });
      try {
        await api({ action: had ? "unfavorite" : "favorite", kind, id });
      } catch (err) {
        const back = new Set(state.favorites);
        if (had) back.add(k);
        else back.delete(k);
        set({ favorites: back });
        throw err;
      }
    },
    [],
  );

  const saveWriting = useCallback(
    async (draft: { id?: string; title: string; body: string }) => {
      const { writing: row } = (await api({ action: "saveWriting", ...draft })) as {
        writing: Writing;
      };
      set({
        writings: draft.id
          ? state.writings.map((w) => (w.id === row.id ? row : w))
          : [row, ...state.writings],
      });
      return row;
    },
    [],
  );

  const deleteWriting = useCallback(
    async (id: string) => {
      await api({ action: "deleteWriting", id });
      set({ writings: state.writings.filter((w) => w.id !== id) });
    },
    [],
  );

  const favoriteIds = useCallback(
    (kind: Kind) =>
      [...snap.favorites]
        .filter((k) => k.startsWith(`${kind}:`))
        .map((k) => k.slice(kind.length + 1)),
    [snap.favorites],
  );

  return {
    configured: savingConfigured,
    signedIn: !!isSignedIn,
    status: snap.status,
    error: snap.error,
    writings: snap.writings,
    isFavorite,
    favoriteIds,
    toggleFavorite,
    saveWriting,
    deleteWriting,
  };
}
