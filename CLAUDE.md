# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

True/False quiz web app about Claude Code. Educates developers about the tool's capabilities through 30 questions across 3 difficulty levels, with persistent scoring via Supabase.

## Commands

```bash
npm run dev        # Start dev server (localhost:3000)
npm run build      # Production build
npm run lint       # ESLint
npx tsc --noEmit   # Type check
```

## Stack

- **Next.js 14** — App Router, TypeScript, server components
- **Supabase** — PostgreSQL + Auth (OAuth Google + GitHub) + RLS
- **Tailwind CSS** — dark mode only (tokens in `globals.css`)
- **Deploy** — Vercel

## Architecture

### Quiz flow

1. Landing `/` — OAuth login (Google / GitHub)
2. `/auth/callback` — Supabase callback, creates profile via DB trigger, redirects to `/quiz`
3. `/quiz` — calls `generateSession()` client-side (no DB read), user answers 30 questions, then POSTs to `quiz_attempts`
4. `/result` — reads score from URL/state + fetches last 10 attempts from Supabase

Question selection is **100% client-side**: `generateSession()` in `lib/questions.ts` randomly samples 10 from each pool of 20 and concatenates `[iniciante×10, intermediario×10, avancado×10]`. No server call needed for questions.

### Key files

| Path | Purpose |
|------|---------|
| `lib/questions.ts` | Pool of 60 questions (20/level) + `generateSession()` |
| `lib/quiz.ts` | `saveAttempt()`, `getHistory()`, `calcScore()` |
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/supabase/server.ts` | Server/SSR Supabase client |
| `middleware.ts` | Redirect `/quiz` and `/result` to `/` if unauthenticated |

### Question IDs

Format: `ini-01`…`ini-20`, `int-01`…`int-20`, `adv-01`…`adv-20`. IDs are saved in `quiz_attempts.answers` (JSONB) for future error-rate analytics.

### `answers` JSONB shape

```ts
[{ question_id: string, user_answer: boolean, correct: boolean }]
```

## Database (Supabase)

Two tables — both with RLS (users access only their own rows):

- **`profiles`** — auto-created on signup via `handle_new_user` trigger
- **`quiz_attempts`** — `score`, `total` (always 30), `time_spent` (seconds), `answers` (JSONB), `completed_at`

SQL for tables, RLS policies, and the trigger is in `prd.md §5`.

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
```

Set the same variables in Vercel. Supabase redirect URL must include `https://<domain>/auth/callback`.

## Design constraints

- **Dark mode only** — background `#0a0a0a`/`#111111`, accent `#7c3aed`/`#8b5cf6`, text `#f8fafc`, cards `#1a1a2e`/`#16213e`
- Mobile-first responsive
- No per-question feedback — show results only at the end

## Out of scope (v1)

Leaderboard, per-question explanations, multi-language, admin UI, email notifications, PWA/offline.
