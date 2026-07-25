# ALPAR AI — Claude Context File

## Project

ALPAR AI — Trust infrastructure for AI accountability. Next.js 15 + Supabase + Tailwind v4 + next-intl. AGPL-3.0.

## Commands

```bash
pnpm dev              # next dev
pnpm build            # next build
pnpm lint             # eslint + tsc --noEmit
pnpm test             # vitest
pnpm test:e2e         # playwright
pnpm db:migrate       # supabase migration up
```

## Conventions

- **TypeScript strict** — `noUncheckedIndexedAccess` enabled. No `any` — use `unknown` + Zod.
- **No comments** in code.
- **Server Actions** for mutations — never `supabase.from().insert()` from the client.
- **RLS** — every table has policies. Admin client only for moderation/audit.
- **PII Guardian** — every user free-text is masked before insert (`src/lib/pii/guardian.ts`).
- **i18n** — `messages/{en,tr}.json`. Use `useTranslations("namespace")` / `getTranslations({locale, namespace})`. **Admin panels (authorization-gated): EN/TR only** — no DE/FR/RU needed for `/admin/*` routes. Public-facing pages (`/insights`, `/community`, `/documentation`) require all 5 languages.
- **Tailwind v4** — design tokens in `src/app/globals.css` (`@theme inline`). No `tailwind.config.ts`.

## Standing Rules

1. Read `docs/BOOTSTRAP.md` FIRST (~500 tokens).
2. Use graphify for architecture questions (`graphify query "..."`).
3. Never read files > 10KB directly; use graphify or line-limited views (max 100).
4. Never read `docs/MASTER-ANALYSIS*.md` (outdated).
5. Never log raw IP, email, or PII. Always hash.
6. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
7. Run `pnpm lint && pnpm typecheck` after every change.
8. The Engineering Operating Standard in `AGENTS.md` is binding — read it.
9. **Model routing (token economy)** — delegate discovery to Haiku; never scan the codebase directly with an expensive model:

   | Work type                                                                                                      | Model                                          |
   | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
   | Code search, file location, inventory, grep/glob discovery, "where is X defined"                               | **Haiku** (Explore subagent, `model: "haiku"`) |
   | Routine/mechanical: translation fill-in, formatting, repetitive edits                                          | **Haiku**                                      |
   | Mechanical execution once a plan is approved: repo setup, file export/copy, secret-pattern scans, git plumbing | **Haiku**                                      |
   | Architecture decisions, strategy, security analysis, MASTER_PLAN authoring, multi-step reasoning               | **Opus 5 / Fable 5**                           |

   **TOM (Token Optimization Engine) — MASTER_PLAN doctrine entries:** Haiku drafts → Sonnet writes the full content → Opus 5 / Fable 5 reviews only (approve or diff-sized patch on architecture/governance/security grounds). Full rewrites at the review stage are prohibited — see G-4 in MASTER_PLAN v11.13 (amended v11.14).

10. **No unsourced numbers in `docs/MASTER_PLAN.md`** — every figure cites a file path, table name, or measurement. If unmeasured, write "ölçülmedi". Projections must be tagged `[tahmin — doğrulanmamış]`.

## File Map

| Need                | File                                                       |
| ------------------- | ---------------------------------------------------------- |
| Add page            | `src/app/[locale]/.../page.tsx`                            |
| Add server action   | `src/actions/<domain>.ts`                                  |
| Add form            | `src/components/<domain>/<form>.tsx`                       |
| Add translation key | `messages/en.json` + `messages/tr.json`                    |
| Add DB table        | `supabase/migrations/<timestamp>_<name>.sql`               |
| Add PII regex       | `src/lib/pii/guardian.ts`                                  |
| Add rate limit      | `src/lib/utils/rate-limit.ts` + `RATE_LIMITS` in constants |

## Key Architecture

- **Supabase client**: `src/lib/supabase/client.ts` (browser), `.server.ts` (server), `.admin.ts` (RLS bypass).
- **Auth**: Supabase Auth + Google OAuth. Session in middleware.
- **i18n routing**: `src/middleware.ts` rewrites `/{locale}/...`.
- **Incidents**: `submitIncident` server action → PII Guardian → Supabase insert.
- **Ratings**: K-BENCHMARK model scoring via `k_model_scores` MAT view.
