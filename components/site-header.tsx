"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const SECTIONS = [
  { href: "/shayari", label: "Shayari" },
  { href: "/learn", label: "Become a Shayar" },
  { href: "/write", label: "Write" },
  { href: "/bank", label: "Bank" },
] as const;

type Section = (typeof SECTIONS)[number]["href"];

// Shared chrome: the wordmark (home), the sections, and Clerk auth. On phones
// the sections and auth fold into a menu.
export function SiteHeader({ current }: { current?: Section }) {
  const [open, setOpen] = useState(false);

  // Close the menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const link = (s: (typeof SECTIONS)[number], mobile = false) => (
    <Link
      key={s.href}
      href={s.href}
      onClick={() => setOpen(false)}
      aria-current={current === s.href ? "page" : undefined}
      className={
        "transition hover:text-primary " +
        (current === s.href ? "text-primary " : "") +
        (mobile ? "block py-3 text-2xl" : "")
      }
    >
      {s.label}
    </Link>
  );

  return (
    <header className="label relative z-30 flex w-full items-center justify-between gap-4 text-muted-foreground">
      <Link href="/" className="wordmark text-3xl transition hover:brightness-125">
        Sufi
      </Link>

      {/* Desktop */}
      <nav className="hidden items-center gap-6 md:flex">
        {SECTIONS.map((s) => link(s))}
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="transition hover:text-primary">Sign in</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="rounded-full border border-primary/50 bg-primary/10 px-4 py-1 text-primary transition hover:bg-primary/20">
              Sign up
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </nav>

      {/* Phone */}
      <div className="flex items-center gap-3 md:hidden">
        <Show when="signed-in">
          <UserButton />
        </Show>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex size-10 items-center justify-center rounded-full border border-primary/40 text-primary"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav
          id="site-menu"
          className="menu-panel absolute top-full right-0 left-0 mt-3 rounded-2xl px-6 py-4 md:hidden"
        >
          {SECTIONS.map((s) => link(s, true))}
          <Show when="signed-out">
            <div className="mt-3 flex gap-3 border-t border-border pt-4">
              <SignInButton mode="modal">
                <button className="flex-1 rounded-full border border-primary/40 py-2 text-primary">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex-1 rounded-full bg-primary py-2 text-primary-foreground">
                  Sign up
                </button>
              </SignUpButton>
            </div>
          </Show>
        </nav>
      )}
    </header>
  );
}
