# ALPAR AI — Antigravity Full Execution Plan v2 (H2 2026)

> **Revised by Architect (Claude Opus 4.6) on 2026-07-06.** This revision integrates product-market fit priorities into the existing technical roadmap. Changes from v1 are marked with 🆕 or ✏️.
>
> **Core Thesis of This Revision:** The platform is technically mature (406 incidents, full automation pipeline, RLS, i18n, accessibility). The bottleneck is no longer code — it's **users.** Every stage below now has a "user impact" lens: if a task doesn't bring users, retain users, or make users share — it gets deprioritized or cut.
>
> **State at issue (2026-07-06):** Stages 0–3 + Stage A complete and approved at `a96c9ca`. 406 published incidents. Countdown posts queued (first unlocks Jul 12). Launch: Aug 2, "Accountability Gap" narrative.

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
13. 🆕 **"User-zero" test.** Every user-facing feature must be manually tested as a first-time anonymous visitor on production before marking Accept. If you can't explain the value to a non-technical person in one sentence, simplify.

---

## ~~STAGE A — Pre-Launch Safety~~ ✅ COMPLETE (`a96c9ca`)

All items (A1–A5) completed and verified. Autopilot control room, CI, indexes, prod readiness, and accessibility pass all green.

---

## STAGE B — Core UX Loop ✏️ (hard deadline: Jul 25 — earlier is better)

> **v1 title was "Wiring". Renamed to reflect the real goal: making the submit→result→share loop feel instant and alive.**

**B1. 🆕 Real-time submit feedback (SSE).** After `submitIncident` fires the cross-audit engine, the user currently sees nothing until page reload. This is the #1 UX gap. Implement:

- A Server-Sent Events endpoint at `/api/incidents/[id]/status` that streams processing stages: `queued` → `analyzing` → `scoring` → `complete`.
- `submitIncident` action writes stage updates to a lightweight `incident_processing_status` column (or Upstash pub/sub if column is too noisy).
- Client-side: `IncidentForm` post-submit state shows an animated progress card with live stage labels ("🔍 Kaynaklar taranıyor...", "⚖️ TruthScore hesaplanıyor...") using `EventSource`.
- On `complete`: auto-redirect to `/incidents/[id]` with a celebratory micro-animation ("✅ Raporunuz yayınlandı!").
- Graceful degradation: if SSE disconnects, fall back to polling every 5s; if the audit takes >60s, show "Detaylı analiz devam ediyor — sonucu e-posta ile alacaksınız."
- _Accept:_ submit → live feedback within 2s; complete redirect within 90s for standard incidents; works on mobile Safari; Playwright e2e test covering the full SSE flow with a mocked audit.

**B2. ✏️ Reporter notification loop (expanded from v1 "Watches → notifications").** v1 only covered watchers. This revision adds **the reporter** as the primary notification target:

- **Immediate:** Whistleblower confirmation email (already exists via `getWhistleblowerConfirmationEmail` — verify it fires reliably).
- **On provider response:** Email the original reporter: "X şirketinden resmi yanıt geldi — görüntülemek için tıklayın." New template `getProviderResponseNotificationEmail()` in `src/emails/templates.ts`.
- **On expert verification:** Email the reporter: "Raporunuz uzman tarafından doğrulandı."
- **Weekly digest for active reporters:** If a user has ≥1 published incident, Monday digest of their incidents' stats (views, votes, provider responses). Opt-in only.
- Strict: one-click unsubscribe, per-user daily cap (max 3 emails/day), `email_preferences` table with RLS.
- _Accept:_ e2e demo with a test reporter account receiving all 3 email types; unsubscribe kills all; daily cap enforced; bilingual templates.

**B3. News → social queue.** _(Unchanged from v1 B1.)_ Accepted `ecosystem_news` rows (status='accepted') generate "reply/quote draft" entries into `social_posts` via the content engine. _Accept:_ new accepted news item yields a queued draft within one cron cycle.

**B4. Autopilot/pre-triage dedup.** _(Unchanged from v1 B3.)_ Confirm `autoModerateIncidentAction` consumes `preTriageCheck` verdict; wire cost log into weekly summary. _Accept:_ single triage path proven by test.

**B5. ✏️ Veri silme hakkı akışı (KVKK/GDPR).** _(Unchanged from v1 B4.)_ "Hesabımı Sil" → 72h wait → soft-delete → 30d hard-delete cron. _Accept:_ e2e test; deleted user's incidents show "Anonim Kullanıcı"; auto-unsubscribe.

---

## STAGE C — API Productization (hard deadline: Aug 15; start as soon as B is approved)

> _Largely unchanged. One new item (C5) added for embed widget._

**C1. `client_api_keys` table (T14.5).** _(Unchanged.)_ SHA-256 hashed keys, tiers, admin UI for create/revoke/label. _Accept:_ revoked key 401s; two enterprise customers hold distinct keys; unit tests.

**C2. API docs + dataset.** _(Unchanged.)_ Update `docs/API.md`: v1 filters, tiers/limits, curl examples, remove "No REST endpoints" statement. _Accept:_ documented examples run against prod.

**C3. Usage metering.** _(Unchanged.)_ Per-key request counts (Upstash or table), surfaced in admin. _Accept:_ counts visible and correct after test calls.

**C4. Tier-based API rate limiting.** _(Unchanged.)_ Free: 100/day, Pro: 1000/day, Enterprise: 10000/day. Upstash sliding window. 429 + `Retry-After`. _Accept:_ free tier 101st request → 429; unit tests.

**C5. 🆕 Embed widget & viral sharing kit.** The `/incidents/[id]/embed` route exists (178 lines) but has no discovery mechanism. Add:

- **Embed code generator** on every incident detail page: "Bu raporu sitenize ekleyin" button that reveals a copyable `<iframe>` snippet + `<script>` widget variant.
- **"Powered by ALPAR AI"** footer badge inside the embed with link back to the full incident page.
- **Share buttons** (X/LinkedIn/Copy Link) on incident detail with pre-filled text citing the TruthScore.
- **OG image generation** for each incident: dynamic `/incidents/[id]/opengraph-image` (already has a route — verify it generates a proper card with title + TruthScore + severity badge).
- _Accept:_ embed renders correctly in an external HTML page; "Powered by" links back; share buttons generate correct URLs; OG image passes Facebook/Twitter card validators; bilingual.

---

## STAGE D — Launch Week (CALENDAR-LOCKED: Aug 1–9) — FREEZE + SUPPORT

> _Unchanged from v1._ Feature freeze. Only: monitor Sentry, fix P0/P1 bugs, keep queues flowing.

Prepare `docs/RUNBOOK_LAUNCH.md` before Aug 1:

- Error Rate: Sentry >5 unresolved/hour → P0
- Submit Funnel: submit_start → submit_complete conversion <50% → alarm
- Cross-Audit Failures: >20% failure rate in last hour → kill switch
- DB Connections: active >15 on FREE tier → investigate
- Rollback: `git revert HEAD && git push` (Vercel auto-deploys)
- Contacts/escalation.

🆕 **D-extra: Launch day user acquisition checklist** (founder executes, Executor prepares assets):

- [ ] Hacker News "Show HN" post draft (EN, max 80 words + link)
- [ ] Product Hunt launch page draft (title, tagline, 5 screenshots, first comment)
- [ ] Turkish tech media pitch (Webrazzi, Shiftdelete, Technopat) — draft only, founder sends
- [ ] 3 Twitter/X thread drafts: "We built an AI accountability tracker" (EN), "Yapay zeka hesap verebilirliği" (TR), data-driven thread with top 5 findings from 400+ incidents

_Accept:_ All draft assets exist as markdown files in `docs/launch-assets/`; founder reviews and approves before launch day.

---

## STAGE E — Growth Loops (hard deadline: Sep 15; start when C approved + freeze over)

> **✏️ Reframed around the "First 100 Real Users" milestone.** Every item must measurably contribute to acquisition or retention.

**E1. ✏️ Weekly digest cron (finalize T16.4).** Monday digest from `transparency_stats` + top-3 incidents (Gemini summary EN+TR) → Resend to double-opt-in subscribers + social thread draft into queue. 🆕 Add CTA in every digest: "Siz de bir AI deneyiminizi raporlayın → /submit". _Accept:_ one full dry-run to a test list; CTA links work; unsubscribe works.

**E2. Milestone press-release generator (T16.5).** _(Unchanged.)_ Triggers: 500th published incident, first claimed profile, first official response. Draft EN+TR + Imagen hero → approval queue. _Accept:_ unit test on trigger idempotency.

**E3. 🆕 Onboarding & first-submit nudge.** New users who sign up but don't submit within 48h → single Resend nudge email: "İlk raporunuzu oluşturun — 2 dakikada tamamlayın." Track: `onboarding_nudge_sent_at` on user profile. Never re-send. _Accept:_ e2e test; email fires exactly once; already-submitted users are excluded.

**E4. ✏️ Reporter reputation surfacing (expanded).** Public profile: gamification badges + "N verified incidents" + **shareable OG card** (dynamic image route `/profile/[id]/opengraph-image`). 🆕 Add "Share your impact" button on profile page generating a pre-filled tweet: "I've reported N AI incidents on @AlparAI — join the accountability movement." _Accept:_ bilingual; counts from published incidents only; OG card renders correctly.

**E5. SEO pass.** _(Unchanged.)_ Structured data, related-incidents block, breadcrumbs, sitemap verification. _Accept:_ rich-results test passes on 3 sample pages.

**E6. Health check endpoint.** _(Unchanged from v1 E5.)_ `/api/health` → DB + Upstash + last autopilot run. _Accept:_ 200 OK; degraded when DB down.

**E7. 🆕 User acquisition dashboard (admin).** Simple admin page `/admin/growth` showing:

- Daily signups (graph, last 30 days)
- Daily submissions (organic vs. auto-import, last 30 days)
- Retention: % of users who submitted ≥2 incidents
- Funnel: page view → signup → first submit → second submit
- Data from existing tables, no new tracking infra needed (Plausible + DB counts).
- _Accept:_ page renders with real data; bilingual; admin-only RLS.

---

## STAGE F — Academy & Expert Portal (hard deadline: Nov 15; start when E approved)

> _Unchanged from v1._

**F1. Expert review queue.** Approved experts get a dashboard listing incidents awaiting expert verification in their discipline; actions: verify / annotate (`expert_fix` fields) / decline. _Accept:_ full flow with a test expert account; RLS: experts see only assigned scope.

**F2. Academy beta portal.** Read-only research library for approved academics: filtered incident explorer + CSV export (published, PII-masked only) under a research-license notice page. _Accept:_ export contains zero PII.

**F3. "State of AI Incidents Q4" generator.** Script assembling live stats + top cases + taxonomy breakdown into a Markdown/PDF draft. _Accept:_ generated draft cites only real DB numbers; founder approves before publication.

---

## STAGE G — Data Quality & Scale (continuous; start when F approved or in idle time with approval)

> _Unchanged from v1._

**G1.** Taxonomy coverage: ≥80% of imported incidents carry Art. 73 class; report monthly coverage %.
**G2.** Dedup sweep across the existing corpus (near-duplicate titles/URLs) → merge tool in admin.
**G3.** i18n completeness check script (missing TR keys fail CI).
**G4.** Monthly cost report: cross-audit spend, pre-triage skip rate, Imagen/Veo usage.

---

## STAGE H — Continuous Maintenance (weekly, standing)

> _Unchanged from v1._

Dependabot PRs: merge only after CI green (security patches same week). Sentry triage weekly; recurring errors become fix tasks. Keep CHANGELOG.md per release. Never touch: Backlog-frozen surfaces (dilemmas, bounties, invest\*, feed, newsletter features), brand assets, legal copy, pricing amounts.

---

## REPORTING PROTOCOL

After each stage: push → report to Architect with (1) origin hash, (2) Accept-criteria table with pass/fail + how verified, (3) deviations/blockers, (4) proposal notes if any. Await approval before the next stage. Founder-only items you must NEVER do: send external emails/posts without an approved queue item, contact journalists/universities/investors, edit investment or legal copy, change pricing.

---

## DEFINITION OF DONE (whole plan)

All stages A–H accepted; launch executed Aug 2 with zero P0; ≥1 paying customer flow technically ready (C1–C4); embed widget live with measurable external embeds (C5); **≥100 organic signups tracked in growth dashboard (E7);** expert portal live with ≥1 real expert action; monthly cost + coverage reports automated. Then request the 2027 plan from the Architect.

---

## CHANGELOG (v1 → v2)

| Change                                                            | Rationale                                                                           |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Stage A marked complete                                           | All items verified at `a96c9ca`                                                     |
| Stage B renamed "Core UX Loop", B1 added (SSE real-time feedback) | Submit-and-forget kills retention. Users need instant gratification.                |
| B2 expanded to include reporter notifications                     | Watchers alone aren't enough. The reporter IS the primary user.                     |
| C5 added (Embed widget + viral sharing)                           | Zero-cost organic distribution. Embed route exists but is undiscoverable.           |
| D-extra added (Launch day assets)                                 | Launch without prepared assets = wasted launch day.                                 |
| E3 added (Onboarding nudge)                                       | 48h nudge email is the simplest retention lever.                                    |
| E4 expanded (Share your impact)                                   | Social proof + user-generated virality.                                             |
| E7 added (User acquisition dashboard)                             | "What gets measured gets managed." Can't track first-100-users without a dashboard. |
| Rule #13 added ("User-zero" test)                                 | Every feature must survive the "show a non-technical person" test.                  |
| Definition of Done updated                                        | Added ≥100 organic signups as a hard success metric.                                |
