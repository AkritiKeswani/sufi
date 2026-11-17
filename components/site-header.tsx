"use client";

import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const SECTIONS = [
  { href: "/shayari", label: "Shayari" },
  { href: "/learn", label: "Become a Shayar" },
] as const;

// Shared chrome: the wordmark (home), the two sections, and Clerk auth.
export function SiteHeader({ current }: { current?: "/shayari" | "/learn" }) {
  return (
    <header className="label flex w-full items-center justify-between gap-4 text-muted-foreground">
      <Link href="/" className="wordmark text-3xl transition hover:brightness-125">
        Sufi
      </Link>

      <nav className="flex items-center gap-4 sm:gap-6">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            aria-current={current === s.href ? "page" : undefined}
            className={
              "transition hover:text-primary " +
              (current === s.href ? "text-primary" : "")
            }
          >
            {s.label}
          </Link>
        ))}
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="hidden transition hover:text-primary sm:inline">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="hidden rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-primary transition hover:bg-primary/20 sm:inline">
              Sign up
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </nav>
    </header>
  );
}
