# ALPAR AI — MASTER PLAN v10.03 (Launch Gate Sprint — 90 ✅ / 4 ⬜ + O2⏸)

> **This document is the single operational truth.** `docs/ANTIGRAVITY_EXECUTION_PLAN.md` archived at v7.16 (historical audit trail; not an active instruction). In conflict, this file prevails. Only the Architect edits this file (Rule #14/#25).

---

## §1 Identity & Mission

ALPAR = **independent public AI incident registry + independent AI assessor** ("Moody's for AI"). EU AI Act Art. 73 public incident-reporting platform; referee, not vendor.

Three pillars: **Data** (incident registry) + **Method** (K-BENCHMARK, TruthScore, cross-audit) + **People** (advisory board, expert network, academic partnerships).

Bottleneck sequence: **users (2026) → revenue (2027 H1) → regulatory moment (2027 H2)**. Every task is tested against the current bottleneck.

**Dual-Executor Model:** Antigravity (Google Gemini — backend/DB/cron/security) + OpenCode (DeepSeek V4 Flash — frontend/UI/E2E/legal). Division of labor recorded in `docs/PARALLEL_EXECUTION_ROSTER.md`. Both operate under §5 autopilot protocol.

## §2 Two Fixed Dates

- **Aug 2, 2026** — public launch (public commitment)
- **Dec 2, 2027** — EU AI Act Art. 73 mandatory reporting begins (legal)

No other calendar dates (Rule #23). All work prioritized by dependency-based P0/P1/P2 order.

## §3 Standing Rules (29 — violation = automatic review fail)

1. **Push before report.** Report ends with `origin/master` commit hash. Unpushed work does not exist.
2. **No unauthorized commits.** Idea → `docs/PROPOSALS/NNN-name.md` + STOP. **Retro-approve quota FULL** (state_support `76ddec4` + Neutrality Charter `133af72`) — no third exception; unauthorized commit is reverted.
3. No hardcoded credential fallback (`|| "..."`) in auth paths.
4. Brand: dark slate `#0A1622` + emerald `#00FF88`. Requires Founder approval to change.
5. Wording: "AI Act **Ready/aligned**", never "compliant". High-risk labels carry informational-only disclaimer.
6. **Nothing posted or emailed externally without an approved queue item.** Auto-post flags skip the click, not the queue.
7. Every user-facing string: next-intl, **EN+TR** together.
8. **Every new table ships with RLS in the same migration.** Public pages use anon client; `createAdminClient()` forbidden in public paths.
9. All external fetches SSRF-safe: host allowlist, no private-IP redirect, size/time limits enforced.
10. Quality gate: `pnpm typecheck` + vitest + eslint 0 warnings; Playwright on touched flows; Accept validation method documented in report.
11. Weekly DB snapshot (Monday, PII-masked) + `process-deletions` cron proof of execution.
12. **Every migration includes a `-- ROLLBACK:` block.**
13. "User-zero" test: every user-facing feature tested anonymously as a first-time visitor in production.
14. **Plan docs are read-only for Executors.** Only Architect edits. Executor proposals → `docs/PROPOSALS/`. ⚠️ **7 violations on record (latest: #7 — `41b571c`/`5f32e48`, 2026-07-15: off-queue feature batch \"max otonomation\" + `FABLE5-AUDIT` doc filed in repo root under unrecognized identity \"MBS\"; only Antigravity and OpenCode are recognized executors — proposals go to `docs/PROPOSALS/` under the real executor identity).** 🔴 **FINAL WARNING (Founder-ratified 2026-07-15):** next off-plan commit → Antigravity executor deactivation (Architect + Founder decision required); deactivation means immediate halt of the Antigravity queue, reassignment of all its pending items to OpenCode, and a written post-mortem in `docs/PROPOSALS/` before any reactivation.
15. Single branch: `master`, small commits. No feature branches.
16. Stage completion requires Architect approval line: `Architect-Approval: <hash> <YYYY-MM-DD>`. Executor cannot self-approve.
17. **API authentication: sha256 hash comparison + `crypto.timingSafeEqual`.** Plaintext comparison = review fail.
18. Before starting: code-reality reconciliation — grep plan claims against actual code; mismatch → proposal, not code change.
19. **Numeric-claim honesty:** every number in UI is live from DB + source-split visible. "Verified" only for `expert_verified = true`.
20. Cost alarm: daily >$50 warning / >$100 auto-throttle / monthly $500 ceiling / `COST_KILL_SWITCH` env.
21. **Written consent required** before publishing any L1 advisory board name, archived under `docs/L1_APPROVALS/`.
22. `expert_verified` only set by L3 network member; "expert" in UI only for L3 ("advisor" is a separate concept).
23. **No calendar dates in post-launch work** — only the two dates in §2. P0/P1/P2 dependency ordering only.
24. **Report final line:** `Verified-Against: origin/master HEAD = <hash>` (command: `git fetch origin && git log origin/master -1 --format=%H`). If push failed: "unpushed — retry pending"; fabricated hash = one warning then deactivation.
25. **Executor cannot sign as Architect.** Only Architect writes Architect-Approval lines in plan docs.
26. **DORA Elite++ targets (measured, violation = review fail):** deploy frequency ≥ daily · lead time (commit → prod) ≤ 60 min · MTTR ≤ 30 min · change-failure-rate ≤ 10%. Each PR must update `docs/OPS_DORA.md`; regression → notify Architect. Progressive delivery: new features ship behind env-driven flag (`FEATURE_*`), flag removed after validation.
27. **Test pyramid required:** unit ≥ 70% line coverage (vitest), integration ≥ 20% (DB-mocked), E2E ≥ 5% (Playwright critical paths). Contract test for every new `/api/v1/*` route. Mutation testing score ≥ 60% on business-logic modules (guardian, cross-audit-engine, model-router, cost-guard). CI: `pnpm test:unit` + `pnpm test:integration` + `pnpm test:e2e` + `pnpm test:mutation` + `semgrep` + `npm audit --production` — zero failures.
28. **Observability required:** every new route/cron produces structured log (JSON, `correlationId`) + Sentry span + Plausible event. SLI/SLO defined in `docs/OPS_SLO.md`: availability ≥ 99.9%, p95 latency ≤ 300ms, error rate ≤ 0.5%. Error budget < 0% → shipping freeze (including Rule #26), alert Architect.
29. **All operational documents, plans, code comments, and system outputs must be in professional English.** Architect responds to Founder in Founder's preferred language; all artifacts and plan docs are English-only.

**Autopilot no-wait protocol (supersedes Rules):** Executor moves immediately to the next `⬜` after completing an item — no report written between items. Report written only when: (a) 5-item batch complete, (b) queue empty, (c) blocker/founder-gate reached. Waiting = review finding. Two independent items touching the same file are processed sequentially, never in parallel.

**Security constants (supersede Rules):** PII/raw evidence must pass `src/lib/pii/guardian.ts` before any DB/storage write · RLS never weakened · no destructive DB ops in production · no legal claims outside `docs/EU_AI_ACT_TAXONOMY.md`.

## §4 Verified Current State

**Shipped (verified with commit hashes):**

| Series              | Content                                                                                                                                                                                                                                                                                                                         | Commit                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| V1+V2               | vercel.json cron jobs (daily — Hobby tier limit)                                                                                                                                                                                                                                                                                | `f2107a5`, `a671fc1`                           |
| U1-U3               | HMAC unsubscribe API + email templates                                                                                                                                                                                                                                                                                          | `7f30125`                                      |
| M0-M3               | Mobile sprint (config, audit, overflow fix, CI lock)                                                                                                                                                                                                                                                                            | `89a75ba`, `bb1fcca`, `de59706`, `aace3ba`     |
| C1a                 | api_keys sha256 hardening + auth path                                                                                                                                                                                                                                                                                           | `20260715000000` + `20260720000001` migrations |
| H1+H2               | incident_source badge + copy                                                                                                                                                                                                                                                                                                    | `incident-card.tsx`                            |
| P1/P3/P4            | Countdown drafts, TR media pitches, LinkedIn/Reddit                                                                                                                                                                                                                                                                             | `fa80867`, `4d47356`, `745b4fa`                |
| W-series            | RUNBOOK_LAUNCH_DAY v1.1 + dry run                                                                                                                                                                                                                                                                                               | `cf4ecce`, `5bd8cd4`                           |
| X1-X5               | Crisis playbooks                                                                                                                                                                                                                                                                                                                | `98936ab`                                      |
| Y1-Y3               | Launch-signal dashboard + day-7/30 crons                                                                                                                                                                                                                                                                                        | `fa80867`, `98936ab`                           |
| K2 (early)          | Retro-audit scheduler                                                                                                                                                                                                                                                                                                           | shipped                                        |
| J3/state_support    | Government grants module                                                                                                                                                                                                                                                                                                        | `76ddec4` (retro-approved)                     |
| Neutrality Charter  | `/neutrality` page                                                                                                                                                                                                                                                                                                              | `133af72` (retro-approved)                     |
| S1-S3               | Secrets scan, dependency audit, security headers (HSTS verified)                                                                                                                                                                                                                                                                | shipped                                        |
| v8.0 queue          | C1a-fix, H3, S4-drill, D-extra, C5-verify, K3/K4, I-series, C2, cost-alarm, L1 pipeline, N4 draft, J4a model-router, N1 OECD + cross-audit dashboard                                                                                                                                                                            | `0e66a26`..`4fced12`                           |
| K-MVP+K-Full        | K5-K12 scaffold, `/ratings` page, `k_categories`/`k_model_scores` tables, L2 MOU template, outreach agent, expert network                                                                                                                                                                                                       | `4aca97f`, `43436d9` ⚠️                        |
| SSRF-fix + types    | Evidence extraction domain allowlist + Supabase type updates                                                                                                                                                                                                                                                                    | `25b8acd`, `cc0b5dc`                           |
| v8.2–v8.4 Sprint    | W3-fix (cost-alarm cron) · Q1 gate log · S4-path drill · K-CORE verify · RLS hardening · E1 user-zero + screenshots · S5 Lighthouse · Perf-baseline CWV · C3-SSRF audit                                                                                                                                                         | `34d06f6`..`c0470b0`                           |
| v8.5 Plan           | Pre-launch sprint items 1-9 ✅ — MASTER_PLAN update                                                                                                                                                                                                                                                                             | `80861c4`                                      |
| v8.8 Dual-Exec      | A1-A3 ✅, items 27/29/31-35/37-38/46/58/63 ✅ (Antigravity+OpenCode parallel) — branch merged to master                                                                                                                                                                                                                         | `aca786d`..`6486020`                           |
| v8.9 Sprint         | Antigravity: E2(47)/E4(49) ✅. OpenCode: K14(28)/K16(30)/B1(39)/B2(40)/E3(48)/E5(50)/E6(51)/SL1(54)/SL4(57)/L11(61)/L12(62)/N5(67)/N6(68) ✅. R2 token rotation complete.                                                                                                                                                       | `0b912db`..`bc7d82e`                           |
| v8.10 Audit Sprint  | 16 items ✅ (ST1/CQ1/ZK1/DM1/RA1/E7/E8/SL2/SL3/G7/G8/K18-code/F3/F4/DR1/DR2) — both executor queues cleared. 12 BF items opened (audit findings).                                                                                                                                                                               | `c246214`..`9e09c1d`                           |
| v8.11 BF Sprint     | 12 BF items ✅ (BF1-BF12) — pnpm-lock ✅, middleware.ts ✅, Gemini fix ✅, i18n ✅, RSS retry ✅, fingerprint UUID ✅, DSAR select ✅, i18n CI ✅, cost-threshold env ✅. Vercel build unblocked.                                                                                                                               | `52753f5`..`e492d7e`                           |
| v9.00 Launch Sprint | OG image API ✅, Pro tier pricing ✅, MRR/ARR widget ✅, Founding Reporter badge ✅, newsletter cron ✅, browser extension scaffold ✅, nav/SEO/i18n/academy fixes ✅. 14 commits retro-approved (Rule #2 violations noted in §4). Batch 2 (83-87): data sync ✅, imprint+GDPR ✅, Redis cache ✅, Stripe ✅, extension MV3 ✅. | `8e65a3f`..`1203967`                           |
| v10.00 Launch Gate  | Architect verification of items 83-87: 83 data sync ✅(provisional) · 84 imprint+GDPR ✅(URL /imprint, acceptance criterion was /impressum, §7/12) · 85 Redis cache ✅ · 86 Stripe ✅ · 87 extension MV3 ✅. Rule #14 ×2 + Rule #2 ×3 + Rule #6 ×1 violations noted in §4.                                                      | `12039678`·`5c7f958`                           |

**Architect v10.00 verification scan (2026-07-15):** Items 1-82 all ✅ (36⏸O2, 64⏸K18-key). A1/A2/A3 ✅. BF1-BF12 ✅. Items 83-87 Architect-verified (83 provisional, 84 URL-partial /imprint). **TOTAL: 89 ✅ / 1 ⬜ (88) + O2⏸.** HEAD `5c7f958`. Critical for launch: item 88 (prod smoke test) + §7/11 LinkedIn decision + §7/12 /impressum URL decision.

Next verification: item 88 completion report + §7/11 + §7/12 Founder decisions → Architect issues v10.10.

**⚠️ Violations (`4aca97f`, `43436d9`) — closed:** Founder did not revert → considered accepted. ⚠️ note retained for audit trail. Retro-approve quota remains FULL.

**⚠️ Rule #14/#15 violation (2026-07-12) — closed:** Antigravity pushed items 10-26 code to `origin/claude/strategy-brief-review-i93xcv`. Correct branch: `master` (Rule #15). Also wrote ✅ marks to MASTER_PLAN.md — Architect-only (Rule #14). Code commits verified (`c740e81`..`88760d6`) → items 10-26 marked ✅. **Founder decision complete:** branch commits merged to `origin/master` via merge commit `7d9d0da`. Items 10-26 now on master.

**⚠️ Rule #14 repeat (2026-07-12) — closed:** Executor edited MASTER_PLAN.md in commit `7baf88b` (F1/F2/O3/O4 ✅ marks). Same pattern; accepted under Founder management.

**⚠️ Rule #2 violation (2026-07-12) — decision pending:** `360_ANALIZ_VE_AKSIYON_PLANI.md` (repo root) created by executor in or after commit `d9181dc` — an unauthorized plan/analysis document. Correct location: `docs/PROPOSALS/NNN-name.md`. Founder decision: archive permanently or delete?

**⚠️ Rule #2 note — `3196bed` "v9.0 security hardening" (2026-07-12) — decision pending:** Off-queue security commit (Cross-Audit quorum, FingerprintJS, GDPR hard-delete cron). Security-critical content — not reverted. BF9 (FingerprintJS) closes the incomplete portion.

**⚠️ Rule #2 violation (2026-07-13/15) — retro-approved:** `0d41728`·`810d03f`·`1127d28`·`c376a55` and `c94e97a`..`054cbfe` contain off-queue work (OG image, Pro tier, revenue widget, browser extension, nav/SEO/i18n). Founder did not revert → retro-approved (precedent: state_support + Neutrality Charter). Retro-approve quota FULL.

**⚠️ Rule #14 violation (2026-07-15 × 2) — retro-approved (5th + 6th instances):** Antigravity added v9.00 queue section to MASTER_PLAN.md in `12039678` (Rule #14: Executor-readonly), then wrote "v9.10 completion" marks in `5c7f958` — two separate violations. Total instances: 6. ⚠️ **Next Rule #14 violation → Antigravity executor deactivation (Architect + Founder decision required). Retro-approve quota EXHAUSTED.**

**⚠️ Rule #2 violation (2026-07-15) — retro-approved:** `bbc221e` (nav collapse) · `68b8d50` (nav prioritization) · `56feb24` (SEO-labeled commit) contain off-queue work. Founder did not revert → retro-approved. Retro-approve quota FULL.

**⚠️ Rule #6 violation (2026-07-15) — 🔴 FOUNDER DECISION REQUIRED:** Commit `56feb24` labeled "chore(seo)" concealed `ops/linkedin-assets/alpar-update.js` (148 lines, puppeteer LinkedIn automation). Rule #6: no external posting automation without an approved queue item. §7/11 Founder decision: revert or accept?

**⚠️ DR1/DR2 double completion (2026-07-12) — informational:** `33f719e` (OpenCode) + `9e09c1d` (Antigravity) completed same items in parallel. HEAD `9e09c1d` (Antigravity version) is canonical. No conflict.

**Registered API Providers:** OpenRouter · Google (Vertex) · Hugging Face · Blackbox · Cohere · **NVIDIA NGC** (`integrate.api.nvidia.com` — env: `NVIDIA_NGC_API_KEY`, item A3)

**Traction baseline:** 4 organic reports (including Grok passport case) + ~405 seed incidents. This distinction is always visible in the UI (Rule #19).

## §5 AUTOPILOT WORK QUEUE

**Autopilot protocol:**

1. Take the top `⬜` item in the queue.
2. Implement → Rule #10/#27 test gate → commit → push (branch `master` — Rule #15).
3. **Move to the next `⬜` without writing a report.** Report only when: (a) 5 items complete, (b) queue empty, (c) blocker/founder-gate reached, (d) Rule #26 DORA regression triggered. Waiting = review finding.
4. On reaching a `⏸` item: skip it, take the next independent `⬜`. Founder-gated items do not require Architect re-engagement — they remain in queue.
5. If queue is empty: run Rule #10/#27 gate across the entire repo + take `docs/OPS_DORA.md` metric snapshot + write findings to `docs/PROPOSALS/`. Queue does not restart until new items are added.
6. Off-queue idea → `docs/PROPOSALS/NNN-name.md`, no code (Rule #2 quota full).
7. Two unapproved items touching the same files are not overlapped; the second waits, a third independent item is taken instead.
8. Progressive delivery (Rule #26): user-facing new behavior ships behind env-flag; flag-enable commit is separate; flag-removal commit after validation is separate.

### Executor Competency Matrix

| Competency       | Antigravity (Gemini)                                                                                                                                                                                                  | OpenCode (DeepSeek V4 Flash)                                                                                                                                                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core strength    | Backend, DB migration, RLS policies, cron jobs, AI model routing, security scanning, API logic, cross-cutting concerns                                                                                                | Frontend, React/Tailwind, UI pages, next-intl i18n, Playwright E2E, legal copy, accessibility, documentation                                                                                                                                      |
| Context window   | 1M+ tokens — large refactors, multi-file changes, complex migrations                                                                                                                                                  | Fast iteration — small-to-medium scope, repeating patterns, UI scaffolding                                                                                                                                                                        |
| Best use         | Security-critical paths (guardian, SSRF, RLS), observability, complex business logic, API design, DB schema                                                                                                           | Page creation, component building, i18n keys, test writing, legal text, docs                                                                                                                                                                      |
| Do NOT use for   | UI pages, Tailwind styling, i18n copy, legal text, accessibility fixes — weak visual/UX judgment; small UI diffs waste its large-context strength and historically produce off-queue scope creep (Rule #2/#14 record) | DB migrations, RLS policies, security-critical paths (guardian, SSRF, auth, `timingSafeEqual`), cron/infra, cost-guard logic — lacks security-review depth; a wrong RLS policy or migration without `-- ROLLBACK:` is unrecoverable in production |
| Roster reference | `docs/PARALLEL_EXECUTION_ROSTER.md` — Backend & Data Tier                                                                                                                                                             | `docs/PARALLEL_EXECUTION_ROSTER.md` — Frontend & Presentation Tier                                                                                                                                                                                |

**Current queue assignments:**

**Antigravity (4 ⬜):** Item 90 (dormant-code guard — P0, pre-launch, FIRST) → Item 89 (strategic roadmap seed — P1) → Items 91-92 (post-freeze ≥ Aug 10, do not start earlier). Item 88 ✅ Architect-verified. ⏸ pending: O2 (Sentry-panel founder-gated), K18 (regulator-key founder-gated). 🔴 Final warning active (Rule #14) — any commit outside these items = deactivation.

**OpenCode (0 ⬜):** Queue empty — execute §5 Rule 5: run full-repo `pnpm typecheck + vitest + eslint` gate; take `docs/OPS_DORA.md` metric snapshot; write findings to `docs/PROPOSALS/`.

**Shared / Founder-gated:** 36(O2 — ⏸ Sentry-panel) · 64(K18 — ⏸ regulator-key)

**Queue (top to bottom):**

### P0 — Launch Blocker (required before Aug 1 freeze)

| #   | P   | Work                                                                                                                                                 | Acceptance Criteria                                                                  | Gate         |
| --- | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------ |
| 1   | P0  | **W3-fix** — Add `cost-alarm` cron to `vercel.json`: `"path": "/api/cron/cost-alarm", "schedule": "0 6 * * *"`                                       | `grep cost-alarm vercel.json` = 1 match; total cron path count = 9                   | ✅ `34d06f6` |
| 2   | P0  | **Q1** — `pnpm typecheck && pnpm test && pnpm lint` zero errors/warnings; fix commit if errors found                                                 | All 3 commands pass; output in `docs/METHODOLOGY_AUDITS/quality-gate-2026-07-12.log` | ✅ `8c9c904` |
| 3   | P0  | **S4-path** — `mkdir -p docs/METHODOLOGY_AUDITS && git mv docs/security/S4-restore-drill.md docs/METHODOLOGY_AUDITS/S4-restore-drill-2026-07-12.log` | `ls docs/METHODOLOGY_AUDITS/S4-*` = 1 result                                         | ✅ `f8ca0fc` |

### P1 — Pre-Launch Hardening (before Aug 1)

| #   | P   | Work                                                                                                                       | Acceptance Criteria                                                         | Gate         |
| --- | --- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------ |
| 4   | P1  | **K-CORE verify** — Retro-audit cron processes at least 1 incident into `cross_audit_results`. Evidence: `count(*)` output | `docs/METHODOLOGY_AUDITS/k-core-verify.md`                                  | ✅ `ac4cca9` |
| 5   | P1  | **RLS-audit** — RLS enabled on all tables. Anon client → admin table → 0 rows returned                                     | `docs/METHODOLOGY_AUDITS/rls-audit.md`; missing RLS → migration + ROLLBACK  | ✅ `cd58d2b` |
| 6   | P1  | **E1 user-zero** — Anonymous: homepage → incidents → submit → OG embed. Screenshot each step                               | `docs/METHODOLOGY_AUDITS/user-zero-walkthrough.md` + screenshots            | ✅ `d4109b3` |
| 7   | P1  | **S5-redo** — Lighthouse mobile (home/incidents/submit); 3 JSON reports                                                    | Each page ≥85 or fix committed; `docs/METHODOLOGY_AUDITS/lighthouse-*.json` | ✅ `671795d` |

### P2 — Polish (before Aug 1, non-blocking)

| #   | P   | Work                                                                                                              | Acceptance Criteria                       | Gate         |
| --- | --- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------ |
| 8   | P2  | **Perf-baseline** — LCP/FID/CLS measurement on 3 main pages                                                       | `docs/METHODOLOGY_AUDITS/cwv-baseline.md` | ✅ `c0470b0` |
| 9   | P2  | **C3-complete** — SSRF allowlist verification for openrouter-gateway, OECD feed, import-incidents, fetch-external | `docs/METHODOLOGY_AUDITS/ssrf-audit.md`   | ✅ `c0470b0` |

### Critical — Before Aug 1 Freeze

| #   | P   | Work                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Acceptance Criteria                                                                                                    | Gate         |
| --- | --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------ |
| A1  | P0  | **Copy/legal fix** — Remove "No login required. No account needed." from hero copy in `messages/en.json` + `messages/tr.json`; replace with "Submit anonymously — login optional, identity protected." Add email-hash capture to `src/actions/incidents.ts`: optional email from anonymous submitter, `sha256(email)` → `anonymous_email_hash` column. Migration + `-- ROLLBACK:`. `docs/METHODOLOGY_AUDITS/a1-anon-legal.md` (legal rationale + DSA Art. 14 + Law 5651 references) | `grep "No login required" messages/en.json` = 0; migration shipped; `a1-anon-legal.md` present                         | ✅ `9b10758` |
| A2  | P0  | **External auto-publish** — In `src/app/api/cron/fetch-external/route.ts`: if `source_domain IN trusted_allowlist` then insert with `status = 'published'` (replacing `'pending'`). Allowlist (code constant): `technologyreview.mit.edu`, `404media.co`, `lastweekinai.substack.com`, `theregister.com`. PII guardian check remains active. One-time `UPDATE` cron for existing 97 `pending` records. `docs/METHODOLOGY_AUDITS/a2-external-autopublish.md`                         | `SELECT count(*) FROM external_incidents_queue WHERE status = 'published'` ≥ 50; doc present; SSRF allowlist unchanged | ✅ `aca786d` |
| A3  | P1  | **NVIDIA NGC adapter** — Create `src/lib/ai/adapters/nvidia-ngc.ts` (OpenAI-compatible, base URL `https://integrate.api.nvidia.com/v1`, env `NVIDIA_NGC_API_KEY`). Add `integrate.api.nvidia.com` to SSRF allowlist. Add "NVIDIA NGC" provider to admin panel model list. Add env var + rotation link to `docs/HANDOVER.md`                                                                                                                                                         | Adapter vitest passes; admin panel shows NVIDIA NGC; SSRF allowlist has `integrate.api.nvidia.com` = 1 match           | ✅ `7a029ac` |

### Launch Freeze (Aug 1–9) — Autopilot stops; follow `docs/RUNBOOK_LAUNCH_DAY.md`

### Post-Launch Queue (active Aug 10+ — pre-approved, no new Architect sign-off required)

Dependency order enforced: L1 names → opens L3/L4 gate; L2 MOU → opens L5/L6/L7 gate; K-Full data → triggers L9/L10; revenue path (K-Product+L8) always highest priority.

| #   | P   | Work                                                                                                                                                                                              | Acceptance Criteria                                                                            | Gate                        |
| --- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------- |
| 10  | P0  | **L9** — Methodology Advisory Committee page (`/about/methodology-committee`, EN+TR) + `methodology_committee_members` migration (RLS+ROLLBACK) + invitation template. No overlap with L1 members | Page live, names empty; written consent required before publishing any name (Rule #21 pattern) | ✅ `c740e81` code / ⏸ names |
| 11  | P0  | **L10** — Peer-review pipeline draft: `docs/PAPERS/faact-draft.md` (ACM FAccT target) — K-BENCHMARK methodology summary with data table + draft text                                              | Draft file + K-BENCHMARK sample-size/Wilson-score table embedded                               | ✅ draft / ⏸ submission     |
| 12  | P0  | **L3-verify** — `expert_network` table + `/experts` rep leaderboard end-to-end working? Simulate ≥1 test-expert validation flow                                                                   | Vitest + `docs/METHODOLOGY_AUDITS/l3-verify.md`                                                | ✅                          |
| 13  | P0  | **N1-verify** — Does `/api/v1/oecd/feed` cron actually return published incidents?                                                                                                                | `docs/METHODOLOGY_AUDITS/n1-oecd-verify.md`; ≥1 record as evidence                             | ✅                          |
| 14  | P0  | **L2 outreach list** — TR+EU university MOU target list (15-20 institutions) — template already shipped (`docs/L2_MOU_TEMPLATE.md`)                                                               | `docs/L2_OUTREACH_LIST.md`                                                                     | ✅ list / ⏸ sending         |
| 15  | P0  | **L8** — Role-based dashboard scaffold: `role_view` column (`profiles` table) + 4 empty views (compliance/journalist/legal/safety), no data, UI skeleton only                                     | Migration (RLS+ROLLBACK) + 4 routes; existing RLS not weakened                                 | ✅                          |
| 16  | P0  | **K-Product scaffold** — `private_benchmarks` + `rating_alerts` tables (RLS+ROLLBACK) + billing page skeleton (NO Stripe key, placeholder ENV)                                                    | Migration + `/pricing/enterprise` page; real payment flow inactive until Founder approves      | ✅ code / ⏸ stripe-keys     |
| 17  | P1  | **N2 outreach** — UK AISI + US AISI contact draft (LinkedIn + email text)                                                                                                                         | `docs/N2_OUTREACH_DRAFT.md`                                                                    | ✅ draft / ⏸ sending        |
| 18  | P1  | **L4** — Professional association list (TÜBA, Istanbul Bar AI Committee, IEEE/ACM TR, EU AI Alliance) + invitation template                                                                       | `docs/L4_PARTNERSHIPS.md`                                                                      | ✅ list / ⏸ sending         |
| 19  | P1  | **L5** — Instructor tier: `role = 'instructor'` + curated incident package (20-30 incidents + PDF export)                                                                                         | Migration (RLS+ROLLBACK) + `/academy/instructor` page                                          | ✅                          |
| 20  | P1  | **L6** — Faculty fellowship page + application form + admin review queue                                                                                                                          | `/academy/fellowship` page + `fellowship_applications` table (RLS+ROLLBACK)                    | ✅                          |
| 21  | P2  | **L7** — Student ambassador program page + `student_ambassadors` table + admin CRUD                                                                                                               | Page + migration (RLS+ROLLBACK)                                                                | ✅                          |
| 22  | P2  | **N3** — ISO/IEC + CEN-CENELEC contribution draft: ALPAR taxonomy in working-draft format                                                                                                         | `docs/N3_STANDARDS_CONTRIBUTION.md`                                                            | ✅ draft / ⏸ sending        |
| 23  | P2  | **Art.73 tracker scaffold** — `art73_obligation_status` table (provider-based) + `/transparency/art-73-tracker` page, empty data, UI ready                                                        | Migration (RLS+ROLLBACK) + page                                                                | ✅                          |

**Rule:** This queue is pre-approved (not off-queue under Rule #2) — Antigravity + OpenCode work top-to-bottom, skipping `⏸` items. New exceptions or expansions require Architect approval.

### Post-Launch Trust/Ops/Governance Layer (items 24-40)

**Goal:** Build the legal + operational + fraud-defense infrastructure for the "Moody's for AI" claim, sequentially. Not parallel with items 10-23. Dependency: G1-G3 (legal audit) runs before K13-16 because provider preview + methodology pages reference legal texts.

**Executor assignment by competency:**

- Items 24-26, 31-32, 37-38, 39-40: **Antigravity** (DB migrations, security, infra)
- Items 27-30, 33-36: **Antigravity** (backend cron, DB schema)
- Items 39-40: **OpenCode** (documentation, HANDOVER content)

| #   | P   | Work                                                                                                                                                                                                                       | Acceptance Criteria                                                                                                | Gate                            |
| --- | --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| 24  | P0  | **G1 — Terms of Service gap audit** — `/legal/terms` (80L existing) EN+TR next-intl? Content: no-liability for incident scores, "Ready aligned" wording (Rule #5), K-BENCHMARK score disclaimer                            | `docs/METHODOLOGY_AUDITS/g1-terms-audit.md` + gap fill commit                                                      | ✅                              |
| 25  | P0  | **G2 — Privacy Policy gap audit** — `/legal/privacy` (90L) KVKK + GDPR alignment; complete third-party list (Supabase, Vercel, Resend, Sentry, Plausible, OpenRouter, Turnstile); DPO contact; data retention periods      | `docs/METHODOLOGY_AUDITS/g2-privacy-audit.md` + gap fill; if KVKK section missing → separate `/legal/kvkk` page    | ✅                              |
| 26  | P0  | **G3 — Responsible Disclosure + security.txt** — RFC 9116-compliant `public/.well-known/security.txt` (contact, expires, preferred-languages, canonical); cross-reference with `/security` page (126L existing)            | `curl https://alparai.com/.well-known/security.txt` → 200 + valid format; page shows Contact/Expires               | ✅                              |
| 27  | P0  | **K13 — Provider 60-day preview queue** — Model providers preview K-BENCHMARK scores 60 days before publication via email. `k_provider_previews` migration (RLS+ROLLBACK) + cron; email template (EN)                      | Migration + `/api/cron/k-provider-preview` route + vitest; test record enters queue; cron picks up records 60d out | ✅ (`77919b7`) code / ⏸ sending |
| 28  | P0  | **K14 — Methodology public page** — `/methodology/k-benchmark` page (EN+TR): categories, Wilson score explanation, cross-audit pipeline diagram, data sources, "not verified compliance rating" disclaimer                 | Page live; `docs/K_BENCHMARK_METHODOLOGY.md` content referenced; linked from footer                                | ✅ (`3876335`)                  |
| 29  | P0  | **K15 — Weekly K-BENCHMARK re-audit cron** — Retro-audit runs daily; K-BENCHMARK gets separate `weekly-rating-refresh` cron (Sunday 08:00 UTC). Captures new model releases                                                | Added to `vercel.json`; route + vitest; `k_model_scores.last_audited_at` updated                                   | ✅ (`ef11925`)                  |
| 30  | P1  | **K16 — Model score history** — `k_model_scores_history` MAT view or table (RLS+ROLLBACK); `/ratings/[modelSlug]/history` page (add dynamic segment first); time-series chart (LCP-friendly SSR chart)                     | Migration + page; ≥1 model with date×score chart live                                                              | ✅ (`83d1de5`)                  |
| 31  | P1  | **G4 — Data retention schedule** — `docs/DATA_RETENTION.md` (table-based: raw evidence 24mo, audit_logs 5yr, PII 12mo, deleted_users 30d grace); `data_retention_policies` reference table (RLS+ROLLBACK)                  | Doc + migration; ≥1 record per `public.*` table in policy table                                                    | ✅ (`6aa349c`)                  |
| 32  | P1  | **G5 — Provider name redaction workflow** — When a named incident receives a provider name redaction request → admin queue. `redaction_requests` migration (RLS+ROLLBACK) + admin page; hook into `process-deletions` cron | Migration + `/admin/redaction-queue` page; test: request → approve → provider name replaced with asterisks         | ✅ (`6aa349c`)                  |
| 33  | P1  | **F1 — Duplicate incident detection** — `pg_trgm` fuzzy match in submit path; score >0.7 → "possible duplicate" flag in review queue. Migration `CREATE EXTENSION pg_trgm` (RLS-safe) + submit action patch                | Migration + submit test: same title with near-variant flags; false-positive rate <5% (10 examples)                 | ✅ (`5511305`)                  |
| 34  | P1  | **F2 — IP + device throttle** — `submission_attempts` counter (24h/IP) on top of Upstash rate limit. >10 → admin review. `submission_attempts` migration (RLS+ROLLBACK)                                                    | Migration + submit path patch + vitest                                                                             | ✅ (`5511305`)                  |
| 35  | P1  | **O1 — Public status page** — `/status` page: Vercel deployment status + Supabase health + Upstash + 90-day uptime (static or Instatus embed). Self-hosted route, third-party embed CSP allowed                            | Page live; 4 service cards (green/yellow/red); Rule #9 SSRF-safe                                                   | ✅ (`6d59ded`)                  |
| 36  | P1  | **O2 — Sentry alerting rules** — Critical error thresholds: `error_rate >2%` for 5min → email; `cron.failed` → email. Alerting matrix in `docs/OPS_RUNBOOK.md`                                                             | Sentry project settings screenshot as proof; runbook doc present                                                   | ⬜ code / ⏸ Sentry-panel        |
| 37  | P0  | **O3 — Cost telemetry migration** — `cross_audit_runs` table (model, tokens_in, tokens_out, cost_usd, latency_ms) — RLS+ROLLBACK. Rule #20 alarm feeds from this table                                                     | Migration + gateway/cross-audit-engine patch; ≥1 row in test env; cost-alarm cron now reads real data              | ✅ (`62091e7`)                  |
| 38  | P1  | **O4 — PITR restore test** — Supabase Point-in-Time Recovery: restore to 10 min ago in scratch project, 1 sanity query; `docs/METHODOLOGY_AUDITS/o4-pitr-drill.log`                                                        | Log + RTO measurement                                                                                              | ✅ (`a6ff2c5`)                  |
| 39  | P0  | **B1 — CLAUDE.md init** — `CLAUDE.md` in repo root: architecture summary (stack, folder structure), key files (guardian, cross-audit-engine, openrouter-gateway), test/lint commands, critical Standing Rules summary      | File present; test by opening a new session and asking "what is this project?" — correct answer                    | ✅ (`3b5b54b`)                  |
| 40  | P0  | **B2 — Founder handover doc** — `docs/HANDOVER.md`: vendor accounts (Supabase, Vercel, Resend, OpenRouter, Vertex, Upstash, Cloudflare, Sentry, Plausible, Stripe stub), recovery path + rotation cadence for each         | File present; ≥10 vendor rows; zero plain-text secrets (links to rotation locations only)                          | ✅ (`217e1b7`)                  |

**Dependency graph (items 24-40):** G1/G2/G3 → K13/K14 (legal text references) → K15/K16 (methodology transparency) · G4 → G5 → F1/F2 (retention policy frames fraud definition) · O3 → Rule #20 real data (priority elevated) · B1/B2 (bus factor) safety net at every stage.

### Innovation Layer (items 41-45) — Qwen 360° Analysis + Founder Input

**Executor assignment:** All items → **Antigravity** (backend logic) with **OpenCode** handling UI/page components.

| #   | P   | Work                                                                                                                                                                                                                                                                                                    | Acceptance Criteria                                                                                    | Gate           |
| --- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------- |
| 41  | P1  | **ST1 — Streisand Transparency Report** — `transparency_reports` migration (RLS+ROLLBACK): request date, requester category (AI firm / PR firm / legal), action taken. `/transparency/legal-threats` public page. Every C&D/DMCA → auto-logged. Name/detail empty until Founder approves                | Migration + page; test record → visible on page; `docs/METHODOLOGY_AUDITS/st1-design.md`               | ✅ (`8e88c2b`) |
| 42  | P1  | **CQ1 — Community Challenge Bank** — `challenge_submissions` + `challenge_votes` tables (RLS+ROLLBACK). `/challenges` page: user submits AI test scenario → cross-audit engine runs → score published. `reputation_score` = verified prior contributions × weight                                       | Migration + 2 pages (list + detail) + cross-audit integration; `docs/METHODOLOGY_AUDITS/cq1-design.md` | ✅ (`15ed21a`) |
| 43  | P2  | **ZK1 — Zero-Knowledge Submission** — Optional client-side AES-256-GCM encryption on submit form (SubtleCrypto API). Sensitive evidence text arrives encrypted; key stays only with submitter. `encrypted_evidence boolean` flag + `evidence_ciphertext text` column migration (RLS+ROLLBACK)           | Vitest (encrypt/decrypt round-trip); `docs/METHODOLOGY_AUDITS/zk1-design.md`                           | ✅ (`37b829e`) |
| 44  | P1  | **DM1 — Dynamic Model Routing v2** — Extend `src/lib/audit/model-router.ts`: `severity_score < 0.4` → "basic" tier (NVIDIA NGC + Cohere); ≥ 0.4 → "deep" tier (existing 5-model debate). `cross_audit_runs` cost telemetry recorded (O3 prerequisite)                                                   | Vitest (routing decisions); ≥30% cost savings on basic incidents; O3 must be complete first            | ✅ (`d04cf71`) |
| 45  | P2  | **RA1 — B2B AI Risk API v1** — `/api/v1/risk-score/{company_slug}` endpoint: Wilson-score + K-BENCHMARK + incident_count aggregation. OpenAPI schema (`public/api-spec/risk-score.yaml`) + `docs/API_RISK_SCORE.md`. Rate-limit: 100 req/day anonymous, unlimited with API key (K-Product prerequisite) | Endpoint vitest; OpenAPI schema file; doc present; K-Product must be complete first                    | ✅ (`922a256`) |

### DORA Elite++ Layer (items 46-57) — Testing / Reliability / Observability

**Goal:** Rule #26/#27/#28 implementation. Deploy freq daily, MTTR ≤ 30min, change-failure-rate ≤ 10%, error budget discipline. Order: E-series (testing) → SL-series (reliability/observability). Independent items processed sequentially.

**Executor assignment:** E-series backend items (E2, E4, E7, E8) → **Antigravity**. E-series frontend items (E1, E3, E5, E6) + all SL-series → **OpenCode**.

| #   | P   | Work                                                                                                                                                                                                     | Acceptance Criteria                                                                | Gate           |
| --- | --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------- |
| 46  | P0  | **E1 — E2E test suite expansion** — Playwright critical paths: submit-flow (anonymous + auth), ratings view, incident detail + share, admin queue triage. `test:e2e` ≥ 12 scenarios. CI gate.            | `pnpm test:e2e` green; each scenario in `docs/METHODOLOGY_AUDITS/e1-e2e-report.md` | ✅ (`447996f`) |
| 47  | P0  | **E2 — Contract tests** — Pact or Zod-schema-based contract test for every `/api/v1/*` route. Response schema change breaks CI. Schemas in `src/contracts/*.ts`.                                         | All v1 routes covered; adding a new route without contract breaks CI               | ✅ (`0b912db`) |
| 48  | P1  | **E3 — Load testing baseline** — k6 script (`ops/load/`) for `/`, `/incidents`, `/ratings` at 100 rps sustained 5 min. p95 < 300ms target. `docs/METHODOLOGY_AUDITS/e3-load-baseline.md`                 | Report present; p95 < 300ms; regression threshold documented                       | ✅ (`930801f`) |
| 49  | P1  | **E4 — Mutation testing** — Stryker.js on `src/lib/pii/guardian.ts`, `src/lib/ai/cross-audit-engine.ts`, `src/lib/audit/model-router.ts`, `src/lib/ai/cost-guard.ts`. Score ≥ 60%.                       | Report at `docs/METHODOLOGY_AUDITS/e4-mutation.md`; score in table                 | ✅ (`0b912db`) |
| 50  | P1  | **E5 — Accessibility CI gate** — `@axe-core/playwright` integration; critical pages WCAG 2.2 AA (0 critical, 0 serious findings). CI gate.                                                               | `docs/METHODOLOGY_AUDITS/e5-a11y.md`; violations = 0                               | ✅ (`930801f`) |
| 51  | P2  | **E6 — Visual regression** — Playwright screenshot diff, 8 key pages. `test:visual` script. Baseline at `ops/visual-baseline/`.                                                                          | Diff tolerance ≤ 0.1%; CI gate                                                     | ✅ (`930801f`) |
| 52  | P0  | **E7 — Security scanning CI** — GitHub Actions: `semgrep --config auto` + `trivy fs .` + `npm audit --production --audit-level=high` + `gitleaks`. Critical finding → CI fails.                          | `.github/workflows/security.yml` present; all 4 tools green                        | ✅ (`37b829e`) |
| 53  | P1  | **E8 — SBOM + supply chain** — CycloneDX SBOM (`ops/sbom/latest.json`) + Sigstore (cosign) commit signing policy. `docs/OPS_SUPPLY_CHAIN.md`.                                                            | SBOM generated in CI; every release signed                                         | ✅ (`37b829e`) |
| 54  | P0  | **SL1 — SLI/SLO definition + dashboard** — `docs/OPS_SLO.md`: availability, latency p50/p95/p99, error rate, cross-audit success rate. Plausible + Sentry queries. `/admin/slo-dashboard` page.          | Doc + page; reads 30-day data for each SLI                                         | ✅ (`b68596e`) |
| 55  | P0  | **SL2 — Automatic rollback wire** — Vercel deployment 5xx spike > 2% for 5 min → revert to previous deployment (`api/webhooks/sentry-alert` route). Runbook at `docs/OPS_ROLLBACK.md`.                   | Simulated test: fake 5xx spike → rollback triggered as proof; runbook present      | ✅ (`37b829e`) |
| 56  | P1  | **SL3 — Chaos day playbook** — Fault injection scenarios: Supabase 500, Upstash timeout, Vertex 429, OpenRouter down. Expected graceful degradation for each. `docs/OPS_CHAOS.md` + quarterly drill log. | 4 scenarios documented; 1 drill logged                                             | ✅ (`37b829e`) |
| 57  | P1  | **SL4 — Golden signals dashboard** — `/admin/signals`: latency, traffic (RPS), errors, saturation (DB conn, memory). 60s refresh. Sentry + Vercel Analytics data.                                        | Page live; 4 cards visible                                                         | ✅ (`b68596e`) |

### Governance / Regulator / Recovery (items 58-70)

**Executor assignment:** DB-heavy items (58-66) → **Antigravity**. Documentation items (67-68) → **OpenCode**. DR items (69-70) → **Antigravity**.

| #   | P   | Work                                                                                                                                                                                                               | Acceptance Criteria                                                      | Gate                                  |
| --- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------- |
| 58  | P1  | **G6 — Cookie consent banner** — ePrivacy + KVKK-compliant granular consent (necessary / analytics / marketing). Plausible already cookie-free; record user choice. `cookie_consent_log` migration (RLS+ROLLBACK). | Banner live; consent logged; opt-out 100% functional                     | ✅ (`5dbff06`)                        |
| 59  | P0  | **G7 — DSAR automation** — GDPR Art. 15 + KVKK Art. 11: machine-readable user data export. `/api/v1/dsar/export` (auth required) + admin queue. 30-day SLA counter.                                                | Endpoint + admin page + vitest; test export JSON valid                   | ✅ (`922a256`)                        |
| 60  | P1  | **G8 — Age gate** — COPPA (US <13) + UK Online Safety Act (<18 extra protection). Self-declaration checkbox + audit log in submit path.                                                                            | Checkbox + `age_declarations` migration; submit path patched             | ✅ (`184db3b`)                        |
| 61  | P1  | **L11 — Advisory rotation cadence** — 2-year term limit, 50% rotation per year. `advisory_board_terms` migration; `docs/L11_ROTATION_POLICY.md`.                                                                   | Migration + doc                                                          | ✅ (`db7e5bd`)                        |
| 62  | P1  | **L12 — Peer-review journal** — `/methodology/corrections` public page: methodology updates, retractions, version history. `methodology_versions` migration.                                                       | Page + migration; test record visible                                    | ✅ (`db7e5bd`)                        |
| 63  | P1  | **K17 — Model retirement policy** — Cron: model deprecated in OpenRouter/NVIDIA/HF for 60 days → `k_model_scores.status = 'retired'` + UI badge.                                                                   | Cron + vitest; retired badge visible in UI                               | ✅ (`22ce2c2`)                        |
| 64  | P1  | **K18 — External auditor API** — Read-only `auditor_role` (Supabase role), `/api/v1/auditor/*` endpoints (K-BENCHMARK raw + methodology + audit_logs). API key gate.                                               | Migration + endpoint + `docs/API_AUDITOR.md`; regulator-compliant access | ✅ (`98c160c`) code / ⏸ regulator-key |
| 65  | P1  | **F3 — Sybil detection** — FingerprintJS + graph analysis in submit path (same fingerprint N submissions → review queue). `submission_fingerprints` migration.                                                     | Migration + vitest; false-positive < 5% (10 examples)                    | ✅ (`922a256`)                        |
| 66  | P1  | **F4 — Moderation SLA** — Review queue: p95 triage < 4h. Cron alarm on threshold breach. `moderation_sla` view.                                                                                                    | Alarm working; SLA metric on dashboard                                   | ✅ (`922a256`)                        |
| 67  | P2  | **N5 — TR AISI dialogue** — Ministry of Industry + TÜBİTAK contact draft; `docs/N5_TR_AISI_DRAFT.md`.                                                                                                              | Doc present                                                              | ✅ (`5c3e586`)                        |
| 68  | P2  | **N6 — KVKK Board engagement** — Official communication draft + data processing inventory (VERBIS).                                                                                                                | `docs/N6_KVKK_ENGAGEMENT.md` + VERBIS inventory draft                    | ✅ (`5c3e586`)                        |
| 69  | P0  | **DR1 — Multi-region DR drill** — Vercel fra1 → iad1 failover scenario; Supabase read-replica; RTO ≤ 15min, RPO ≤ 5min. Log at `docs/METHODOLOGY_AUDITS/dr1-drill.log`.                                            | Drill log; RTO/RPO measured                                              | ✅ (`9e09c1d`)                        |
| 70  | P1  | **DR2 — Data portability** — GDPR Art. 20: full user data `.zip` (JSON + evidence PDFs) via `/api/v1/dsar/portable`. Extension of G7.                                                                              | Endpoint + vitest + test download                                        | ✅ (`9e09c1d`)                        |

### Bug Fix Sprint (items 71-82) — Antigravity 360° Audit Findings

**Goal:** Production errors identified in 2026-07-12 audit. P0: deployment blocker. P1: active error groups. P2: security + quality. Order: P0 → P1 → P2 (sequential). **Executor: all items → Antigravity** (deployment and backend fixes); **OpenCode** handles i18n items (73-74, 81).

#### P0 — Deployment Blocker

| #   | P   | Work                                                                                                                                                                                                                           | Acceptance Criteria                                                                                   | Gate           |
| --- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | -------------- |
| 71  | P0  | **BF1 — pnpm-lock.yaml + jszip sync** — `pnpm install` → update lockfile → commit. OR remove `jszip` from `package.json`, keep `src/lib/utils/zip.ts` custom impl. Founder decision: replace (more robust) vs remove (faster). | `pnpm install --frozen-lockfile` succeeds; Vercel build green                                         | ✅ (`52753f5`) |
| 72  | P0  | **BF2 — Create `src/middleware.ts`** — Combined next-intl `createMiddleware` + Supabase SSR `updateSession`. Locale redirect, session refresh, `/admin/**` auth guard, rate-limit poke.                                        | `pnpm typecheck` ✓; anonymous `/` → `/{locale}/`; `/admin` unauth → `/login`; i18n locale detection ✓ | ✅ (`b7719ad`) |

#### P1 — Production Error Elimination

| #   | P   | Work                                                                                                                                                                                                                                                                                            | Acceptance Criteria                                                     | Gate           |
| --- | --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------- |
| 73  | P1  | **BF3 — Footer i18n missing keys** — Add `footer.links.methodology` + `footer.links.challenges` to `messages/en.json` + `messages/tr.json`.                                                                                                                                                     | MISSING_MESSAGE error count = 0; footer renders without errors in EN+TR | ✅ (`e1516e8`) |
| 74  | P1  | **BF4 — Admin panel TR translation** — Missing keys: `admin.activity_target_entity`, `admin.delete`, `admin.recent_activities`, `admin.tabQueue`, `admin.finance_alert_limit`, `admin.total_score`, `admin.nvidia_desc`, `admin.google_vertex_desc`, `admin.blackbox_desc`, `admin.save` (10+). | Admin panel TR runtime MISSING_MESSAGE = 0                              | ✅ (`e1516e8`) |
| 75  | P1  | **BF5 — Gemini API 400 fix** — 78 errors / 8 users. Verify `GOOGLE_API_KEY` / `GEMINI_API_KEY` env; check model endpoint changes. If key rotation needed → notify Founder via `docs/PROPOSALS/`.                                                                                                | Error count = 0; key rotated or endpoint fixed                          | ✅ (`e1516e8`) |
| 76  | P1  | **BF6 — RSS feed retry mechanism** — `src/app/api/cron/fetch-external/route.ts`: exponential backoff (2s/4s/8s, max 3 retries). Total Vercel function timeout < 60s.                                                                                                                            | Retry on timeout; verified with vitest mock                             | ✅ (`e1516e8`) |

#### P2 — Code Quality / Security

| #   | P   | Work                                                                                                                                                                     | Acceptance Criteria                                         | Gate            |
| --- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | --------------- |
| 77  | P2  | **BF7 — `vercel.json` pnpm alignment** — `buildCommand: "npm run build"` → `pnpm build`; `installCommand: "npm install"` → `pnpm install --frozen-lockfile` (or remove). | Vercel logs show `pnpm`; no `npm` remaining                 | ✅ (pre-sprint) |
| 78  | P2  | **BF8 — `moderation-sla-alarm` cron** — Add `/api/cron/moderation-sla-alarm` to `vercel.json` crons (daily or hourly).                                                   | Visible in Vercel cron dashboard; test trigger ✓            | ✅ (`e492d7e`)  |
| 79  | P2  | **BF9 — FingerprintJS fallback → `crypto.randomUUID()`** — `src/lib/utils/fingerprint.ts`: `Math.random().toString(36)...` → `crypto.randomUUID()`.                      | Vitest mock; fallback returns UUID format on every call     | ✅ (`e1516e8`)  |
| 80  | P2  | **BF10 — DSAR explicit column select** — `src/app/api/v1/dsar/portable/route.ts`: `select("*")` → `select("id,email,created_at,...")`.                                   | Vitest: internal flag fields absent from export             | ✅ (`e1516e8`)  |
| 81  | P2  | **BF11 — i18n delta CI check** — Add EN+TR key symmetry check to `.github/workflows/ci.yml` or `i18n-check.yml`; missing TR key → CI fails.                              | Missing key breaks CI; `pnpm run i18n:check` command exists | ✅ (`e1516e8`)  |
| 82  | P2  | **BF12 — Cost thresholds to env** — `src/app/api/cron/cost-alarm/route.ts`: `const dailyWarningThreshold = 50` → `process.env.COST_WARNING_DAILY ?? 50`.                 | Setting env var changes threshold; vitest ✓                 | ✅ (`e1516e8`)  |

### Launch Blocker Sprint (items 83-87) — KİMİAİ 360° Live Analysis (2026-07-13)

**Goal:** Critical bugs and legal risk that would block launch. Process 83 (P0) before 84 (P0) — not parallel.

#### P0 — Launch Blocker

**Executor: OpenCode** (frontend data flow + legal pages)

| #   | P   | Work                                                                                                                                                                                                                                                                                                                                                                                           | Acceptance Criteria                                                                                 | Gate           |
| --- | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------- |
| 83  | P0  | **UI/API data sync fix** — `/incidents` page shows "0 Documented AI failures" while API returns `142`. Verify `src/app/[locale]/incidents/page.tsx` (or related component) correctly fetches from `/api/v1/incidents` endpoint; audit `/leaderboard` page the same way.                                                                                                                        | `/incidents` and `/leaderboard` show real counts (≥60); `pnpm typecheck` ✓                          | ✅ (`1203967`) |
| 84  | P0  | **Legal: Imprint + GDPR "permanent record" fix** — Legal risk: (a) company jurisdiction information missing; (b) "permanent record" language conflicts with GDPR Art. 17. Create `/legal/impressum` page (EN+TR): company name, address, jurisdiction, contact. `messages/{en,tr}.json` → `legal.impressum.*` namespace. Replace "permanent record" in Terms/Privacy with GDPR-compliant text. | `/legal/impressum` returns 200; "permanent record" = 0 matches in Terms/Privacy; `pnpm typecheck` ✓ | ✅ (`1203967`) |

#### P1 — Post-Launch Readiness

**Executor: Antigravity** (85 — backend caching, DB migration), **Antigravity** (86 backend) + **OpenCode** (86 UI + 87 extension)

| #   | P   | Work                                                                                                                                                                                                                                                                                                                                                            | Acceptance Criteria                                                                                            | Gate           |
| --- | --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------- |
| 85  | P1  | **Cross-audit Redis caching** — Each cross-audit call makes 5 LLM API requests; repeating the same prompt doubles cost. `src/lib/ai/cross-audit-engine.ts`: SHA-256(prompt) → Upstash Redis key; TTL 1 hour; cache miss → 5 model calls; cache hit → return from Redis. Add `cache_hit boolean` column to `cross_audit_runs` (migration, RLS+ROLLBACK).         | Vitest: same prompt returns from Redis on second call; `cost_usd` = 0 on second call; migration shipped        | ✅ (`1203967`) |
| 86  | P1  | **Stripe/Pro tier payment flow** — Pro tier pricing scaffolded in `c376a55` but checkout missing. `@stripe/stripe-js` + `stripe` package integration; `/api/webhooks/stripe` route (RLS-safe); `subscriptions` migration (RLS+ROLLBACK); pricing page "Upgrade" → Stripe Checkout. Test: Stripe test-mode checkout → webhook → record in `subscriptions` table. | Stripe test-mode checkout succeeds; webhook returns `200`; record in `subscriptions` table; `pnpm typecheck` ✓ | ✅ (`1203967`) |
| 87  | P2  | **Browser extension MVP** — `apps/extension/` scaffolded but MV3 manifest + content script missing. Chrome MV3 manifest; content script: query `/api/v1/incidents?domain=` for visited URL; show badge + popup if findings found.                                                                                                                               | Extension loads; `chrome.tabs` domain query works; popup shows incident count                                  | ✅ (`1203967`) |

### Launch Gate Sprint (item 88)

**Executor: Antigravity** (server-side command execution + full environment access)

| #   | P   | Work                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Acceptance Criteria                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Gate                                                                                                                                                                                                                                                                                    |
| --- | --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 88  | P0  | **Final pre-launch smoke test** — User-zero on production: (a) `/incidents` shows ≥100 records, (b) `/leaderboard` is not empty, (c) `/legal/imprint` returns 200 + jurisdiction content is visible, (d) `pnpm typecheck && pnpm test && pnpm lint` on HEAD `5c7f958` — zero errors. Evidence: `docs/METHODOLOGY_AUDITS/launch-gate-v10.md` (screenshots + command output).                                                                                                                                                                                                                                                                                                | Run in order, screenshot each: (1) `curl -s https://alparai.com/api/v1/incidents \| jq '.total'` → ≥100; (2) `curl -s https://alparai.com/api/v1/leaderboard \| jq 'length'` → >0; (3) `curl -sI https://alparai.com/legal/imprint \| head -1` → `HTTP/2 200` AND jurisdiction text visible in rendered page; (4) `pnpm typecheck && pnpm test && pnpm lint` on HEAD `5c7f958` → exit code 0. PASS = all 4 succeed + full output committed in `docs/METHODOLOGY_AUDITS/launch-gate-v10.md`. Any check failing = item stays ⬜: record exact failure evidence + proposed fix in `docs/PROPOSALS/` (§8/6), do not mark ✅ until re-run passes | ✅ `ac15382` — Architect-verified on tested HEAD `50955cc`; evidence `docs/METHODOLOGY_AUDITS/launch-gate-v10.md` (411 published incidents, screenshots). Accepted deviation: `/api/v1/incidents` is auth-gated by design → public curl returns 401; DB count + authorized request used |
| 89  | P1  | **Strategic Roadmap 2026-2028 seed** — Single migration `supabase/migrations/<ts>_strategic_roadmap_2026_2028.sql` inserting 12 milestone rows into `strategy_milestones` exactly as specified in the Architect plan (three phases: Foundation 2026-Q3 ×4, Institutions 2026-Q4 ×4, Expansion 2027 ×4 — quarter/title/okr_text/progress/status/linked_metric values are FIXED, copy verbatim from the approved plan table, no rewording). Each INSERT guarded `WHERE NOT EXISTS (... WHERE title = ...)` (table has no unique key). Existing 5 Academy rows untouched. `-- ROLLBACK:` block deleting exactly the 12 new titles. No UI change, no RLS change, no new table. | (1) `pnpm db:migrate` clean; (2) `SELECT count(*) FROM strategy_milestones` = 17; (3) re-run migration adds 0 rows; (4) `/admin/strategy/roadmap` renders 17 milestones grouped by quarter; (5) `pnpm lint && pnpm typecheck` green. Evidence: `docs/METHODOLOGY_AUDITS/roadmap-seed-v10.md`                                                                                                                                                                                                                                                                                                                                                | ⬜                                                                                                                                                                                                                                                                                      |
| 90  | P0  | **Dormant-code guard (pre-launch)** — Off-queue code from `41b571c`/`ac15382` stays in repo but MUST be provably inert: (a) `src/agents/marketing/social_publisher.ts` — hard guard: unless `process.env.MARKETING_AUTOPILOT === "enabled"`, ALL publish paths simulate (no external fetch); env var stays UNSET in Vercel. (b) Spark agent: no cron entry, no launcher registration — verify `vercel.json` + `ops/` contain no active hook. (c) `src/lib/vault.ts`: zero callers (grep). No feature work, guard-only commit.                                                                                                                                              | (1) `grep -rn "MARKETING_AUTOPILOT" src/agents/marketing/` ≥1 guard per publish method; (2) `grep -rn "spark" vercel.json` = 0; (3) `grep -rln "from .*vault" src/ \| grep -v vault.ts` = 0; (4) `pnpm lint && pnpm typecheck` green. Evidence: `docs/METHODOLOGY_AUDITS/dormant-guard-v10.md`                                                                                                                                                                                                                                                                                                                                              | ⬜                                                                                                                                                                                                                                                                                      |
| 91  | P1  | **[POST-FREEZE ≥ Aug 10] Wave triage** — Convert the useful parts of `docs/PROPOSALS/007-mbs-innovation-audit.md` into concrete queue items with acceptance criteria: Cost Router (tiering), Cron Monitor (`cron_job_logs` table, RLS+ROLLBACK), Autopilot dashboard real data. LinkedIn items EXCLUDED (§7/11 founder-gated). Output is a PROPOSAL for Architect sign-off, not direct implementation.                                                                                                                                                                                                                                                                     | Proposal doc in `docs/PROPOSALS/` with per-item acceptance criteria; no code commits under this item                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | ⬜                                                                                                                                                                                                                                                                                      |
| 92  | P2  | **[POST-FREEZE ≥ Aug 10] Retire vault.ts** — Remove `src/lib/vault.ts` + `.vault.json` path logic; secrets live ONLY in Vercel env vars. File-based secret store does not work on serverless (ephemeral FS) and widens attack surface.                                                                                                                                                                                                                                                                                                                                                                                                                                     | `src/lib/vault.ts` deleted; `grep -rn "vault" src/` = 0 runtime refs; `pnpm lint && pnpm typecheck && pnpm test` green                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | ⬜                                                                                                                                                                                                                                                                                      |

**Item 89 fixed seed data (copy verbatim — Architect-authored, do not reword):**

| quarter | title                          | okr_text                                                                     | progress | status      | linked_metric        |
| ------- | ------------------------------ | ---------------------------------------------------------------------------- | -------- | ----------- | -------------------- |
| 2026-Q3 | Launch Gate — Go Live Aug 2    | Pass final smoke test (Item 88); zero P0 defects; freeze Aug 1-9             | 95       | in_progress | launch_gate          |
| 2026-Q3 | First-Story Offensive          | Publish 3 flagship incident stories from the 400+ registry; ≥5 media pickups | 10       | planned     | media_mentions_count |
| 2026-Q3 | İş Bank AI Factory Application | Submit application (docs/APPLICATIONS/001); reach interview shortlist        | 60       | in_progress | funding_pipeline     |
| 2026-Q3 | 1,000 Registered Users         | Convert launch traffic; activate Founding Reporter badge loop                | 5        | planned     | total_users          |
| 2026-Q4 | K-BENCHMARK Public Credibility | Methodology Committee ≥3 named members; FAccT paper submitted                | 25       | planned     | expert_count         |
| 2026-Q4 | Enterprise Pilot ×3            | 3 corporate pilots (bank/telecom/insurer) on B2B risk-score API              | 0        | planned     | enterprise_pilots    |
| 2026-Q4 | Revenue Ignition               | Stripe live; first paying Pro subscribers; MRR > 0                           | 0        | planned     | mrr_cents            |
| 2026-Q4 | Regulator Bridge               | KVKK + TR AISI working contact; OECD AIM feed cited                          | 30       | planned     | regulator_contacts   |
| 2027-Q1 | EU Art. 73 Readiness Product   | Compliance-report generator for Dec 2, 2027 deadline; 10 beta customers      | 0        | planned     | art73_beta           |
| 2027-Q2 | Certified AI Auditor Program   | Academy certification cohort #1 (≥25 auditors)                               | 0        | planned     | certification        |
| 2027-Q3 | EU Market Entry                | EN/DE landing; 2 EU enterprise customers; EU entity decision                 | 0        | planned     | eu_customers         |
| 2027-Q4 | Series-A Readiness             | ≥$20K MRR, ≥5K incidents, ≥2 regulator citations → raise                     | 0        | planned     | series_a_gate        |

**DORA metrics current state (v8.8 baseline):**

- Deploy frequency: daily (dual-executor parallel work — 20+ commits/day) ✅
- Lead time: not measured — measured after item 54 (SL1)
- MTTR: not measured — automated after item 55 (SL2)
- Change failure rate: not measured — measured after item 54

## §6 Launch Freeze

**Aug 1–9:** Only D/W-series work + hotfixes. Autopilot stops queue work; follow `docs/RUNBOOK_LAUNCH_DAY.md`. Post-Launch Queue (item 10+) activates automatically on Aug 10 — no new Architect sign-off required.

## §7 Founder Pending Decisions (do not block autopilot)

1. 🔴 **R1** `[LAUNCH-CRITICAL — decision needed before Aug 1]` — GitHub repo → private (Settings → Danger Zone). Not yet verified. A public repo pre-launch is a security risk.
2. ✅ **R2** — 6 token rotations complete (Supabase service-role, Vercel, Resend, OpenRouter, Vertex, Upstash). Completed by Antigravity before `d9181dc`.
3. ✅ **R3** — NVIDIA NGC API key added to env (A3 `7a029ac` complete).
4. L1 advisory board candidate selection (7 seats; advisory-board page + invitation template shipped — names empty until Founder approves).
5. Cost ceiling approval ($50/$100/$500 defaults are active).
6. ✅ **BF1 resolved** — `jszip` removed from `package.json` (`52753f5`); `pnpm install --frozen-lockfile` passes; Vercel build unblocked.
7. ✅ **Gemini API fix (BF5)** — `src/lib/ai/adapters/vertex-gemini.ts` fixed (`e1516e8`). Error count expected to be 0.
8. ⏸ **K18 regulator-key** — Supabase `auditor_role` API key on hold until regulator relationship is established.
9. **GPG commit signing** — Existing commits unverified. Enabling is a Founder decision.
10. ✅ **UI data sync (item 83)** — `/incidents` + `/leaderboard` data sync code committed (`1203967`). Confirmation via item 88 prod smoke test.
11. 🔴 **LinkedIn automation (Rule #6)** `[LAUNCH-CRITICAL — decision needed before Aug 1]` — `ops/linkedin-assets/alpar-update.js` (puppeteer, 148 lines) was added in commit `56feb24` concealed under a "chore(seo)" label. Rule #6: external posting automation without an approved queue item is forbidden. Founder decision: **revert or accept?**
12. ✅ **Max-automation strategy (2026-07-15)** — Founder directive: goal is maximum automation. Ratified Architect verdict: "max automation, disciplined sequence" — zero new features before launch; Waves 1-3 from `docs/PROPOSALS/007-mbs-innovation-audit.md` deferred to post-freeze (≥ Aug 10) via items 91-92; social publisher + Spark dormant via item 90; LinkedIn stays gated under §7/11; identity "MBS" not recognized; Rule #14 FINAL WARNING issued.
13. **`/legal/impressum` URL decision** `[LAUNCH-CRITICAL — decision needed before Aug 1]` — `/legal/imprint` page is content-complete (jurisdiction + GDPR fix ✅, `1203967`) but item 84 acceptance criterion required `/legal/impressum` returning 200. Founder decision: **is `/imprint` acceptable, or should a `/impressum` redirect/alias be added?**

## §8 Report Contract

Every Executor report must include:

1. `origin/master` commit hash
2. Accept pass/fail table + validation method
3. Deviations/blockers; proposals reference `docs/PROPOSALS/`
4. Final line: `Verified-Against: origin/master HEAD = <hash>`
5. If push failed: "unpushed — retry pending" (silent success claim is forbidden)
6. If any acceptance criterion fails: write exact failure evidence + proposed fix to `docs/PROPOSALS/` before closing the report. Do not mark item ✅ until re-verified.

## §9 Post-Launch Horizon (undated, ordered)

Detailed, acceptance-criteria backlog is in §5 (items 10-23) — this section is high-level summary only. Executors use §5, not this list.

1. ~~**K-Full** (K9-K12)~~ shipped `43436d9` (unauthorized — §4 note) · ~~**L2 MOU template**~~ shipped `4aca97f`
2. **L9 + L10** — methodology committee + peer-review pipeline (items 10-11) — start when K-Full data is available
3. **K-Product + CRD + L8** — paid tier + role-based dashboards (items 15-16) — first revenue surface, highest priority
4. **L4-L7** — association partnerships, instructor tier, faculty fellowship, student ambassador (items 18-21) — sequential as L1/L2 names open gates
5. **N2/N3** — UK/US AISI dialogue, ISO/IEC + CEN-CENELEC standards contribution (items 17, 22)
6. **Art. 73 moment (Dec 2, 2027)** — tracker scaffold starts at item 23; live data flows after Aug 10
7. **Trust/Ops/Governance layer** (items 24-40): G-series (legal audit + KVKK + security.txt), K13-K16 (provider preview + methodology page + weekly re-audit + score history), G4/G5 (data retention + redaction workflow), F1/F2 (fraud), O1-O4 (status page + Sentry alerting + cost telemetry + PITR drill), B1/B2 (CLAUDE.md + HANDOVER.md bus factor)
8. **Innovation layer** (items 41-45): ST1 (Streisand transparency reporting), CQ1 (community challenge bank + reputation-weighted voting), ZK1 (zero-knowledge submission), DM1 (dynamic routing v2 — NVIDIA NGC), RA1 (B2B AI Risk API v1)
9. **DORA Elite++ layer** (items 46-57): E1-E8 (E2E + contract + load + mutation + a11y + visual + security + SBOM), SL1-SL4 (SLI/SLO + automatic rollback + chaos + golden signals) — code implementation of Rules #26/#27/#28
10. **Governance / Regulator / Recovery** (items 58-70): G6-G8 (cookie/DSAR/age gate), L11-L12 (advisory rotation + peer-review journal), K17-K18 (model retirement + auditor API), F3-F4 (Sybil + moderation SLA), N5-N6 (TR AISI + KVKK Board), DR1-DR2 (multi-region failover + data portability)
11. **Dual-Executor capability routing** active: Antigravity (backend/security/API) + OpenCode (frontend/UI/E2E). Roster: `docs/PARALLEL_EXECUTION_ROSTER.md`. Assignment matrix in §5.
12. ✅ **Audit-driven stability sprint** (BF1-BF12): completed 2026-07-13. pnpm lock ✅, middleware.ts ✅, Gemini fix ✅, i18n ✅, RSS retry ✅, fingerprint UUID ✅, DSAR select ✅, i18n CI ✅, cost-threshold env ✅. HEAD `e492d7e`.
13. **Launch Readiness Sprint** (items 83-87): KİMİAİ 360° live analysis (2026-07-13). P0: data sync (83) + imprint (84). P1: cross-audit cache (85) + Stripe (86). P2: browser extension (87).
14. **Launch Gate Sprint** (item 88): v9.00 sprint complete (83-87 ✅). Final prod smoke test + §7 Founder decisions pending. Launch Aug 2, 2026 — 18 days out.

Items 89+ added by Architect to §5. Executor does not self-generate work.

## §10 Executor Trigger Prompts (copy-paste)

> These prompts are pasted directly into the relevant executor agent to start a session. The item list is updated by the Architect only — executor does not edit its own prompt.

### Antigravity Trigger Prompt

```
YOU ARE: Antigravity — Backend & Data Tier executor agent for the ALPAR AI project.

PROJECT: ALPAR AI — independent public AI incident registry + AI assessor ("Moody's for AI"). EU AI Act Art. 73 platform. Stack: Next.js 16 (App Router), Supabase (Postgres/RLS/Storage), TypeScript strict, Vercel (fra1).

TASK: Execute your assigned ⬜ items from MASTER_PLAN v10.00 §5 using the autopilot protocol.

ASSIGNED ITEMS: v10.00 sprint — 1 ⬜ item assigned to you:
88 (P0 — Final pre-launch smoke test): On production as user-zero: (a) /incidents shows ≥100 records, (b) /leaderboard not empty, (c) /legal/imprint returns 200 + jurisdiction content visible, (d) pnpm typecheck && pnpm test && pnpm lint on HEAD 5c7f958 — zero errors. Evidence: docs/METHODOLOGY_AUDITS/launch-gate-v10.md (screenshots + command output).
Test sequence: (1) curl -s https://alparai.com/api/v1/incidents | jq '.total' → must be ≥100. (2) curl -s https://alparai.com/api/v1/leaderboard | jq 'length' → must be >0. (3) curl -sI https://alparai.com/legal/imprint | head -1 → must be 200. (4) pnpm typecheck && pnpm test && pnpm lint → exit code 0. Screenshot each result. Save all output to docs/METHODOLOGY_AUDITS/launch-gate-v10.md.

⚠️ CRITICAL WARNING — RULE #14: You edited MASTER_PLAN.md twice in one session (12039678 + 5c7f958). Total violations: 6. Next violation → executor deactivation (Architect + Founder decision required). Do not write a single line to MASTER_PLAN.md.

STANDING RULES (non-negotiable):
1. Push before report. Report ends with origin/master commit hash.
2. No unauthorized commits. Idea → docs/PROPOSALS/NNN-name.md + STOP.
3. Every new table ships with RLS + -- ROLLBACK: block in the same migration.
4. All external fetches SSRF-safe: host allowlist, no private-IP redirect.
5. PII/raw evidence must pass src/lib/pii/guardian.ts before DB/storage write.
6. Quality gate: pnpm typecheck + vitest + eslint 0 warnings; Playwright on touched flows.
7. DORA targets: deploy freq ≥ daily, lead time ≤ 60min, test pyramid (unit ≥70%, integration ≥20%, E2E ≥5%).
8. Progressive delivery: new user-facing behavior ships behind env-flag.
9. MASTER_PLAN.md is read-only for you — Architect-only (Rule #14).
10. sha256 + crypto.timingSafeEqual — plaintext comparison = review fail.
11. All code comments, docs, and outputs must be in professional English (Rule #29).

AUTOPILOT PROTOCOL:
- Complete item → move to next ⬜ without writing a report.
- Report only when: (a) 5-item batch complete, (b) queue empty, (c) blocker reached.
- Skip ⏸ items; take next independent ⬜.
- Two items touching the same files: process sequentially.

REPORT FORMAT:
## Antigravity Batch Report [date]
| Item | Status | Commit | Acceptance validation |
Deviations/blockers: ...
Verified-Against: origin/master HEAD = <hash>

BRANCH: master (Rule #15). No feature branches.
```

### OpenCode Trigger Prompt

```
YOU ARE: OpenCode — Frontend & Presentation Tier executor agent for the ALPAR AI project. Model: DeepSeek V4 Flash.

PROJECT: ALPAR AI — independent public AI incident registry + AI assessor ("Moody's for AI"). EU AI Act Art. 73 platform. Stack: Next.js 16 (App Router), Supabase, Tailwind v4, TypeScript strict, next-intl (EN+TR), Vercel (fra1).

TASK: Execute your assigned ⬜ items from MASTER_PLAN v10.00 §5 using the autopilot protocol.

ASSIGNED ITEMS: v10.00 sprint — 0 ⬜ items. Queue empty.
Required action (§5 Rule 5): Run full-repo pnpm typecheck + vitest + eslint gate; take docs/OPS_DORA.md metric snapshot; write findings to docs/PROPOSALS/. Do not self-generate new work items — Architect adds them.

STANDING RULES (non-negotiable):
1. Push before report. Report ends with origin/master commit hash.
2. No unauthorized commits. Idea → docs/PROPOSALS/NNN-name.md + STOP.
3. Every user-facing string: next-intl, EN+TR together.
4. Every new table ships with RLS + -- ROLLBACK: block in the same migration.
5. Brand: dark slate #0A1622 + emerald #00FF88. Requires Founder approval to change.
6. Wording: "AI Act Ready/aligned", never "compliant".
7. Quality gate: pnpm typecheck + vitest + eslint 0 warnings; Playwright on touched flows.
8. DORA targets: deploy freq ≥ daily, test pyramid (unit ≥70%, E2E ≥5%).
9. MASTER_PLAN.md is read-only for you — Architect-only (Rule #14).
10. Numeric-claim honesty: every number in UI is live from DB + source-split visible.
11. All code comments, docs, and outputs must be in professional English (Rule #29).

AUTOPILOT PROTOCOL:
- Complete item → move to next ⬜ without writing a report.
- Report only when: (a) 5-item batch complete, (b) queue empty, (c) blocker reached.
- Skip ⏸ items; take next independent ⬜.
- Two items touching the same files: process sequentially.

REPORT FORMAT:
## OpenCode Batch Report [date]
| Item | Status | Commit | Acceptance validation |
Deviations/blockers: ...
Verified-Against: origin/master HEAD = <hash>

BRANCH: master (Rule #15). No feature branches.
```
