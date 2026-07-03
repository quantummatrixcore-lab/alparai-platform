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

| Need to touch         | File(s)                                                    |
| --------------------- | ---------------------------------------------------------- |
| Add a page            | `src/app/[locale]/.../page.tsx`                            |
| Add a server action   | `src/actions/<domain>.ts`                                  |
| Add a form            | `src/components/<domain>/<form>.tsx`                       |
| Add a translation key | `messages/en.json` + `messages/tr.json`                    |
| Add a DB table        | `supabase/migrations/<timestamp>_<name>.sql`               |
| Add a PII regex       | `src/lib/pii/guardian.ts`                                  |
| Add a rate limit      | `src/lib/utils/rate-limit.ts` + `RATE_LIMITS` in constants |

> 🛡️ **AGENT BOOT PROTOCOL (MANDATORY):**
>
> 1. **FIRST** read `docs/BOOTSTRAP.md` (~500 tokens — system overview + rules)
> 2. **THEN** use `graphify query "<question>"` for any architecture/code question
> 3. **NEVER** read files > 10KB directly. Use graphify or line-limited views (max 100 lines).
> 4. **NEVER** read deleted analysis files (docs/MASTER-ANALYSIS\*.md — outdated June 2026 data).
> 5. If `graphify-out/` is stale, run `graphify update .` (AST-only, no API cost).
> 6. Graphify auto-updates on every `git commit` via pre-commit hook.

## Safety

- Never log raw IP, email, or PII. Always hash.
- Never write to `incidents` from the client. Always go through `submitIncident`.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- Never bypass RLS in the app layer (use the `admin` client only for moderation / audit).

## Links

- README: [`README.md`](./README.md)
- Bootstrap: [`docs/BOOTSTRAP.md`](./docs/BOOTSTRAP.md) ← AI agents read this FIRST
- Architecture: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
- Knowledge Graph: [`graphify-out/GRAPH_REPORT.md`](./graphify-out/GRAPH_REPORT.md) ← full architecture map (auto-updated)
- Security: [`docs/SECURITY.md`](./docs/SECURITY.md)
- KVKK: [`docs/KVKK.md`](./docs/KVKK.md)
- ADRs: [`docs/adr/`](./docs/adr/)
- Contributing: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- License: [`LICENSE`](./LICENSE) (AGPL-3.0)

## Infrastructure (post 2026-06-06 rebuild)

- **Repo**: `https://github.com/quantummatrixcore-lab/Alparai.com.git` (renamed from `sikayetvar`; Vercel watches `master`).
- **Hosting**: Vercel project `prj_REYJORnuYOT4tk28iMXnKZBCGkjL` (alparai-com) → `alparai.com` + `www.alparai.com`, region `fra1`. Duplicate `alparai-web` (`prj_mitn2MvIGMedCkJb7dw2fjDZkkqJ`) is unused — safe to delete.
- **Supabase**: project `alparai-prod` (`ref: azszpzyvxjduhemkjsdh`), region `eu-west-1`, FREE plan. Old `alparai-db` (`ojwtxkwsglbxdkqoliaq`) was lost — paused >90 days, unrecoverable.
- **i18n**: ALL legal page body content must use `getTranslations({locale, namespace: "legal"})` / `t("key")`. Hardcoded English is a bug.

## Google OAuth Configuration

- **Google Cloud Project ID**: `341717447635`
- **OAuth Client ID**: `341717447635-75ramo1e88p34b9dkmhfp5ocecqv0ff1.apps.googleusercontent.com`
- **Google Account**: `quantum.matrix.core@gmail.com`
- **Supabase Auth Config**: Updated via Management API (2026-06-08)
- **Site URL**: `https://alparai.com`
- **Redirect URIs**: `https://alparai.com,http://localhost:3000`

### OAuth Consent Screen Fix (MANUAL)

The reason the Supabase project ID appears on the Google OAuth screen instead of "ALPAR AI" is the OAuth consent screen settings in the Google Cloud Console. This setting cannot be changed via the Supabase API.

**Solution:**

1. Go to https://console.cloud.google.com/apis/credentials/consent
2. Change the **App name** field to "ALPAR AI"
3. **User support email**: `quantum.matrix.core@gmail.com`
4. **Developer contact information**: `quantum.matrix.core@gmail.com`
5. **Save**

## Postmortem — 2026-06-06

- The Supabase project `alparai-db` had been paused for >90 days (FREE plan inactivity); `/restore` returned `400 cannot be restored`. All prior data was unrecoverable (no backups).
- Created fresh `alparai-prod` via Supabase Management API (`POST /v1/projects` requires `organization_slug` body field, NOT `org_id` query string).
- Two `vercel.json` redirects broke the build (BLOCKED deploy → ERROR promotion); resolved by adding `src/app/page.tsx` with `redirect("/en")` instead.
- Commit author was a username-based noreply email; Vercel blocked the build (`COMMIT_AUTHOR_REQUIRED`). Fix: use ID-based `240367464+quantummatrixcore-lab@users.noreply.github.com`.
- `to_tsvector('simple', ...)` in a generated column is STABLE (not IMMUTABLE) on managed Supabase → migration failed. Fix: trigger-based `search_vector` with `to_tsvector('simple'::regconfig, ...)`.
- `is_moderator()` requires `auth.uid()` arg; the P0 `incident_votes` migration was missing it.
- Vercel domain was `serviceType: "zeit.world"` (legacy) — the production target is project `alparai-com` (not `alparai-web`).
- `.env.local` is tracked in git and contains Vercel + Supabase tokens. **MUST** be removed from tracking and added to `.gitignore` (already ignored, just needs `git rm --cached`).

## Pending user actions

- Rotate `vcp_502...` Vercel token + `sbp_1b9...` Supabase token (both exposed in chat history).
- Reset Supabase DB password and re-set in `.env.local` + Vercel.
- Delete duplicate Vercel project `alparai-web`.
