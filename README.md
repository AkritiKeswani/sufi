# Sufi

An illuminated gallery of Rumi's poems. Built with **Next.js 16** (App Router),
**TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**.

You're greeted with a Rumi poem set on a soft pink ground. The **Another poem**
button turns to a different poem and calls the Anthropic Claude API
(`claude-sonnet-4-6`) to generate a three-paragraph reading of that poem's Sufi
symbolism, which unfurls beneath the verse.

## Setup

```bash
npm install
cp .env.local.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

Get an API key at https://console.anthropic.com/settings/keys.

## How it works

- `lib/poems.ts` — the curated set of Rumi passages, shared by client and
  server. The client only ever sends a poem `id`, never raw text.
- `app/page.tsx` — greets with a poem and rotates to a new one on demand.
- `app/api/explain/route.ts` — a server route that looks up the poem by `id` and
  asks Claude for its meaning. The API key stays server-side.
- `components/ui/*` — shadcn/ui components (Button, Card).
- `app/globals.css` — theme (light pink, black text, rose accents, rounded
  cards) layered on shadcn's token system.
