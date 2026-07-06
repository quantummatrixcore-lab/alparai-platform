# ALPAR AI — Antigravity Full Execution Plan (H2 2026, single document)

> **For the Executor (Antigravity).** This is the complete, self-contained work order from now to end of 2026. It consolidates and SUPERSEDES the remaining tasks of MASTER_PLAN_2026H2.md and UPDATE_PLAN_2026Q3.md. Execute stages **in order (A→H)**. Do not skip ahead, do not add unplanned work.
> **PACING RULE — dates are DEADLINES, not waiting periods.** Finish a stage → push → report → get Architect approval → start the next stage IMMEDIATELY, regardless of the calendar. If you are ahead of schedule, keep going. The ONLY calendar locks are: (a) the feature freeze during launch week (Aug 1–9) — Stage D activities replace feature work in that window whenever it arrives; (b) queue items with their own scheduled dates (countdown posts, Monday digests) fire on their dates automatically and never block you.
> **State at issue (2026-07-05):** Phases 0–3 complete and approved at `f433263`. 406 published incidents. Countdown posts queued (first unlocks Jul 12). Launch: Aug 2, "Accountability Gap" narrative.

---

## STANDING RULES (violations fail review automatically)

1. **Push before report.** Every report ends with an `origin/master` commit hash. Unpushed work does not exist.
2. **No out-of-scope commits.** Ideas beyond this plan → write a proposal note, await Architect approval. Master is not a sandbox.
3. **No hardcoded credential fallbacks** (`|| "..."`) in any auth path. Secrets exist only in env/DB (hashed where inbound).
4. **Brand is dark slate `#0A1622` + emerald `#00FF88`.** Never change brand assets without founder approval.
5. **Wording:** "AI Act **Ready/aligned**", never "compliant"; high-risk labels always carry the informational-only disclaimer. Regulatory dates: high-risk/Art. 73 obligations = **2 Dec 2027** (Digital Omnibus).
6. **Nothing posts/emails externally without an approved queue item.** Auto-post env flags skip the click, never the queue.
7. **Every user-facing string:** next-intl, EN+TR both.
8. **Every new table ships RLS in the same migration.** Public pages use the anon server client, never `createAdminClient()`.
9. **All external fetching:** SSRF-safe (host allowlist, no private-IP redirects, size/time limits).
10. **Quality gate per stage:** `pnpm typecheck` + full vitest + eslint 0 warnings; Playwright for touched flows; report which Accept criteria you verified and how.

---

## STAGE A — Pre-Launch Safety (hard deadline: Jul 20 — earlier is better)

**A1. Autopilot control room.** Admin section: last 50 `autopilot_runs` (worker, outcome, duration, cost fields where present), per-worker enable/disable stored in DB, global `AUTOPILOT_KILL_SWITCH` env honored by `src/lib/autopilot/worker.ts` before any run. *Accept:* flipping the switch stops all autonomous actions within one cycle; panel bilingual; admin-only RLS.

**A2. Full e2e + a11y pass.** Run the complete Playwright suite; add specs if missing for: anonymous submit (with URL evidence), incident detail incl. Art. 73 badge + disclaimer, `/ai-act` tracker filters, `/transparency` counters, provider respond-with-token flow, admin approval queue. Add axe checks on home, submit, `/ai-act`. *Accept:* suite green in CI; no serious/critical axe violations; failures fixed, not skipped.

**A3. Production readiness checklist.** Verify in prod env (report evidence, don't paste secrets): IP_SALT, RESEND key, Upstash, Sentry DSN, OPENROUTER key, VERTEX key, ENTERPRISE_API_KEY unset-or-strong; `transparency_stats` and `provider_response_tokens` exist in prod DB; Vercel Git-integration deploy confirmed (no CLI deploys); Sentry receives a test error. *Accept:* checklist table in walkthrough with pass/fail per item.

**A4. Load sanity.** Add DB indexes if missing for: incidents(status, published_at), incidents provider FK, social_posts(status, scheduled_at). Confirm `/ai-act` and leaderboard queries paginate (no unbounded selects). *Accept:* EXPLAIN or PostgREST limit evidence in walkthrough.

## STAGE B — Wiring (hard deadline: Aug 1)

**B1. News → social queue.** Accepted `external_queue` items + `ecosystem_news` rows generate "reply/quote draft" entries into `social_posts` (status draft, kind=news_reply) via the existing content engine; drafts cite the ALPAR data point they should quote. *Accept:* new accepted news item yields a queued draft within one cron cycle.

**B2. Watches → notifications.** On new published incident or official provider response for a watched provider: Resend email to watchers. Strict opt-in, one-click unsubscribe, per-user daily cap (max 3), template in `src/emails/templates.ts`. *Accept:* e2e demo with a test account; unsubscribe verified.

**B3. Autopilot/pre-triage dedup.** Confirm `autoModerateIncidentAction` consumes the `preTriageCheck` verdict rather than duplicating cheap checks; wire the pre-triage cost log into a weekly cost summary row (table or log query documented). *Accept:* single triage path proven by test.

## STAGE C — API Productization (hard deadline: Aug 15; start as soon as B is approved)

**C1. `client_api_keys` table (T14.5).** sha256-hashed key, tier, customer_label, created_at, revoked_at, last_used_at; lookup by hash index; migrate `client_*` rows out of `api_keys` (which returns to LLM-provider secrets only); admin UI: create/revoke/label keys, show key once at creation. *Accept:* revoked key 401s; two enterprise customers can hold distinct keys; unit tests.

**C2. API docs + dataset.** Update `docs/API.md`: v1 filters (category, severity, eu_risk, provider, model), tiers/limits, `verification_level`, curl examples. Regenerate sample dataset via script into gitignored `exports/`. *Accept:* every documented example actually runs against prod.

**C3. Usage metering.** Log per-key request counts (Upstash counter or table) surfaced in admin next to each key. *Accept:* counts visible and correct after test calls.

## STAGE D — Launch Week (CALENDAR-LOCKED: Aug 1–9): FREEZE + SUPPORT — runs in parallel, pauses other stages during that window only

Feature freeze. Only: monitor Sentry, fix P0/P1 bugs, keep queues flowing. Prepare `docs/RUNBOOK_LAUNCH.md` before Aug 1: what to check hourly on launch day (error rate, submit funnel counts, cross-audit failures, respond-token errors), rollback procedure (revert commit → auto-deploy), contacts/escalation. *Accept:* runbook exists; founder can execute it without you.

## STAGE E — Growth Loops (hard deadline: Sep 15; start when C is approved and freeze is over)

**E1. Weekly digest cron (finalize T16.4).** Monday digest from `transparency_stats` + top-3 incidents (Gemini summary EN+TR) → Resend to double-opt-in subscribers + social thread draft into queue. *Accept:* one full dry-run to a test list.

**E2. Milestone press-release generator (T16.5).** Triggers: 500th published incident, first claimed profile, first official response. Draft EN+TR + Imagen hero → approval queue with prefilled (founder-curated) media list send. Fires exactly once per milestone. *Accept:* unit test on trigger idempotency.

**E3. Reporter reputation surfacing.** Public profile: existing gamification reputation/badges + "N verified incidents" + shareable OG card. No public reporter leaderboard (gaming risk). *Accept:* bilingual, counts from published incidents only.

**E4. SEO pass.** Incident pages: structured data (Article/Report schema.org), related-incidents block (same provider/category), breadcrumbs; verify sitemap covers incidents + `/ai-act` + transparency. *Accept:* rich-results test passes on 3 sample pages.

## STAGE F — Academy & Expert Portal (hard deadline: Nov 15; start when E is approved)

**F1. Expert review queue.** Approved experts get a dashboard listing incidents awaiting expert verification in their discipline; actions: verify / annotate (`expert_fix` fields) / decline. Expert action upgrades incident to `expert_verified` and re-renders badges + API `verification_level`. *Accept:* full flow with a test expert account; RLS: experts see only assigned scope.

**F2. Academy beta portal (strategy_todos: academy_beta).** Read-only research library for approved academics: filtered incident explorer + CSV export (published, PII-masked only) under a research-license notice page. *Accept:* export contains zero PII (test with seeded fake PII).

**F3. "State of AI Incidents Q4" generator.** Script assembling live stats + top cases + taxonomy breakdown into a Markdown/PDF draft for founder + expert co-authors. *Accept:* generated draft cites only real DB numbers; founder approves before any publication.

## STAGE G — Data Quality & Scale (continuous; start when F is approved or in idle time with approval)

**G1.** Taxonomy coverage: ≥80% of imported incidents carry Art. 73 class; report monthly coverage %. **G2.** Dedup sweep across the existing corpus (near-duplicate titles/URLs) → merge tool in admin. **G3.** i18n completeness check script (missing TR keys fail CI). **G4.** Monthly cost report: cross-audit spend, pre-triage skip rate, Imagen/Veo usage.

## STAGE H — Continuous Maintenance (weekly, standing)

Dependabot PRs: merge only after CI green (security patches same week). Sentry triage weekly; recurring errors become fix tasks. Keep CHANGELOG.md per release. Never touch: Backlog-frozen surfaces (dilemmas, bounties, invest*, feed, newsletter features), brand assets, legal copy, pricing amounts.

---

## REPORTING PROTOCOL

After each stage: push → report to Architect with (1) origin hash, (2) Accept-criteria table with pass/fail + how verified, (3) deviations/blockers, (4) proposal notes if any. Await approval before the next stage. Founder-only items you must NEVER do: send external emails/posts without an approved queue item, contact journalists/universities/investors, edit investment or legal copy, change pricing.

## DEFINITION OF DONE (whole plan)

All stages A–H accepted; launch executed Aug 2 with zero P0; ≥1 paying customer flow technically ready (C1–C3); expert portal live with ≥1 real expert action; monthly cost + coverage reports automated. Then request the 2027 plan from the Architect.
