"use client";

// The signed-in user's collection — saved shayari, saved words and their own
// writings — stored in Supabase. Requests go straight to Supabase's REST API
// with the user's Clerk session token; Row Level Security (supabase/schema.sql)
// keeps every user to their own rows.
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

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const savingConfigured = !!(URL_ && KEY);

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

async function rest(
  token: string,
  path: string,
  init: RequestInit & { prefer?: string } = {},
) {
  const res = await fetch(`${URL_}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: KEY!,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.prefer ? { Prefer: init.prefer } : {}),
    },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Supabase error:", res.status, detail);
    throw new Error(
      res.status === 401 || res.status === 403
        ? "Saving isn't connected yet (Supabase rejected the sign-in)."
        : "Couldn't save just now. Please try again.",
    );
  }
  return res.status === 204 ? null : res.json();
}

export function useCollection() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const snap = useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);

  const token = useCallback(async () => {
    const t = await getToken();
    if (!t) throw new Error("Please sign in again.");
    return t;
  }, [getToken]);

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
        const t = await token();
        const [favs, writings] = await Promise.all([
          rest(t, "favorites?select=kind,item_id"),
          rest(t, "writings?select=*&order=created_at.desc"),
        ]);
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
  }, [isLoaded, isSignedIn, userId, token]);

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
        const t = await token();
        if (had) {
          await rest(t, `favorites?kind=eq.${kind}&item_id=eq.${encodeURIComponent(id)}`, {
            method: "DELETE",
          });
        } else {
          await rest(t, "favorites", {
            method: "POST",
            body: JSON.stringify({ kind, item_id: id }),
            prefer: "return=minimal,resolution=ignore-duplicates",
          });
        }
      } catch (err) {
        const back = new Set(state.favorites);
        if (had) back.add(k);
        else back.delete(k);
        set({ favorites: back });
        throw err;
      }
    },
    [token],
  );

  const saveWriting = useCallback(
    async (draft: { id?: string; title: string; body: string }) => {
      const t = await token();
      const fields = { title: draft.title.trim(), body: draft.body.trim() };
      if (draft.id) {
        const [row] = (await rest(t, `writings?id=eq.${draft.id}`, {
          method: "PATCH",
          body: JSON.stringify({ ...fields, updated_at: new Date().toISOString() }),
          prefer: "return=representation",
        })) as Writing[];
        set({ writings: state.writings.map((w) => (w.id === row.id ? row : w)) });
        return row;
      }
      const [row] = (await rest(t, "writings", {
        method: "POST",
        body: JSON.stringify(fields),
        prefer: "return=representation",
      })) as Writing[];
      set({ writings: [row, ...state.writings] });
      return row;
    },
    [token],
  );

  const deleteWriting = useCallback(
    async (id: string) => {
      const t = await token();
      await rest(t, `writings?id=eq.${id}`, { method: "DELETE" });
      set({ writings: state.writings.filter((w) => w.id !== id) });
    },
    [token],
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
