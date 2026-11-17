"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useCollection, type Kind } from "@/lib/collection";

// A heart that saves a verse or a word to the user's bank. Signed-out users
// are asked to sign in first.
export function FavoriteButton({
  kind,
  id,
  label,
  size = "md",
}: {
  kind: Kind;
  id: string;
  label: string;
  size?: "sm" | "md";
}) {
  const { configured, signedIn, isFavorite, toggleFavorite } = useCollection();
  const { openSignIn } = useClerk();
  const [error, setError] = useState("");
  if (!configured) return null;

  const saved = signedIn && isFavorite(kind, id);
  const box = size === "sm" ? "size-9" : "size-12";

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={async () => {
          setError("");
          if (!signedIn) {
            openSignIn();
            return;
          }
          try {
            await toggleFavorite(kind, id);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Couldn't save.");
          }
        }}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${label} from your bank` : `Save ${label} to your bank`}
        title={saved ? "Saved to your bank" : "Save to your bank"}
        className={
          `${box} inline-flex shrink-0 items-center justify-center rounded-full border transition ` +
          (saved
            ? "border-primary/70 bg-primary/15 text-primary"
            : "border-primary/40 text-primary/80 hover:bg-primary/10 hover:text-primary")
        }
      >
        <Heart className={size === "sm" ? "size-4" : "size-5"} fill={saved ? "currentColor" : "none"} />
      </button>
      {error && (
        <span
          role="alert"
          className="absolute top-full left-1/2 mt-2 w-56 -translate-x-1/2 text-center text-xs text-[#e7a98f] italic"
        >
          {error}
        </span>
      )}
    </span>
  );
}
