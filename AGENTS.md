# AGENTS.md

This file is read by the `opencode` CLI to understand the project.

## Project

ALPAR AI — Trust infrastructure for AI accountability. Next.js 15 + Supabase + Tailwind v4 + next-intl. AGPL-3.0.

## Commands

```bash
pnpm install          # install deps
pnpm dev              # next dev
pnpm build            # next build
pnpm start            # next start
pnpm lint             # eslint
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest
pnpm test:e2e         # playwright
pnpm db:reset         # supabase db reset
pnpm db:migrate       # supabase migration up
```

## Conventions

- **TypeScript strict** — `noUncheckedIndexedAccess` enabled.
- **No `any`** — use `unknown` + Zod parsing.
- **No comments** unless asked.
- **Server Actions** for mutations — never `supabase.from().insert()` from the client.
- **RLS** — every table in `supabase/migrations/` has policies.
- **PII Guardian** — every user-submitted free-text is masked before insert (`src/lib/pii/guardian.ts`).
- **i18n** — copy in `messages/{en,tr}.json`. Use `useTranslations("namespace")` / `getTranslations({locale, namespace})`.
- **Tailwind v4** — design tokens in `src/app/globals.css` (`@theme inline`). No `tailwind.config.ts`.
- **Components** — `src/components/ui/` is pure primitives; feature components live under `incidents/`, `auth/`, `admin/`, `legal/`, `marketing/`.

## File map

| Need to touch            | File(s)                                                       |
| ------------------------ | ------------------------------------------------------------- |
| Add a page               | `src/app/[locale]/.../page.tsx`                                |
| Add a server action      | `src/actions/<domain>.ts`                                     |
| Add a form               | `src/components/<domain>/<form>.tsx`                          |
| Add a translation key    | `messages/en.json` + `messages/tr.json`                       |
| Add a DB table           | `supabase/migrations/<timestamp>_<name>.sql`                  |
| Add a PII regex          | `src/lib/pii/guardian.ts`                                     |
| Add a rate limit         | `src/lib/utils/rate-limit.ts` + `RATE_LIMITS` in constants    |

## Safety

- Never log raw IP, email, or PII. Always hash.
- Never write to `incidents` from the client. Always go through `submitIncident`.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- Never bypass RLS in the app layer (use the `admin` client only for moderation / audit).

## Links

- README: [`README.md`](./README.md)
- Architecture: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
- Security: [`docs/SECURITY.md`](./docs/SECURITY.md)
- KVKK: [`docs/KVKK.md`](./docs/KVKK.md)
- ADRs: [`docs/adr/`](./docs/adr/)
- Contributing: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- License: [`LICENSE`](./LICENSE) (AGPL-3.0)
