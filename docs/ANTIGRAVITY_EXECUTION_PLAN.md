# ALPAR AI — Antigravity Full Execution Plan v4 (H2 2026)

> **Revised by Architect (Claude Fable 5) on 2026-07-07.** v3 reconciled delivery state and hardened rules. v4 adds what v3 lacked: a **launch-critical path** with an explicit cut line — 21 days out, not everything is equal priority, and the Executor must know what to drop if time runs short.
>
> **Core Thesis (unchanged):** Platform is technically mature (406 incidents, full automation pipeline, RLS, i18n, accessibility). Bottleneck is **users, not code.** Every task carries a "user impact" lens.
>
> **State at issue (2026-07-07):**
> - Stages 0–3 + Stage A ✅ complete (`a96c9ca`)
> - Stage B partially delivered (`4cbeee2` news→social + GDPR delete, `f4cd43b` press releases + outreach hub)
> - Out-of-scope commits shipped (`ea2ebc9`, `52fcba8`, `f4cd43b` war room + AI pulse visualizer + outreach hub) — retro-approved in Stage B-extra below
> - Working tree at `861fe46`
> - 21 days to launch (Aug 2), "Accountability Gap" narrative
>
> **Repo hygiene (enforced 2026-07-07):** Single active branch: `master`. All feature/dependabot/release-please branches deleted. No PR is opened on a plan document.

---

## 🎯 LAUNCH-CRITICAL PATH (read this before anything else)

Launch is **Aug 2** — 21 days. Everything below is ranked. If deadlines slip, cut from the bottom, never the top.

**MUST exist by Aug 2 (launch blocks without these):**

| # | Item | Deadline | Why blocking |
|---|------|----------|--------------|
| 1 | B-extra verification evidence | **Jul 9** | Unverified admin surfaces (war room, outreach hub) are a security unknown at launch |
| 2 | Countdown queue flowing + founder approval routine | **Jul 12** (first post unlocks) | The launch narrative dies if the queue stalls |
| 3 | B1 — SSE submit feedback | **Jul 25** | First-time user's first impression; the loop that makes launch traffic convert |
| 4 | B2a — confirmation + provider-response emails | **Jul 25** | Reporter must feel heard on day one |
| 5 | `docs/RUNBOOK_LAUNCH.md` | **Aug 1** | Founder must be able to operate launch day without the Executor |
| 6 | D-extra launch assets (HN, PH, TR media, threads) | **Aug 1** | Launch day without assets = wasted launch day |

**SHOULD ship before launch (cut first if B1 slips):**
- B4 dedup confirmation (cheap — likely already done in `a96c9ca`)
- B3/B5 Accept verification reports

**CAN slip past launch (do NOT let these eat pre-launch days):**
- B2b — expert-verification email + weekly reporter digest (moves to Stage E window)
- All of Stage C (its Aug 15 deadline is already post-launch; C1 starts Aug 10, after freeze)
- Anything in E–H

**Rule of thumb:** any hour spent on a CAN-slip item before Aug 2 is a review finding.

---

## STANDING RULES (violations fail review automatically)

1. **Push before report.** Every report ends with an `origin/master` commit hash. Unpushed work does not exist.
2. **No out-of-scope commits.** Ideas beyond this plan → write a `docs/PROPOSALS/NNN-name.md` and stop. Architect approval REQUIRED before implementation. Master is not a sandbox. ✏️ *Enforcement tightened: retro-approval is a one-time courtesy; any new out-of-scope commit after 2026-07-07 will be reverted, not merged.*
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
13. **"User-zero" test.** Every user-facing feature must be manually tested as a first-time anonymous visitor on production before marking Accept. If you can't explain the value to a non-technical person in one sentence, simplify.
14. 🆕 **Plan documents are read-only for the Executor.** Only the Architect edits `docs/ANTIGRAVITY_EXECUTION_PLAN.md`, `docs/MASTER_PLAN_2026H2.md`, `docs/UPDATE_PLAN_2026Q3.md`. Executor may append proposals to `docs/PROPOSALS/`.
15. 🆕 **Single-branch workflow.** Work directly on `master` with small, reviewable commits. No feature branches, no PRs on plan docs. Emergency hotfix branches must be deleted within 24h of merge.
16. 🆕 **Stage completion requires an Architect approval line** in the report block: `Architect-Approval: <commit-hash> <YYYY-MM-DD>`. Executor may not self-mark a stage complete.

---

## ~~STAGE A — Pre-Launch Safety~~ ✅ COMPLETE (`a96c9ca`, Architect-Approval: `a96c9ca` 2026-07-06)

All items (A1–A5) verified. Autopilot control room, CI, indexes, prod readiness, accessibility pass.

---

## STAGE B — Core UX Loop (hard deadline: Jul 25)

**Delivery status (2026-07-07):**

| Item | Status | Commit |
|------|--------|--------|
| B1. Real-time submit feedback (SSE) | ⬜ Not started | — |
| B2. Reporter notification loop | ⬜ Not started | — |
| B3. News → social queue | ✅ Shipped | `4cbeee2` — awaiting Accept-criteria verification |
| B4. Autopilot/pre-triage dedup | ⬜ Unverified | Possibly folded into `a96c9ca` — Executor to confirm |
| B5. KVKK/GDPR delete flow | ✅ Shipped | `4cbeee2` — awaiting Accept-criteria verification |

**Next required Executor action:** Report B3 + B5 Accept-criteria pass/fail table with commit-level evidence; confirm B4 state; begin B1 as top priority.

### B1. Real-time submit feedback (SSE) — TOP PRIORITY

- SSE endpoint at `/api/incidents/[id]/status` streaming: `queued` → `analyzing` → `scoring` → `complete`.
- Stage updates written to `incident_processing_status` column or Upstash pub/sub.
- `IncidentForm` post-submit shows animated progress card ("🔍 Kaynaklar taranıyor...", "⚖️ TruthScore hesaplanıyor...") via `EventSource`.
- `complete` → auto-redirect to `/incidents/[id]` with success animation.
- Fallback: SSE disconnect → poll every 5s. Audit >60s → email-notify message.
- _Accept:_ live feedback within 2s; complete redirect within 90s standard cases; mobile Safari works; Playwright e2e covers SSE flow with mocked audit.

### B2. Reporter notification loop — split into launch-required (B2a) and post-launch (B2b)

**B2a — LAUNCH-REQUIRED (deadline Jul 25):**
- **Immediate:** whistleblower confirmation email (verify `getWhistleblowerConfirmationEmail` fires reliably).
- **On provider response:** new `getProviderResponseNotificationEmail()` in `src/emails/templates.ts` → reporter.
- Infrastructure both need: one-click unsubscribe, per-user daily cap 3, `email_preferences` table with RLS.
- _Accept:_ e2e demo with test reporter receiving both email types; unsubscribe works; daily cap enforced; bilingual.

**B2b — POST-LAUNCH (executes in Stage E window; do not start before Aug 10):**
- **On expert verification:** email reporter.
- **Weekly digest for active reporters** (≥1 published incident): Monday stats digest, opt-in only.
- _Accept:_ same standards as B2a, reported with Stage E.

### B3. News → social queue ✅ (`4cbeee2` — verification required)

Accepted `ecosystem_news` rows (status='accepted') generate reply/quote draft entries into `social_posts` via the content engine. _Accept:_ new accepted news item yields queued draft within one cron cycle.

### B4. Autopilot/pre-triage dedup

Confirm `autoModerateIncidentAction` consumes `preTriageCheck` verdict (no duplication); wire cost log into weekly summary row. _Accept:_ single triage path proven by test.

### B5. KVKK/GDPR delete flow ✅ (`4cbeee2` — verification required)

"Hesabımı Sil" → 72h wait → soft-delete → 30d hard-delete cron. _Accept:_ e2e test; deleted user's incidents show "Anonim Kullanıcı"; auto-unsubscribe.

### B-extra. RETRO-APPROVED (one-time, out-of-scope commits between `a96c9ca` and `861fe46`)

These items were shipped without prior Architect approval. Retro-approved to avoid revert cost this close to launch. **Executor must report Accept-criteria evidence for each within 48h; unverified items will be reverted.**

- **B-extra.1.** War room / 360° strategic dashboard (`ea2ebc9`) + AI pulse visualizer (`52fcba8`). Admin-only, no public exposure. Verify: admin-only RLS, no PII leak in visualizer feeds, `createAdminClient()` not used from public paths.
- **B-extra.2.** Press releases + admin outreach hub (`f4cd43b`). Verify: outreach still gated by approval queue (Standing Rule #6), no external email fires without a queue item, contact list is admin-editable only.
- **B-extra.3.** Live Vertex AI sync (`52fcba8`). Verify: no key leak to client bundle, cost logged, rate-limited.

**No further retro-approvals will be granted.**

---

## STAGE C — API Productization (hard deadline: Aug 15; start after B approved)

**C1. `client_api_keys` table (T14.5).** SHA-256 hashed keys, tiers, admin UI for create/revoke/label. Migrate `client_*` rows out of `api_keys` (which returns to LLM-provider secrets only). _Accept:_ revoked key 401s; two enterprise customers hold distinct keys; unit tests.

**C2. API docs + dataset.** Update `docs/API.md`: v1 filters (category, severity, eu_risk, provider, model), tiers/limits, `verification_level`, curl examples, remove any "No REST endpoints" leftovers. Regenerate sample dataset into gitignored `exports/`. _Accept:_ every documented example runs against prod.

**C3. Usage metering.** Per-key request counts (Upstash sliding-window or table), surfaced in admin next to each key. _Accept:_ counts visible and correct after test calls.

**C4. Tier-based API rate limiting.** Free 100/day, Pro 1000/day, Enterprise 10000/day. Upstash sliding window. 429 + `Retry-After`. _Accept:_ free tier 101st request → 429; unit tests.

**C5. Embed widget & viral sharing kit.** `/incidents/[id]/embed` route exists but is undiscovered.

- **Embed generator** on every incident page: "Bu raporu sitenize ekleyin" → copyable `<iframe>` + `<script>` variant.
- **"Powered by ALPAR AI"** footer badge inside embed, linking to full incident.
- **Share buttons** (X/LinkedIn/Copy Link) on incident detail, pre-filled with TruthScore.
- **OG image** for each incident: dynamic `/incidents/[id]/opengraph-image` — verify card renders title + TruthScore + severity badge.
- _Accept:_ embed renders in external HTML; "Powered by" links back; share URLs correct; OG image passes Facebook/Twitter card validators; bilingual.

---

## STAGE D — Launch Week (CALENDAR-LOCKED: Aug 1–9)

Feature freeze. Only P0/P1 fixes and queue flow monitoring.

Prepare `docs/RUNBOOK_LAUNCH.md` before Aug 1:
- Sentry >5 unresolved/hour → P0
- Submit funnel `submit_start → submit_complete` conversion <50% → alarm
- Cross-audit failure rate >20% in last hour → kill switch
- DB active connections >15 on FREE tier → investigate
- Rollback: `git revert HEAD && git push` (Vercel auto-deploys)
- Contacts/escalation ladder

**D-extra. Launch day acquisition assets** (Executor prepares markdown drafts; founder sends):
- Hacker News "Show HN" post (EN, ≤80 words + link)
- Product Hunt page (title, tagline, 5 screenshots, first comment)
- TR tech media pitch (Webrazzi, Shiftdelete, Technopat) — draft only
- 3 X/Twitter thread drafts: launch (EN), launch (TR), data thread with top-5 findings from 400+ incidents

All under `docs/launch-assets/`. Founder approves before send.

---

## STAGE E — Growth Loops (hard deadline: Sep 15)

Reframed around "First 100 Real Users" milestone.

**E1. Weekly digest cron (finalize T16.4).** Monday digest from `transparency_stats` + top-3 incidents (Gemini EN+TR summary) → Resend to double-opt-in subscribers + social thread draft into queue. CTA in every digest: "Siz de bir AI deneyiminizi raporlayın → /submit". _Accept:_ dry-run to test list; CTA + unsubscribe verified.

**E2. Milestone press-release generator.** Triggers: 500th published incident, first claimed profile, first official provider response. Draft EN+TR + Imagen hero → approval queue (idempotency test). _Accept:_ trigger fires exactly once per milestone.

**E3. Onboarding & first-submit nudge.** New users not submitting within 48h → single Resend nudge. `onboarding_nudge_sent_at` on profile. _Accept:_ e2e; fires once; already-submitted users excluded.

**E4. Reporter reputation surfacing.** Public profile: gamification badges + "N verified incidents" + shareable OG card (`/profile/[id]/opengraph-image`). "Share your impact" button → pre-filled tweet. _Accept:_ bilingual; counts from published only; OG renders correctly.

**E5. SEO pass.** Incident structured data (Article/Report), related-incidents block, breadcrumbs, sitemap verification. _Accept:_ rich-results test passes on 3 samples.

**E6. Health check endpoint.** `/api/health` → DB + Upstash + last autopilot run status. _Accept:_ 200 OK; degraded when DB down.

**E7. Growth dashboard (admin).** `/admin/growth`:
- Daily signups (30d graph)
- Daily submissions (organic vs auto-import, 30d)
- Retention: % users with ≥2 incidents
- Funnel: page view → signup → first submit → second submit
- Data from Plausible + DB counts (no new tracking).
- _Accept:_ real data; bilingual; admin-only RLS.

---

## STAGE F — Academy & Expert Portal (hard deadline: Nov 15)

**F1. Expert review queue.** Approved experts see incidents awaiting verification in their discipline; actions: verify / annotate (`expert_fix` fields) / decline. Expert action upgrades incident to `expert_verified` + refreshes badges + API `verification_level`. _Accept:_ full flow with test expert; experts see only assigned scope (RLS).

**F2. Academy beta portal.** Read-only research library for approved academics: filtered incident explorer + CSV export (published, PII-masked only) under research-license notice. _Accept:_ export contains zero PII (seeded fake PII test).

**F3. "State of AI Incidents Q4" generator.** Script assembling live stats + top cases + taxonomy breakdown into Markdown/PDF draft for founder + expert co-authors. _Accept:_ draft cites only real DB numbers; founder approves before publication.

---

## STAGE G — Data Quality & Scale (continuous, when idle or F approved)

**G1.** Taxonomy coverage: ≥80% of imported incidents carry Art. 73 class; monthly coverage % report.
**G2.** Dedup sweep across corpus (near-duplicate titles/URLs) → admin merge tool.
**G3.** i18n completeness check script (missing TR keys fail CI).
**G4.** Monthly cost report: cross-audit spend, pre-triage skip rate, Imagen/Veo usage.

---

## STAGE H — Continuous Maintenance (standing)

Dependabot PRs: merge only after CI green (security patches same week; feature bumps batched weekly). Sentry triage weekly; recurring errors → fix tasks. `CHANGELOG.md` per release. **Never touch:** backlog-frozen surfaces (dilemmas, bounties, invest*, feed, newsletter), brand assets, legal copy, pricing amounts.

---

## REPORTING PROTOCOL

After each stage: push → report with:

1. `origin/master` commit hash
2. Accept-criteria pass/fail table with verification method per item
3. Deviations / blockers
4. Proposal notes (if any) — filed as `docs/PROPOSALS/NNN-title.md`, not implemented
5. Await Architect approval line: `Architect-Approval: <hash> <YYYY-MM-DD>` — Executor may NOT self-approve.

**Executor forbidden actions** (founder-only):
- Sending external emails/posts without an approved queue item
- Contacting journalists / universities / investors
- Editing investment or legal copy
- Changing pricing amounts
- Editing plan documents (Standing Rule #14)
- Opening or merging PRs on plan documents
- Creating new branches (Standing Rule #15)

---

## DEFINITION OF DONE (whole plan)

All stages A–H accepted; launch executed Aug 2 with zero P0; ≥1 paying customer flow technically ready (C1–C4); embed widget live with measurable external embeds (C5); **≥100 organic signups tracked in growth dashboard (E7);** expert portal live with ≥1 real expert action; monthly cost + coverage reports automated. Then request the 2027 plan from the Architect.

---

## CHANGELOG (v3 → v4)

| Change | Rationale |
|--------|-----------|
| Launch-Critical Path section added (MUST / SHOULD / CAN-slip) | 21 days out, the Executor needs an explicit cut line, not a flat task list |
| B2 split into B2a (launch-required) / B2b (post-launch) | Expert-verification email + weekly digest don't block launch; confirmation + provider-response do |
| Stage C explicitly barred from pre-launch work | Its deadline (Aug 15) is post-launch; pre-launch hours must go to B1/B2a/D |
| Calendar checkpoints anchored (Jul 9, Jul 12, Jul 25, Aug 1) | Machine-checkable dates replace "earlier is better" |

## CHANGELOG (v2 → v3)

| Change | Rationale |
|--------|-----------|
| Repo hygiene note (single-branch, no plan-doc PRs) | Cleanup performed 2026-07-07; workflow now enforced |
| Standing Rule #2 tightened (retro-approval is one-time) | Prevent recurrence of out-of-scope drift observed between `a96c9ca` and `861fe46` |
| Standing Rule #14 added (plan docs Architect-only) | Executor edited plan v1→v2 without approval; prevent recurrence |
| Standing Rule #15 added (single-branch workflow) | Codifies the 2026-07-07 cleanup |
| Standing Rule #16 added (Architect-Approval line required) | Prevents Executor self-approval |
| Stage B delivery status table | Reflects actual state at `861fe46` |
| B-extra section (retro-approval) | War room, press releases, outreach hub, live Vertex sync — accepted once, must be verified within 48h |
| B1 explicitly marked TOP PRIORITY | Biggest remaining UX gap before launch |
| Reporting Protocol: Architect-Approval line + PROPOSALS/ path | Machine-checkable stage sign-off |
| Executor forbidden actions expanded | Adds plan-doc editing, plan-doc PRs, new branches |

---

## IMMEDIATE NEXT STEPS FOR EXECUTOR

1. **Jul 9:** Report Accept-criteria evidence for B3, B5, B-extra.1–3.
2. Confirm B4 status (whether folded into `a96c9ca` or still open).
3. Begin B1 (SSE submit feedback) — top of the launch-critical path.
4. Then B2a only (NOT B2b — that waits for Stage E).
5. Do not touch Stage C before Aug 10. Any pre-launch hour on a CAN-slip item is a review finding.
6. All work on `master`. No new branches. No plan-doc edits.
7. Each commit ≤ single Accept-criterion scope; report after every push.
