# Mindigo

![Next.js](https://badgen.net/badge/Next.js/16/black?icon=nextjs)
![TypeScript](https://badgen.net/badge/TypeScript/TS/007ACC?icon=typescript)
![Tailwind CSS](https://badgen.net/badge/Tailwind%20CSS/CSS/38B2AC?icon=tailwindcss)
![Turso](https://badgen.net/badge/Turso/DB/1BA1E2?icon=sqlite)
![Clerk](https://badgen.net/badge/Clerk/Auth/6C47FF?icon=clerk)
![Drizzle ORM](https://badgen.net/badge/Drizzle%20ORM/ORM/C5F74F?icon=drizzle)
![next-intl](https://badgen.net/badge/next--intl/i18n/000000)
![Zustand](https://badgen.net/badge/Zustand/State/764ABC)

Mindigo is a web application for creating and taking online tests/quizzes. Teachers can build tests with questions, share them via a join code, and review student results. Students join tests by code and submit answers with a time limit.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui, Radix UI, Base UI, Lucide icons
- **Auth**: Clerk (`@clerk/nextjs`)
- **Database**: Turso (libSQL) via Drizzle ORM
- **i18n**: next-intl (English + Bulgarian)
- **State**: Zustand
- **Package manager**: pnpm

## Getting Started

### Setup

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables — copy `.env.example` to `.env`

3. Run database migrations:

```bash
drizzle-kit push
# or generate + apply SQL migrations from ./drizzle
```

4. Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## Roles

- **Teachers** — create/edit tests, share join codes, view submissions and results.
- **Students** — join a test via code, answer questions under a time limit, see their results.
