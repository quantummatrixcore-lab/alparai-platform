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
11. **Haftalık DB snapshot.** Her Pazartesi `supabase db dump` (PII-masked) çıktısını güvenli depolamaya kaydet. FREE tier inaktivite kontrolü: Supabase dashboard'a en az ayda 1 login. Önceki `alparai-db` kaybı tekrarlanmamalı.
12. **Her migration dosyası rollback yorumu içerir.** Dosyanın sonunda `-- ROLLBACK:` yorum bloğu olarak geri alma SQL'i yer alır.

---

## STAGE A — Pre-Launch Safety (hard deadline: Jul 20 — earlier is better)

**A1. Autopilot control room.** Admin section: last 50 `autopilot_runs` (worker, outcome, duration, cost fields where present — add `cost_cents integer DEFAULT 0` and `token_count integer DEFAULT 0` columns to `autopilot_runs` via migration), per-worker enable/disable stored in a new `autopilot_worker_config` table (columns: worker_name text PK, enabled boolean, updated_at, updated_by), global `AUTOPILOT_KILL_SWITCH` env honored by `src/lib/autopilot/worker.ts` before any run. _Accept:_ flipping the switch stops all autonomous actions within one cycle; panel bilingual; admin-only RLS.

**A2. Full e2e + a11y pass.** Run the complete Playwright suite; add specs if missing for: anonymous submit (with URL evidence), incident detail incl. Art. 73 badge + disclaimer, `/ai-act` tracker filters, `/transparency` counters, provider respond-with-token flow, admin approval queue. Add axe checks on home, submit, `/ai-act`. _Accept:_ suite green in CI; no serious/critical axe violations; failures fixed, not skipped.

**A3. Production readiness checklist.** Verify in prod env (report evidence, don't paste secrets): IP_SALT, RESEND key, Upstash, Sentry DSN, OPENROUTER key, VERTEX key, ENTERPRISE_API_KEY unset-or-strong; `transparency_stats` and `provider_response_tokens` exist in prod DB; Vercel Git-integration deploy confirmed (no CLI deploys); Sentry receives a test error. _Accept:_ checklist table in walkthrough with pass/fail per item.

**A4. Load sanity.** Add DB indexes if missing for: incidents(status, published_at), incidents provider FK, social_posts(status, scheduled_at). Confirm `/ai-act` and leaderboard queries paginate (no unbounded selects). _Accept:_ EXPLAIN or PostgREST limit evidence in walkthrough.

**A5. GitHub Actions CI.** `.github/workflows/ci.yml`: pnpm install → typecheck → vitest → eslint. Runs on PR and master push. README badge added. _Accept:_ CI runs green on master; failed PR shows red check.

## STAGE B — Wiring (hard deadline: Aug 1)

**B1. News → social queue.** Accepted `ecosystem_news` rows (status='accepted') generate "reply/quote draft" entries into `social_posts` (status draft, kind=news_reply) via the existing content engine; drafts cite the ALPAR data point they should quote. _Accept:_ new accepted news item yields a queued draft within one cron cycle.

**B2. Watches → notifications.** On new published incident or official provider response for a watched provider: Resend email to watchers. Strict opt-in, one-click unsubscribe, per-user daily cap (max 3), template in `src/emails/templates.ts`. _Accept:_ e2e demo with a test account; unsubscribe verified.

**B3. Autopilot/pre-triage dedup.** Confirm `autoModerateIncidentAction` consumes the `preTriageCheck` verdict rather than duplicating cheap checks; wire the pre-triage cost log into a weekly cost summary row (table or log query documented). _Accept:_ single triage path proven by test.

**B4. Veri silme hakkı akışı (KVKK md.7 / GDPR Art.17).** Authenticated kullanıcı profil sayfasından "Hesabımı Sil" → 72 saat bekleme (iptal edilebilir) → soft-delete → 30 gün sonra hard-delete cron (incidents anonimleştirilir, PII hash'leri silinir). _Accept:_ e2e test ile tam akış; silinen kullanıcının incident'leri "Anonim Kullanıcı" olarak görünür; unsubscribe tüm watch/email'lerden otomatik.

## STAGE C — API Productization (hard deadline: Aug 15; start as soon as B is approved)

**C1. `client_api_keys` table (T14.5).** sha256-hashed key, tier, customer_label, created_at, revoked_at, last_used_at; lookup by hash index; `api_keys` table remains unchanged (LLM-provider secrets only); admin UI: create/revoke/label keys, show key once at creation. _Accept:_ revoked key 401s; two enterprise customers can hold distinct keys; unit tests.

**C2. API docs + dataset.** Update `docs/API.md`: v1 filters (category, severity, eu_risk, provider, model), tiers/limits, `verification_level`, curl examples. Regenerate sample dataset via script into gitignored `exports/`. _Accept:_ every documented example actually runs against prod. Update `docs/API.md` to remove the "No REST endpoints" statement and document the new enterprise v1 API routes, tiers, and auth flow.

**C3. Usage metering.** Log per-key request counts (Upstash counter or table) surfaced in admin next to each key. _Accept:_ counts visible and correct after test calls.

**C4. Tier-based API rate limiting.** `client_api_keys.tier` → {free: 100/day, pro: 1000/day, enterprise: 10000/day}. Upstash Redis sliding window. 429 response with `Retry-After` header. _Accept:_ free tier 101. istek → 429; tier upgrade → limit yükselir; unit tests.

## STAGE D — Launch Week (CALENDAR-LOCKED: Aug 1–9): FREEZE + SUPPORT — runs in parallel, pauses other stages during that window only

Feature freeze. Only: monitor Sentry, fix P0/P1 bugs, keep queues flowing. Prepare `docs/RUNBOOK_LAUNCH.md` before Aug 1. Runbook must include:

- Error Rate: Sentry >5 unresolved/hour → P0
- Submit Funnel: submit_start → submit_complete conversion <50% → alarm
- Cross-Audit Failures: >20% failure rate in last hour → kill switch
- DB Connections: active >15 on FREE tier → investigate
- Rollback: `git revert HEAD && git push` (Vercel auto-deploys)
  Contacts/escalation. _Accept:_ runbook exists; founder can execute it without you.

## STAGE E — Growth Loops (hard deadline: Sep 15; start when C is approved and freeze is over)

**E1. Weekly digest cron (finalize T16.4).** Monday digest from `transparency_stats` + top-3 incidents (Gemini summary EN+TR) → Resend to double-opt-in subscribers + social thread draft into queue. _Accept:_ one full dry-run to a test list.

**E2. Milestone press-release generator (T16.5).** Triggers: 500th published incident, first claimed profile, first official response. Draft EN+TR + Imagen hero → approval queue with prefilled (founder-curated) media list send. Fires exactly once per milestone. _Accept:_ unit test on trigger idempotency.

**E3. Reporter reputation surfacing.** Public profile: existing gamification reputation/badges + "N verified incidents" + shareable OG card. No public reporter leaderboard (gaming risk). _Accept:_ bilingual, counts from published incidents only.

**E4. SEO pass.** Incident pages: structured data (Article/Report schema.org), related-incidents block (same provider/category), breadcrumbs; verify sitemap covers incidents + `/ai-act` + transparency. _Accept:_ rich-results test passes on 3 sample pages.

**E5. Health check endpoint.** `/api/health` → DB bağlantısı + Upstash ping + son autopilot run durumu. Response: `{ status: "ok"|"degraded", db, cache, lastAutopilotRun }`. UptimeRobot'a eklenir. _Accept:_ endpoint 200 döner; DB kapalıyken "degraded" döner.

## STAGE F — Academy & Expert Portal (hard deadline: Nov 15; start when E is approved)

**F1. Expert review queue.** Approved experts get a dashboard listing incidents awaiting expert verification in their discipline; actions: verify / annotate (`expert_fix` fields) / decline. Expert action upgrades incident to `expert_verified` and re-renders badges + API `verification_level`. _Accept:_ full flow with a test expert account; RLS: experts see only assigned scope.

**F2. Academy beta portal (strategy_todos: academy_beta).** Read-only research library for approved academics: filtered incident explorer + CSV export (published, PII-masked only) under a research-license notice page. _Accept:_ export contains zero PII (test with seeded fake PII).

**F3. "State of AI Incidents Q4" generator.** Script assembling live stats + top cases + taxonomy breakdown into a Markdown/PDF draft for founder + expert co-authors. _Accept:_ generated draft cites only real DB numbers; founder approves before any publication.

## STAGE G — Data Quality & Scale (continuous; start when F is approved or in idle time with approval)

**G1.** Taxonomy coverage: ≥80% of imported incidents carry Art. 73 class; report monthly coverage %. **G2.** Dedup sweep across the existing corpus (near-duplicate titles/URLs) → merge tool in admin. **G3.** i18n completeness check script (missing TR keys fail CI). **G4.** Monthly cost report: cross-audit spend, pre-triage skip rate, Imagen/Veo usage.

## STAGE H — Continuous Maintenance (weekly, standing)

Dependabot PRs: merge only after CI green (security patches same week). Sentry triage weekly; recurring errors become fix tasks. Keep CHANGELOG.md per release. Never touch: Backlog-frozen surfaces (dilemmas, bounties, invest\*, feed, newsletter features), brand assets, legal copy, pricing amounts.

---

## REPORTING PROTOCOL

After each stage: push → report to Architect with (1) origin hash, (2) Accept-criteria table with pass/fail + how verified, (3) deviations/blockers, (4) proposal notes if any. Await approval before the next stage. Founder-only items you must NEVER do: send external emails/posts without an approved queue item, contact journalists/universities/investors, edit investment or legal copy, change pricing.

## DEFINITION OF DONE (whole plan)

All stages A–H accepted; launch executed Aug 2 with zero P0; ≥1 paying customer flow technically ready (C1–C3); expert portal live with ≥1 real expert action; monthly cost + coverage reports automated. Then request the 2027 plan from the Architect.
