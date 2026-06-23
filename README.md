# Sufi

A daily verse from the Sufi and South Asian poetic tradition — **Rumi, Faiz
Ahmad Faiz, Bulleh Shah, and Javed Akhtar**. Built with **Next.js 16** (App
Router), **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**, and **Clerk**.

A new verse each day on a candlelit dark-amber ground (Cormorant Garamond
italic). **Reveal meaning** calls the Anthropic Claude API (`claude-sonnet-4-6`)
for a short reading — translating the Urdu/Punjabi verses where needed. The
gold **play** button recites the verse aloud via **ElevenLabs**. Arrows wander
the archive, and sign in / sign up is handled by **Clerk**.

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

- `lib/poems.ts` — the curated, multi-poet set (Rumi, Faiz, Bulleh Shah, Javed
  Akhtar), shared by client and server. The client only ever sends a poem `id`,
  never raw text, so the API routes act only on known poems.
- `app/page.tsx` — greets with the day's verse and rotates with the arrows;
  reveal-meaning and play-recitation controls.
- `app/api/explain/route.ts` — looks up the poem by `id` and asks Claude for a
  short reading (translating non-English verses). Key stays server-side.
- `app/api/recite/route.ts` — sends the verse to ElevenLabs and returns audio.
- `proxy.ts` — Clerk middleware (Next.js 16 names it `proxy.ts`).
- `components/ui/*` — shadcn/ui components (Button, Card).
- `app/globals.css` — the dark-amber candlelit theme layered on shadcn's tokens.
