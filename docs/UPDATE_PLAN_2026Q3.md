# ALPAR AI — Q3 2026 Update Plan (Execution Brief) — v1.2

> **Audience:** AI coding agents (Antigravity / Claude Code) and human reviewers.
> **How to use:** Execute phases in order: Pre-flight → Sprint 13 → Sprint 14. Each task has file targets, acceptance criteria, and a verification command. Respect the Guardrails section at all times.
> **Prepared:** 2026-07-03 · **Revised:** v1.2, 2026-07-04 (two external reviews triaged; see Review Log at bottom) · **Hard deadline anchor:** EU AI Act Article 73 enters into application **2026-08-02**.

---

## 0. Context (read first)

ALPAR AI is a community-governed AI incident registry ("Trustpilot for AI"): users report AI failures, providers respond, the public sees Trust Scores. Stack: Next.js 16 (App Router, RSC, Server Actions) + Supabase (Postgres/RLS/Storage) + Tailwind v4 + TypeScript strict, hosted on Vercel (fra1) / Supabase (eu-west-1).

**Strategic rationale for this plan** (from live market analysis, July 2026):

1. **Regulatory window:** EU AI Act Art. 73 serious-incident reporting becomes applicable 2026-08-02. The European Commission has published draft guidance and a reporting template. No public registry is aligned with it yet. ALPAR already has the `eu_ai_act_columns` migration + AIID/AIAAIC import crons → we can be the first regulator-aligned public incident registry, launched on the news cycle of Aug 2.
2. **Data gap:** AIID (~900 incidents), OECD AIM (~5–7k media reports), AIAAIC — none accept direct user-submitted, evidence-backed, anonymous reports; none have a provider-response mechanism; none map to regulatory taxonomy. These are exactly ALPAR's three differentiators.
3. **Buyer signal:** Standalone AI liability insurance is now real (Armilla, Testudo — Lloyd's ecosystem, limits $9–25M, GenAI litigation +137% YoY). Their scarcest input is incident data. This validates the Enterprise Data API revenue path.

**North-star metric:** `verified new incidents per week`. Every task below must either increase it, monetize it, or protect its credibility.

---

## Pre-flight — security debt (do BEFORE Sprint 13 tasks; ~1 day total)

### PF.1 — Remove predictable IP_SALT fallback (security, highest priority)
- **Files:** `src/lib/utils/hash.ts`, `.env.example`, `docs/DEPLOYMENT.md`.
- **Why:** `requireIpSalt()` currently falls back to `SUPABASE_ANON_KEY.slice(0, 32)` or a hardcoded literal. The anon key is public, so IP hashes AND `generateProviderToken` (provider verification!) become predictable/forgeable. The `_validated` flag logic is also inverted (first call never warns).
- **Work:** If `IP_SALT` is missing or shorter than 16 chars, throw at first use in production (`NODE_ENV === "production"`); allow a dev-only fallback with a loud warning. Remove the `_validated` flag. Confirm `IP_SALT` is set in Vercel prod env before merging.
- **Accept:** no code path in production can hash or sign with a predictable salt; existing hashed values unaffected (same salt continues in prod).
- **Verify:** unit test: missing env in production mode → throws; `pnpm typecheck && pnpm test`.

### PF.2 — Logger noise reduction (small polish)
- **Files:** `src/lib/utils/logger.ts`.
- **Work:** Stop sending `warn`-level messages to Sentry (console only) to protect Sentry quota; keep `error` → Sentry. Move the mid-file `import * as Sentry` to the top (cosmetic). NOTE: debug-in-production is ALREADY disabled (`shouldLog`) — do not re-implement.
- **Accept:** `warn` never calls Sentry; `error` behavior unchanged.
- **Verify:** unit test on the logger; `pnpm typecheck`.

### PF.3 — Env hygiene guard (repo is currently clean — this is prevention only)
- **Files:** CI workflow under `.github/workflows/`.
- **Work:** Verified 2026-07-04: `git ls-files` tracks only `.env.example` — no real env files are committed. Add a cheap CI step that fails if any `.env*` file other than `.env.example` is tracked.
- **Accept:** CI fails on a test commit containing `.env.local`.

### PF.4 — Define the north-star metric precisely (blocks T13.5 counters)
- **Files:** this plan + `/transparency` page copy.
- **Work:** Pin down before building counters: "verified" = moderator-approved AND published incident. Measure the current baseline with a DB query and record it in the Review Log. Founder sets the weekly target (suggested start: 10/week post-launch; revisit monthly).
- **Accept:** definition appears in transparency-page copy; baseline recorded; target agreed by founder.

### ⚠️ Explicit non-task — do NOT create `src/middleware.ts`
An external review suggested adding a root `middleware.ts`. This is a false positive: the project runs **Next.js 16**, where `src/proxy.ts` is the successor to `middleware.ts`. `src/proxy.ts` already wires i18n routing, Supabase session refresh, request-id injection, and a server-action bypass. Creating `src/middleware.ts` would regress or double-run this logic. Leave `src/proxy.ts` as-is.

---

## Sprint 13 — "AI Act Ready" (ship by **2026-08-01**)

**Goal:** On Aug 2, ALPAR is the only public, regulator-aligned AI serious-incident tracker, and the press kit says so.

### T13.1 — Article 73 taxonomy mapping (foundation, do first)
- **Files:** new `docs/EU_AI_ACT_TAXONOMY.md`; extend `supabase/migrations/` (new migration building on `20260629000000_eu_ai_act_columns.sql`); shared enum/types in `src/lib/` (follow existing type patterns).
- **Work:** Map ALPAR incident schema to the EC draft Art. 73 reporting template: serious-incident class (death/health, critical-infrastructure disruption, fundamental-rights infringement, property/environment), high-risk system category (Annex III), reporting-deadline class (2/10/15 days). Publish the mapping as a public spec in `docs/EU_AI_ACT_TAXONOMY.md`.
- **Accept:** every incident row can carry an Art. 73 classification; classification is nullable (legacy rows); spec doc explains every field and cites the EC draft template.
- **Verify:** `pnpm typecheck && pnpm test` + new migration applies cleanly via `pnpm db:reset` on a local/staging DB (never prod).

### T13.2 — Classify imported + seeded incidents
- **Files:** `src/app/api/cron/import-incidents/route.ts`, `src/app/api/cron/fetch-external/route.ts`, `scripts/import-aiid.ts`, `scripts/import-aiaaic.ts`, `scripts/import-utils.ts`.
- **Work:** Extend the import pipeline so every ingested incident gets a best-effort Art. 73 classification. Ensure imported records carry clear source attribution (name + URL + license note).
- **T13.2a — Mapping table (define rules BEFORE coding):** in `docs/EU_AI_ACT_TAXONOMY.md`, add an explicit source-category → Art. 73 class table with a confidence column (high/medium/low). Every AIID/AIAAIC source category must appear in the table. Low-confidence or unmapped categories → `unclassified`. Never guess a legal class in code that isn't in the table.
- **T13.2b — Mapping unit tests:** `tests/eu-ai-act-mapping.test.ts` covering every row of the table + the `unclassified` fallback. Target 100% branch coverage of the mapping function.
- **Accept:** ≥80% of imported incidents carry a classification; 100% carry visible source attribution; import is idempotent (re-running does not duplicate); mapping table and code never diverge (single source of truth constant).
- **Verify:** run importer against a fixture file in `tests/`; `pnpm test`.

### T13.3 — Art. 73 badge + tracker page (public launch asset)
- **Files:** incident detail page under `src/app/[locale]/incidents/[id]/`; new route `src/app/[locale]/ai-act/` ("AI Act Serious Incident Tracker"); components under `src/components/incidents/`; i18n messages in `messages/` (EN + TR — both required).
- **Work:** (a) Art. 73 class badge on incident pages with a tooltip linking to the taxonomy spec. (b) A tracker page: filterable list of incidents by Art. 73 class + live counters + explainer of the Aug 2 obligations + CTA to submit. Design per existing directives: dark slate `#0A1622`, emerald `#00FF88`, glassmorphism, consistent with current components.
- **Accept:** page is bilingual, indexed (in `sitemap.ts`), full meta tags, has its own OG image per locale, loads < 2s (ISR or streaming), server-side pagination for the incident list (no unbounded queries), works logged-out.
- **Verify:** `pnpm test:e2e` with a new Playwright spec covering the tracker page in both locales.

### T13.4a — URL-first submit form (cold-start attack, phase 1)
- **Files:** `src/app/[locale]/submit/page.tsx` + `src/actions/incidents.ts`.
- **Work:** Add a share-conversation URL field as the primary input of the submit flow (ChatGPT/Grok/Gemini share links). Phase 1 stores the URL as evidence and the user fills the details manually — no server-side fetching yet. Keep the existing manual form as fallback. Anonymous flow must stay < 60s end-to-end.
- **Accept:** URL field validates known share-link domains, stored with the incident; existing form unbroken; rate-limited via existing Upstash setup.
- **Verify:** Playwright spec for submit with and without URL.
- **Note:** automatic fetch + snapshot + hash is deliberately deferred to T14.5 — external fetching, storage, and PII pipeline in one sprint alongside the Aug-2 launch is too much risk.

### T13.5 — Press kit + transparency counters
- **Files:** `src/app/[locale]/press-kit/`, `src/app/[locale]/transparency/page.tsx`, new migration for a stats view.
- **Work:** Add an "AI Act Ready" press-kit entry (what Art. 73 is, what ALPAR provides, quotable stats). On `/transparency`, publish live north-star counters: total incidents, verified-this-week, provider response rate. Back the counters with a Postgres view (e.g. `transparency_stats` aggregating published incidents, last-7-days count, response rate — follow the pattern of `20260701204000_create_leaderboard_view.sql` and **adapt column names to the actual schema**). Serve with ISR `revalidate = 3600`. Fix messaging inconsistency: leaderboard/README still say "incident count, lower is better" — align everything to the Trust Score definition (response rate + resolution rate + response time).
- **Accept:** counters read from the view (no hardcoded numbers, no N+1 queries); ISR ≤ 1h; README.md leaderboard description updated.
- **Verify:** `pnpm build` clean; visual check of both pages in EN/TR.

### T13.6 — Critical-path test hardening (parallel, non-blocking for launch)
- **Files:** `tests/`, `src/lib/pii/guardian.ts` tests, RLS policy tests under `supabase/`.
- **Work:** Ensure PII Guardian has exhaustive unit coverage (emails, phones, IBAN, passport, credit card, access tokens — TR + EN formats); add Playwright coverage for submit → moderation → publish; add smoke-level RLS assertions (anon cannot read unpublished incidents, etc.); add a basic accessibility smoke check (axe or Playwright a11y assertions) on home, submit, and the new `/ai-act` page.
- **Accept:** `pnpm test:coverage` shows PII guardian ≥95% line coverage; e2e suite green in CI; no serious/critical axe violations on the three checked pages.
- **Verify:** CI run on the PR.

---

## Sprint 14 — "Verified Respondent GTM" (2026-08-03 → 2026-08-31)

**Goal:** Convert Aug-2 attention into the first provider claims and the first revenue conversation.

### T14.1 — Pre-built provider profiles at scale
- **Files:** `src/app/[locale]/brand/[slug]/`, seed migration in `supabase/migrations/`, `src/components/leaderboard/`.
- **Work:** Ensure 10–15 mid-tier providers (Mistral/Cohere segment + enterprise AI SaaS — **not** only the big labs) have populated profiles from imported incidents, with the Response Rate widget visibly showing 0% / N open incidents and a prominent "Is this your company? Claim this profile — free" CTA.
- **Accept:** each profile has ≥3 incidents, working claim CTA, correct logo/name; claim flow reaches the verified-respondent onboarding (built on `20260703000001_verified_respondent.sql`).

### T14.2 — Claim → respond → alert loop
- **Files:** verified-respondent flows in `src/actions/` + `src/app/[locale]/` (respondent dashboard), email via existing Resend integration.
- **Work:** Complete the loop: claim (manual admin verification is fine — concierge mode), post official response (pinned on incident page), email alert on new incident for claimed providers. No self-serve billing yet; paid tier is a manual conversation.
- **Accept:** end-to-end demo: admin verifies a claim → provider posts response → response is pinned and Trust Score inputs update → new incident triggers alert email.
- **Verify:** Playwright spec for the respond flow; manual email test.

### T14.3 — Enterprise Data API v1.1 (insurance/research pilot)
- **Files:** `src/app/api/v1/` routes, existing API-key panel (`src/components/admin/api-keys-client.tsx`), `docs/API.md`.
- **Work:** Add Art. 73 taxonomy filters to `/api/v1/incidents`; add key-based rate tiers (free / pilot); version and document the schema in `docs/API.md` so a dataset sample can be exported for MGA outreach (Armilla/Testudo-type buyers).
- **Accept:** filtered queries work with an API key; docs include a copy-pasteable example; a `scripts/` export produces a clean CSV/JSON sample dataset.

### T14.4 — Neutrality charter (trust protection — required before any paid tier)
- **Files:** new `docs/NEUTRALITY.md` + public page under `src/app/[locale]/legal/` or `/moderation`.
- **Work:** Publish a written, binding editorial-independence policy: payment never influences incident content, ranking, moderation, or visibility; paid tiers buy tooling (alerts, analytics, pinned responses) only. Link it from pricing and from every Verified Respondent surface.
- **Accept:** page live in EN/TR, linked from pricing + respondent onboarding.

### T14.5 — Evidence auto-capture (paste-a-link phase 2; moved from Sprint 13)
- **Files:** new `src/lib/evidence/` module; extend `src/actions/incidents.ts`.
- **Work:** Server-side fetch of share-conversation URLs submitted via T13.4a: snapshot content to Supabase Storage, record SHA-256 hash + timestamp, pre-fill the report form. All fetched content passes through `src/lib/pii/guardian.ts` **before** any DB/storage write. Graceful fallback to manual entry when the link is invalid/unreachable. Backfill snapshots for URL-only incidents collected during Sprint 13.
- **Accept:** valid share link → snapshot + hash stored + form pre-filled; invalid link → manual fallback; PII Guardian invoked on snapshot text (unit-tested); rate-limited; SSRF-safe (allowlist of share-link hosts only, no redirects to private ranges).
- **Verify:** unit tests with fixtures; Playwright spec for the happy path; manual check that a snapshot containing a fake email/phone is masked.

---

## Launch Ops — founder tasks (non-code; agents must NOT execute these)

- **Content minimum before announcing:** ≥100 published incidents carrying an Art. 73 classification (scale the import pipeline if organic volume is short). Announcing "the AI Act incident registry" with a near-empty database would backfire.
- **Press:** press release (EN) + quotable stats from `/transparency`; media list (AI/tech/policy journalists); embargoed pitches in the week of Jul 27.
- **Claim wording:** apply Guardrail #10 to every launch sentence.
- **Competitor watch:** if a similar registry launches first, shift the angle from "first" to the real differentiators — user-submitted evidence + provider right-of-reply.

---

## Backlog (explicitly deferred — do NOT work on these in Pre-flight or Sprints 13–14)

- Academy, Dilemmas, Bounties, Invest/Investor-portal, Feed, Newsletter feature work → **frozen** (maintenance/security fixes only).
- AI Audit Certification (revenue Option C) → deferred until independent-authority status.
- Browser extension for evidence capture → after T14.5 ships and shows demand.
- Formal data partnerships (OECD AIM / AIAAIC) and EC consultation response → founder-led business tasks, tracked outside code; agents must not send outreach.

---

## Guardrails (binding for all agents)

1. **Never write PII or raw evidence to DB/storage without passing `src/lib/pii/guardian.ts`.**
2. **Never weaken RLS.** Any new table ships with RLS policies in the same migration.
3. **No destructive DB ops against production.** `pnpm db:reset` is local/staging only.
4. **Bilingual or nothing:** every user-facing string goes through `next-intl` messages (EN + TR).
5. **No legal claims in UI copy** beyond what `docs/EU_AI_ACT_TAXONOMY.md` states; Art. 73 classes are informational labels, not legal advice — keep the existing disclaimer pattern.
6. **Design system:** dark slate `#0A1622` / emerald `#00FF88`, glassmorphism, existing component conventions; no new UI libraries.
7. **Quality gate for every PR:** `pnpm validate` (lint + typecheck + test) green; e2e green for touched flows; no new dependencies without justification in the PR description.
8. **Scope discipline:** anything in the Backlog section is out of bounds. Do not create `src/middleware.ts` (see Pre-flight non-task).
9. **External fetching (T14.5) must be SSRF-safe:** hostname allowlist, no private-IP redirects, size and timeout limits.
10. **Wording rule — "Ready", never "Compliant":** UI, press kit, and docs may say "AI Act Ready" / "aligned with the Art. 73 taxonomy". NEVER claim "AI Act Compliant", "official reporting channel", or that reporting on ALPAR fulfills a provider's legal Art. 73 duty. Any sentence containing "AI Act" gets founder review before publish.

## Definition of Done (per sprint)

- All sprint tasks meet their Accept criteria, verified by the listed commands.
- CHANGELOG.md updated under a new version heading.
- `/transparency` counters reflect real data.
- Sprint 13 only: `/{locale}/ai-act` live in production before 2026-08-02, AND the ≥100-classified-incidents launch gate met before any public announcement.

---

## Review Log

**v1.1 (2026-07-04)** — Triaged external review (OpenCode / mimo-v2-pro). Adopted: IP_SALT fallback removal (confirmed in `src/lib/utils/hash.ts` — real vulnerability, now PF.1), logger warn-noise fix (PF.2, partially valid — debug-in-prod was already disabled), T13.4 split into URL-first (T13.4a) + auto-capture (T14.5), explicit Art. 73 mapping table + tests (T13.2a/b), pagination/meta criteria on T13.3, ISR + stats view on T13.5, a11y smoke on T13.6. Rejected as false positives: "missing root middleware.ts" (project is Next 16; `src/proxy.ts` is the middleware successor and already complete) and ".env files tracked in git" (verified clean; kept only as a CI guard, PF.3).

**v1.2 (2026-07-04)** — Triaged second external review (DeepSeek via OpenCode). Adopted: precise north-star metric definition + baseline requirement (PF.4); "Ready ≠ Compliant" wording rule (Guardrail #10); ≥100-incident launch gate; Launch Ops founder checklist (press, competitor watch). Already handled in v1.1: T13.4 split (reviewer re-flagged the v1.0 version). Rejected again: "missing src/middleware.ts / sessions will break" — false positive; `src/proxy.ts` (Next 16 middleware successor) is present and complete, and the reviewer's own follow-up retracted the claim. Do not create `src/middleware.ts`.

---

## Sprint 15 — Board DD Remediation (v1.3 addition; execute after Sprint 14, EXCEPT T15.1 which is urgent)

Source: Series A due-diligence board review (2026-07-04). Code-executable findings only.

### T15.1 — Remove the "auto-penalty for blocking" clause (URGENT — legal/credibility risk)
- **File:** `src/lib/ai/cross-audit-engine.ts` (DEBATE_SUPREME_COURT_PROMPT, "THE TRANSPARENCY ULTIMATUM" block).
- **Work:** Delete the automatic-downgrade/penalty instruction entirely. Provider blocking/throttling may be *recorded as a neutral fact* in reasoning, never auto-scored. Editorial responses to provider behavior are human decisions.
- **Accept:** no prompt text instructs models to penalize any provider for non-cooperation; existing tests pass.

### T15.2 — Cost pre-filter before cross-audit (COGS control)
- **Files:** new `src/lib/ai/pre-triage.ts`; call site where `runCrossAudit` is invoked.
- **Work:** Rule-based, zero-LLM gate before the 6-8-call debate pipeline: min description length, duplicate/near-duplicate detection, existing rate-limit signals, spam heuristics. Rejected items get status `needs_review`, never auto-published. Log per-incident pipeline cost estimate.
- **Accept:** unit-tested filter; measurable skip rate reported in logs; no incident bypasses PII masking.

### T15.3 — Submit funnel instrumentation
- **Files:** `src/app/[locale]/submit/`, Plausible event calls.
- **Work:** Emit events: `submit_start`, `submit_url_added`, `submit_complete`; preserve UTM params through the flow.
- **Accept:** events visible in Plausible; no PII in event payloads.

### T15.4 — Coordinated-submission guard
- **Files:** `src/actions/incidents.ts`, existing Upstash rate-limit utils, moderation queue.
- **Work:** Flag bursts of submissions targeting one provider from correlated sources (hashed-IP velocity). Flagged items require human moderation before publish.
- **Accept:** synthetic burst test triggers the flag; normal traffic unaffected.

### T15.5 — Human gate on high-severity legal labels
- **Files:** incident publish flow, admin moderation UI.
- **Work:** "High Risk" / "Unacceptable Risk" EU-Act labels require admin approval before public display; all Art. 73 labels render with the "informational only, not legal advice" disclaimer (EN+TR).
- **Accept:** unapproved high-severity labels never render publicly; Playwright spec covers it.

### T15.6 — Reporter reputation loop (network effect)
- **Files:** `src/app/[locale]/profile/`, OG image generation.
- **Work:** Public profile shows "N verified incidents" badge with shareable OG card. No leaderboard of reporters yet (gaming risk) — just the individual credential.
- **Accept:** badge bilingual, count from published incidents only, OG card renders.

**Sprint 15 guardrails:** no new routes; Backlog freeze still applies; every task ships with tests; `pnpm validate` green.

**v1.3 (2026-07-04)** — Added Sprint 15 from Series A board review. Key drivers: legal exposure in Supreme Court prompt (T15.1), undefined cross-audit unit economics (T15.2), zero funnel visibility behind the 15k-followers/0-users signal (T15.3).

---

## Sprint 16 — Marketing Automation Engine (v1.4; max automation, min manual)

**Principle:** AI generates 100% of marketing output using existing infra (Gemini adapter, Vertex Imagen, Resend, cron). Founder's only manual act: a one-click daily approval queue. Auto-post switches exist per channel but default OFF until legal review of spam/GDPR exposure.

### T16.1 — Incident → content engine (core)
- **Files:** new `src/lib/marketing/content-engine.ts`; new migration `marketing_queue` table (RLS: admin-only); new cron `src/app/api/cron/generate-marketing/route.ts`.
- **Work:** For each newly published incident, auto-generate and queue: (a) X post draft, (b) LinkedIn post draft (hook-first, link-in-comment format), (c) share-card image via `VertexImagenAdapter` (dark slate/emerald brand style). Use existing Gemini adapter chain with failover; PII-masked fields only; log per-item generation cost.
- **Accept:** publishing an incident enqueues 3 assets within 15 min; queue items carry status draft/approved/posted/rejected.

### T16.2 — One-click approval queue (the only manual step)
- **Files:** new admin panel section `src/components/admin/marketing-queue*`.
- **Work:** List queued assets with preview (text + image); Approve / Edit / Reject buttons; "Copy" button per platform for manual paste when auto-post is off.
- **Accept:** approve→posted pipeline works end-to-end; mobile-usable (founder approves from phone).

### T16.3 — Auto-post connectors (switchable)
- **Files:** new `src/lib/marketing/publishers/` (x.ts, linkedin.ts); env flags `MARKETING_AUTOPOST_X`, `MARKETING_AUTOPOST_LINKEDIN`.
- **Work:** X API v2 + LinkedIn API posting for approved items. Missing keys → connector disabled gracefully, Copy button remains.
- **Accept:** with test keys, an approved item posts; without keys, no errors.

### T16.4 — Weekly digest autopilot
- **Files:** new cron `src/app/api/cron/weekly-digest/route.ts`; Resend template.
- **Work:** Every Monday: compose digest from `transparency_stats` + top-3 incidents (Gemini summary, EN+TR); send via Resend to newsletter subscribers (existing list, double-opt-in only); enqueue matching social thread in approval queue.
- **Accept:** digest renders correctly; unsubscribe link works; only opted-in recipients.

### T16.5 — Milestone press-release generator
- **Files:** `src/lib/marketing/press-release.ts`; trigger checks in the digest cron.
- **Work:** On milestones (100th published incident, Aug-2 launch day, first provider claim): auto-draft press release EN+TR from live stats, generate hero image (Imagen), queue for approval with pre-filled Resend send to the media-contacts table. **Send requires explicit founder approval — no exception** (GDPR/CAN-SPAM).
- **Accept:** milestone fires exactly once; draft cites only real DB numbers.

### T16.6 — AI Act countdown series (pre-Aug-2)
- **Work:** One-shot script generates the full countdown post series (T-21, T-14, T-7, T-3, T-1, launch day; EN+TR, X+LinkedIn variants + Imagen cards) into the approval queue, scheduled by date.
- **Accept:** queue shows the dated series; each unlocks on its date.

**Sprint 16 guardrails:** (1) Nothing posts or emails externally without an approved queue item — auto-post flags only skip the *click*, never the queue. (2) No cold outreach to individuals; media-contacts table is founder-curated. (3) All generation costs logged per item. (4) Marketing copy obeys Guardrail #10 (Ready, never Compliant). (5) All content from PII-masked fields only.

**v1.4 (2026-07-04)** — Added Sprint 16: full marketing automation (content engine, approval queue, auto-post connectors, weekly digest, milestone press releases, AI Act countdown). Founder manual surface reduced to a one-click daily approval.

---

## v1.5 — Full-Repo 360 Audit: Corrections & New Sprints (2026-07-04)

A complete surface audit (all routes, actions, lib modules, 72 migrations) found existing subsystems that earlier sprint specs would duplicate. **These corrections OVERRIDE earlier task text where they conflict.**

### Corrections to earlier sprints (Antigravity: read before executing Sprint 15/16)

- **Sprint 16 / T16.1-T16.2 CORRECTION:** Do NOT create a `marketing_queue` table. The social module already exists: `social_posts`, `social_templates`, `social_assets` (migrations `20260625000001`, `20260627000001`), actions in `src/actions/social.ts`, image generation via `src/actions/social-image.ts` (Imagen). Build the content engine ON TOP of these: cron writes generated drafts into `social_posts` (status draft), approval UI extends the existing admin social components, publishers post approved `social_posts` rows.
- **Sprint 15 / T15.6 CORRECTION:** Reporter reputation must reuse the existing gamification schema (`20260608000005_gamification_and_anonymous.sql`, `20260608180000_gamification.sql`) — surface the existing reputation/badges on public profiles; do not create a parallel reputation system.
- **Sprint 16 / T16.4 NOTE:** News/content ingestion already flows via `src/lib/connectors/` (HackerNews, Reddit, RSS) → `external_queue`. The weekly digest should draw from `ecosystem_news` + `transparency_stats`, not re-fetch.

### Sprint 17 — Academy Credibility Patch (small, high-priority; before Aug 2)

- **T17.1 — Fix legal citation:** `src/app/[locale]/academy/page.tsx` cites "EU AI Act • Article 50" with text that belongs to **Article 53** (GPAI documentation duties). Correct the heading and verify quote wording against the official text. A wrong article number on a regulatory-positioning page is a credibility bug.
- **T17.2 — University tier labeling:** The three university tier cards (Boğaziçi/ODTÜ/İTÜ, Koç/Bilkent/Sabancı, TUM/ETH/Oxford) must be labeled "Target / Invited partners" (EN+TR) unless a signed MOU exists. Implied-partnership claims are a reputational and legal risk for a trust platform.
- **T17.3 — Live stats:** Replace hardcoded "350+ / 40+" numbers with values from `transparency_stats` view.
- **T17.4 — Surface expert verification:** Expert-fix fields exist (`20260701203000_add_incident_expert_fix_fields.sql`) but are invisible. Add an "Expert Verified" badge tier on incident pages (above AI-verified), and `verification_level` (`ai_verified` | `expert_verified`) to `/api/v1/incidents` responses + `docs/API.md`.

### Sprint 18 — Wiring Sprint (connect existing engines; after Sprint 16)

- **T18.1 — Autopilot control room:** Admin panel: last N `autopilot_runs` with cost/outcome, per-worker enable/disable, and a global kill-switch env flag honored by the worker. An autonomous system with one founder needs a visible off button.
- **T18.2 — Connectors → distribution:** Accepted `external_queue` items and `ecosystem_news` feed a "news to comment on" list inside the social approval queue (reply/quote-post drafts) — the "go where the fire is" GTM tactic, automated.
- **T18.3 — Watches → retention loop:** `watchProvider` exists; wire watched-provider events (new incident, official response) to Resend notifications with opt-in/opt-out. First retention mechanism on the platform.
- **T18.4 — Cross-audit → pre-triage integration check:** After T15.2 lands, verify autopilot auto-moderation consumes the pre-triage verdict instead of running its own duplicate path.

### Founder-only legal check (non-code)
`/invest` and `/investor-portal` are public. Verify with counsel that wording avoids regulated public-solicitation language (SPK/EU prospectus rules). Agents must not edit investment-related copy autonomously.

**v1.5 (2026-07-04)** — Full-repo 360 audit. Found existing social module, gamification, autopilot framework, connectors; corrected Sprint 15/16 to extend rather than duplicate. Added Sprint 17 (Academy credibility: Art. 53 fix, partner labeling, live stats, expert badge) and Sprint 18 (wiring: autopilot control room, connectors→social, watches→notifications). Execution order: T15.1 → T17 → Sprint 14 → Sprint 15 rest → Sprint 16 (as corrected) → Sprint 18.

**v1.6 (2026-07-04)** — REGULATORY PIVOT: EU Digital Omnibus adopted (Council 29 Jun 2026) defers high-risk/Art. 73 obligations to 2 Dec 2027 (Annex III) / 2 Aug 2028 (Annex I). All "Aug 2, 2026 = obligations start" claims are now WRONG and must be swept (new task T17.5). Launch narrative pivots to "The Accountability Gap". Orchestration moved to docs/MASTER_PLAN_2026H2.md — that file wins on conflicts.
