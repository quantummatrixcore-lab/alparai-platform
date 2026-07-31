# Rule Enforcement Matrix

Maps every AGENTS.md / Opus doctrine rule to its concrete CI enforcement mechanism.

| Rule                           | Description                               | Enforcement Mechanism                                  | File / Command                                     |
| ------------------------------ | ----------------------------------------- | ------------------------------------------------------ | -------------------------------------------------- |
| **no-any**                     | `any` keyword forbidden                   | ESLint `@typescript-eslint/no-explicit-any`            | `.eslintrc` / `pnpm lint`                          |
| **noUncheckedIndexedAccess**   | Strict indexed access                     | TypeScript strict mode                                 | `tsconfig.json` / `pnpm typecheck`                 |
| **server-only mutations**      | No client-side `supabase.from().insert()` | ESLint `no-restricted-imports` (server-only) + Vitest  | `pnpm lint` / `pnpm test`                          |
| **RLS**                        | Every migration ships RLS policies        | Manual review (PR checklist) + Supabase migration lint | `supabase/migrations/*.sql`                        |
| **PII Guardian**               | User free-text masked before DB insert    | Vitest unit tests                                      | `tests/lib/pii/`                                   |
| **i18n parity**                | EN ↔ TR key parity                        | Vitest                                                 | `tests/i18n/missing-keys.test.ts`                  |
| **rate-limit**                 | All endpoints behind rate limiter         | Vitest + manual                                        | `src/lib/utils/rate-limit.ts`                      |
| **secrets via .env**           | No hardcoded secrets                      | ESLint `no-restricted-syntax` + GitHub secret scanning | `pnpm lint` / GitHub                               |
| **ROLLBACK block**             | Every migration has `-- ROLLBACK:`        | Manual review                                          | `supabase/migrations/*.sql`                        |
| **Rule logger**                | Agent violations logged via rule-logger   | `pnpm typecheck` (type-safe interface)                 | `src/lib/audit/rule-logger.ts`                     |
| **Autonomous loop**            | Documented agent orchestration            | Manual review                                          | `docs/AUTONOMOUS_LOOP.md`                          |
| **MASTER_PLAN Architect-only** | No executor writes to MASTER_PLAN.md      | Pre-commit hook                                        | `.git/hooks/pre-commit`                            |
| **Single branch (master)**     | No branching / PRs                        | GitHub branch protection                               | GitHub settings                                    |
| **[deploy] marker**            | Deploys gated on commit marker            | Vercel + `architect-trigger.yml`                       | `.github/workflows/architect-trigger.yml`          |
| **Free tier first**            | Cheap models for auxiliary tasks          | AGENTS.md doctrine (manual)                            | `AGENTS.md`                                        |
| **PII hash logging**           | No raw IP/email in logs                   | ESLint + Vitest                                        | `src/lib/utils/hash.ts` / `tests/lib/hash.test.ts` |
| **Security audit**             | Dependencies scanned for CVEs             | `pnpm audit` + `architect-trigger.yml`                 | `.github/workflows/architect-trigger.yml`          |
| **Test gate**                  | No commit with failing tests              | Vitest CI                                              | `.github/workflows/ci.yml`                         |
| **Lint gate**                  | No commit with lint errors                | ESLint CI                                              | `.github/workflows/ci.yml`                         |
| **Typecheck gate**             | No commit with type errors                | tsc CI                                                 | `.github/workflows/ci.yml`                         |
