# Sufi

Learn the art of shayari. Two ways in from the home page:

- **Shayari** (`/shayari`) — a full-screen, scroll-through feed of couplets and
  poems (Ghalib, Mir, Momin, Faiz, Bulleh Shah, Javed Akhtar, Rumi). Each verse
  has a play button that recites it aloud via **ElevenLabs**, and a **Meaning**
  button for a short reading from Claude.
- **Become a Shayar** (`/learn`) — an assortment of word cards for the
  vocabulary of shayari: each word in Roman letters, with Urdu script, meaning
  and audio.

Built with **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS v4**,
**shadcn/ui**, and **Clerk**.

## Setup

```bash
npm install
cp .env.local.example .env.local   # then fill in the keys below
npm run dev
```

Open http://localhost:3000.

### Environment variables (`.env.local`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | yes | "Reveal meaning" — [console.anthropic.com](https://console.anthropic.com/settings/keys) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | yes | Authentication — [dashboard.clerk.com](https://dashboard.clerk.com) |
| `CLERK_SECRET_KEY` | yes | Authentication (server) |
| `ELEVENLABS_API_KEY` | optional | Audio recitation — [elevenlabs.io](https://elevenlabs.io/app/settings/api-keys) |
| `ELEVENLABS_VOICE_ID` | optional | Recitation voice (defaults to a free premade voice; Voice Library voices need a paid plan) |

## How it works

- `lib/poems.ts` — the verses. Entries with `urdu` show Nastaliq script above the
  transliteration, with a `translation` beneath.
- `lib/words.ts` — the Become a Shayar word cards.
- `app/page.tsx` — the home page: the two entry points.
- `app/shayari/page.tsx` — the snap-scrolling verse feed.
- `app/learn/page.tsx` — the word cards.
- `lib/use-recitation.ts` — shared audio playback. If the server can't speak a
  word, it falls back to the browser's own voice.
- `app/api/recite/route.ts` — sends a known poem or word (by id, never raw text)
  to ElevenLabs. Words are spoken from Urdu script with `eleven_v3` (override
  with `ELEVENLABS_URDU_MODEL_ID`), falling back to the transliteration.
- `app/api/explain/route.ts` — asks Claude for a short reading of a verse.
- `app/api/generate/route.ts` — the Gemini composer; no longer linked from the UI.
- `proxy.ts` — Clerk middleware (Next.js 16 names it `proxy.ts`).
