# ALPAR AI — Antigravity Full Execution Plan v7.4 (H2 2026 → 2027)

> **Revised by Architect (Claude Opus 4.8) on 2026-07-09 (early morning).** v7.4 professional-planning additions on top of v7.3's code-reality alignment: (1) X-series legal/crisis playbook, (2) W-series Aug 2 hour-by-hour launch-day timeline, (3) Y-series T+0 → T+30 growth-signal & pivot-check kit, (4) Standing Rule #20 daily cost-budget alarm. Also processes Antigravity's `bb1fcca` M1 audit — the home page carries the only HIGH-severity finding (3-element horizontal overflow); every other page is LOW-severity touch-target ergonomics.
>
> **v7.3 baseline (still valid):** 360° code-reality audit + priority realignment. Three parallel Explore agents inspected the codebase against plan assumptions. Findings changed the launch-critical path materially.
>
> **v7.3 core discoveries:**
> - **B1 (SSE real-time submit), B5 (KVKK delete), C5 (embed widget) are already shipped** — the plan misidentified them as TODO. DB column name is `processing_stage` (not `incident_processing_status`); delete flow lives at `settings/page.tsx` (not `settings/delete-account/`).
> - **`vercel.json` cron config missing `process-deletions` (KVKK LEGAL obligation) and `generate-marketing`** — production silently non-functional; 15 min fix but if unnoticed = launch-day KVKK violation.
> - **`api_keys` table stores keys plain-text** — no sha256, no tier column, no client_type column. Security migration required before launch.
> - **`/api/unsubscribe/` API route missing** — front page exists but no endpoint for one-click email footer links (CAN-SPAM/KVKK legal requirement).
> - **"408 incidents" launch copy vs. seed-vs-organic reality** — HN/PH/press pitches claim "408 verified" but the vast majority are seed migrations. First technical audit blows this up. Honesty pass required.
> - **Playwright config missing iPhone SE (375) and Pixel 7 (412)**; all e2e specs use `if (isMobile) test.skip()` — mobile regression blind spot.
> - **Pre-launch T-25 → T-0 campaign has zero material** — countdown threads, teaser landing, waitlist mechanism all absent.
>
> **Core Thesis:** Bottleneck is **users, not code** (2026) → then **revenue, not users** (2027 H1) → then **regulatory moment capture** (2027 H2). Every task carries the lens of its phase.
>
> **State at issue (2026-07-08 late evening, T-25):**
> - Stages 0–3 + A ✅; Stage B ✅ (`Architect-Approval: 5b1a0f5`); N-series + D-prep ✅ (`Architect-Approval: 1d225fe 2026-07-08`)
> - **B1, B5 confirmed shipped via v7.3 audit** (previously marked partial/verification-pending)
> - **C5 confirmed shipped via v7.3 audit** (previously listed as work item)
> - Stage C: OPEN — REWRITTEN in v7.3 (C1 split into C1a security migration + C1b onboarding; C3/C4 pushed to post-freeze; C5 verification-only)
> - M-series: OPEN, top eng priority — **M0 pre-audit added (Playwright config + skip() cleanup)**
> - **Traction baseline (corrected 2026-07-09):** 4 organic incident reports pre-launch (incl. the Grok passport case) — cold-start baseline is 4, not 0.
> - **New launch-blockers surfaced in v7.3:** vercel.json cron fix (Jul 9), /api/unsubscribe/ endpoint (Jul 12), api_keys hardening migration (Jul 15), "408 incidents" honesty pass (Jul 20), pre-launch T-25→T-0 campaign kickoff (Jul 12)
> - 25 days to launch (Aug 2), "Accountability Gap" narrative
>
> **PACING (rewritten in v6):** Deadlines are **latest-acceptable dates, never waiting periods**. The moment a stage is approved, start the next one — even if its deadline is weeks away. The ONLY calendar lock is the **Aug 1–9 launch freeze**: during that window only Stage D work runs; any in-progress stage pauses and resumes Aug 10. An idle Executor is a review finding.
>
> **Repo hygiene:** Single active branch: `master`. No PR is opened on a plan document.

---

## 🚨 STAGE R — REPO CONFIDENTIALITY (URGENT — supersedes everything else)

**Discovery (2026-07-08 audit):** the GitHub repo is **public**, exposing: `docs/P1-SPRINT-PLAN.md` (enumerates past security vulnerabilities — an attacker's handbook), `docs/VERCEL-RECOVERY.md` (Vercel account username + recovery path), valuation/MRR/runway seed migrations, SWOT data admitting a past `.env.local` leak, named outreach/grant contact lists, and every strategy/execution plan. Zero stars/forks — likely undiscovered. Git history is clean of actual secrets.

**R1 — FOUNDER, TODAY (1 click):** GitHub → repo **Settings → General → Danger Zone → Change visibility → Private**. Vercel's Git integration keeps deploying from private repos — no downtime. This repo stays private permanently (strategy, plans, runbooks, seeds, audits live here).

**R2 — FOUNDER + Executor, this week: token rotation.** Because SWOT documents a past `.env.local` leak, rotate once: Supabase service-role key, Vercel token, Resend, OpenRouter, Vertex, Upstash. Executor prepares the checklist and verifies the app works after each rotation; founder performs the rotations in each dashboard. *Accept:* all six rotated; prod smoke test green after each.

**R3 — Executor, POST-LAUNCH (not before Aug 10): curated public repo.** Create `alparai-platform` public repo: app source + PUBLIC-OK docs only (API.md, ARCHITECTURE.md, SECURITY.md, EU_AI_ACT_TAXONOMY.md, ADRs, audit methodology), **fresh git history** (init from filtered tree — never push this repo's history). Strategy docs, strategy seed migrations, runbooks, launch assets never enter it. This preserves the AGPL open-source trust card without the exposure. *Accept:* `git ls-files` of the public repo contains zero PRIVATE-flagged files; Architect reviews the file list before the repo goes public.

---

## 🎯 LAUNCH-CRITICAL PATH

Launch is **Aug 2**. Everything below is ranked. If deadlines slip, cut from the bottom, never the top. Deadlines are latest-acceptable dates — finish early, start the next item immediately.

**MUST exist by Aug 2 (launch blocks without these) — REORDERED in v7.3 after 360° audit:**

| # | Item | Deadline | Why blocking |
|---|------|----------|--------------|
| 1 | **R1 repo → private** (founder, 1 click; MCP tool unavailable) | **Jul 9** | Active public exposure of strategy/security docs |
| 2 | **🆕 vercel.json cron fix** — register `process-deletions` + `generate-marketing` | **Jul 9** | KVKK LEGAL obligation (delete cron); social queue frozen without it |
| 3 | **🆕 /api/unsubscribe/ endpoint** — one-click token-based unsub | **Jul 12** | CAN-SPAM/KVKK legal; email sending is effectively unsafe without it |
| 4 | R2 token rotation (founder + executor support) | **Jul 11** | `.env.local` leak history |
| 5 | **🆕 C1a — api_keys sha256+tier+client_type migration** | **Jul 15** | Plain-text credential store — post-launch leak is unrecoverable |
| 6 | **🆕 M0 + M1 + M2 + M3 mobile sprint** (audit → fix → CI lock) | **Jul 18** | Majority-mobile launch traffic |
| 7 | **🆕 "408 incidents" honesty pass** — seed-vs-organic UI badge + copy softening | **Jul 20** | First technical audit blows up unsupported claims |
| 8 | N-series ✅ COMPLETE (`Architect-Approval: 1d225fe 2026-07-08`) | ~~Jul 20~~ | done |
| 9 | Countdown queue flowing + founder approval routine | **Jul 12** (first post unlocks) | Launch narrative dies if queue stalls |
| 10 | **🆕 Pre-launch T-25→T-0 campaign** — countdown threads, teaser + waitlist | **Jul 12 start** | 25-day attention window otherwise empty |
| 11 | **🆕 RUNBOOK_LAUNCH.md v1.1** — Turnstile/Resend/SSE kill-switches + T-25 checklist | **Aug 1** | Founder must operate launch day alone |
| 12 | D-extra launch assets completion (Shiftdelete/Technopat/LinkedIn/Reddit + PH screenshots) | **Aug 1** | Assets missing = wasted launch day |

**NEXT after the above (no waiting — start as soon as MUST items for the day are done):**
- Stage C rewrite (C2 API.md fix, C5 verification-only, C1b enterprise onboarding) — starts as MUSTs clear
- C3 usage metering + C4 tier rate limiting — post-freeze (Aug 10)
- B2b — expert-verification email + weekly reporter digest (Stage E window, Aug 10+)

**Rule of thumb:** an idle Executor and an hour spent out-of-plan are both review findings.

---

## 📱 M-SERIES — Mobile Quality Sprint (v7 → v7.3 → v7.4; M1 ✅ COMPLETE via `bb1fcca`; deadline Jul 18)

> **v7.4 update — M1 result:** Antigravity ran the audit early (before M0 could be committed) and published `docs/MOBILE_AUDIT.md` + 30 screenshots (10 pages × 3 viewports) at `bb1fcca`. Findings:
> - **HIGH severity — home page only.** Horizontal overflow on all three viewports (scrollWidth 389/404/426 vs. viewport 375/390/412). Root elements: `div.bg-brand-600/8`, `div.bg-warning-500/15`, `div.flex`. **All three overflows share the same shared component** — one fix likely resolves all three viewport rows.
> - **LOW severity — every other page.** Only issue is touch-target ergonomics (elements < 44px): incidents/leaderboard (~126 each), submit (48), academy/blog (38), ai-act/transparency (32), unsubscribe (33), incident_detail (1).
> - **Zero overflow on pages other than home.** Which means `incident-list.tsx`, `submit page`, admin table pages, etc. all pass the primary launch-blocker check.
>
> **v7.4 revised M2 sequence:** land the home-overflow fix first (blocks launch narrative — the landing page is the first surface for HN/PH/TR press traffic); treat touch-target sweep as post-launch ergonomics (SHOULD, not MUST), unless the founder demands it before Aug 2 on real-device confirmation.

> Founder reports broken mobile UI. Launch traffic will be majority-mobile (social-driven). Nothing else ships to prod until M1's audit table exists.

**🆕 M0. Pre-audit configuration (v7.3, MUST before M1 — 2-3 hours).** The audit itself cannot run reliably without this:

- **Playwright config gap:** `playwright.config.ts` L18-19 currently defines only `mobile-safari` = iPhone 14 (390×844). Add two projects: `mobile-se` = iPhone SE (375×667) and `mobile-pixel` = Pixel 7 (412×915). All three viewports run in CI.
- **Skip-mobile pattern removal:** Every e2e spec bypasses mobile viewports with `if (isMobile) test.skip()` — hiding regression. Clean up:
  - `tests/e2e/accessibility.spec.ts` L15-16, 55-56, 67-68, 86-87
  - `tests/e2e/flows/nav.spec.ts` L15-19
  - `tests/e2e/flows/i18n.spec.ts` L15-26
  - `tests/e2e/critical-flows.spec.ts` L27-28
  - `tests/e2e/flows/submit.spec.ts` + `sse-submit.spec.ts` — add mobile variant blocks
- *Accept:* `pnpm playwright test --project=mobile-safari --project=mobile-se --project=mobile-pixel` executes with 0 skip; failing tests surface real mobile issues (which M1/M2 then triage).

**M1. Systematic mobile audit.** Playwright screenshots at three viewports — 375×667 (iPhone SE), 390×844 (iPhone 14), 412×915 (Pixel 7) — for every primary page: home, incidents list, incident detail, submit, /ai-act, /transparency, leaderboard, academy, blog, unsubscribe. For each page × viewport check: (a) horizontal overflow (`document.documentElement.scrollWidth > window.innerWidth`), (b) touch targets ≥44px on interactive elements, (c) text truncation/overlap, (d) z-index/overlay collisions (mobile nav, toasts, modals), (e) fixed elements covering content. Findings → `docs/MOBILE_AUDIT.md` as a table: page | viewport | issue | severity | screenshot ref. *Accept:* audit table covers all pages × 3 viewports; screenshots committed under `docs/mobile-audit/` (or linked from CI artifacts).

**🆕 M1 known risk hot-spots (v7.3 audit):** the following files entered the audit already flagged — Executor should confirm and grade severity:

- `src/components/incidents/incident-list.tsx` — **zero responsive prefixes**; table/card overflow expected on 375
- `src/app/[locale]/submit/page.tsx` — **zero page-level responsive utilities**; form layout risk
- `src/app/[locale]/incidents/page.tsx` — only 1 responsive utility hit; filters/cards to verify
- Admin table-view pages (`admin/api-keys`, `admin/queue`, `admin/innovations`, `admin/social`) — table overflow likely
- Cross-reference `docs/UI-UX-AUDIT.md` L81, L105, L181, L239 for previously logged mobile findings; treat as pre-populated audit rows

**M2. Fix everything M1 found.** One commit per page or per root cause (e.g. a shared component). Before/after screenshots in the report. No visual redesign — fix breakage only; brand rules apply. *Accept:* re-run of M1 audit shows horizontal overflow on 0 pages; all severity-high issues closed.

**M3. Mobile regression lock.** Add mobile-viewport variants of the critical-flow e2e specs (submit, incident detail, nav) + axe checks at 375px to CI. *Accept:* CI runs mobile specs; a deliberately introduced overflow fails CI (demonstrate, then revert).

**Final gate:** founder confirms on a real phone. Founder's word is the Accept.

---

## 🚨 V-SERIES — vercel.json Cron Fix (v7.3, MUST — Jul 9)

> `vercel.json` cron list currently registers only 3 jobs (aiaaic-import, aiid-import, fetch-external). Two production-critical crons exist in code but are unregistered — Vercel will never trigger them.

**V1. Register `process-deletions` cron.** File: `src/app/api/cron/process-deletions/route.ts` implements the 72h grace → soft-delete → 30-day hard-delete pipeline. **KVKK LEGAL obligation** — unregistered = production violation. Add to `vercel.json`:
```json
{ "path": "/api/cron/process-deletions", "schedule": "0 3 * * *" }
```

**V2. Register `generate-marketing` cron.** File: `src/app/api/cron/generate-marketing/route.ts` produces social queue drafts. Unregistered = queue frozen = launch narrative dies. Add:
```json
{ "path": "/api/cron/generate-marketing", "schedule": "0 9,15 * * *" }
```

**V3. Vercel tier check.** Hobby tier allows 2 cron jobs; after V1+V2 the project has 5. **Founder decision:** upgrade to Pro (~$20/mo) or leave a 3-cron subset on Hobby. Executor writes a proposal note in `docs/PROPOSALS/` with the trade-off; founder decides.

*Accept:* Vercel dashboard lists 5 cron jobs; each shows at least 1 successful execution in the last 24 hours; `process-deletions` writes an audit-log row per run.

**N1. Academy → top-level nav.** Move the Academy link out of the "Resources" dropdown to the main nav bar (`src/components/layout/nav.tsx:38`), alongside incidents/leaderboard/ai_act/transparency. Update `mobile-nav.tsx` ordering to match (Academy visible without expanding anything). Uses existing `nav.academy` key (EN "Academy" / TR "Akademi"). *Accept:* Academy visible in the top bar on desktop + mobile without any dropdown; nav e2e spec updated; bilingual.

**N2. Hardcoded strings → next-intl.** Fix the 8 known offenders: `src/app/[locale]/academy/expert-form.tsx` placeholders (lines ~61, 81, 100, 119, 169), `src/app/[locale]/blog/page.tsx:322` "No articles found", `title="Verified Respondent"` tooltips in `src/components/marketing/leaderboard-preview.tsx:81` and `src/app/[locale]/leaderboard/page.tsx:435`. *Accept:* grep for those literals returns 0 in src/; EN+TR keys added.

**N3. i18n CI guard (G3 pulled forward).** Script (`scripts/check-i18n.mjs`) comparing en.json/tr.json key sets; wire into CI so a missing key fails the build. *Accept:* CI fails on a deliberately removed key (demonstrate in report, then restore).

**N4. Incident content language (POST-LAUNCH, Architect decision pending).** The 406 imported incidents are English-only — Turkish pages show English content, which reads as "translation errors". Options: (a) batch-translate published incident summaries via Gemini (cheap model, cost-logged), or (b) show a small "EN" content badge on Turkish pages. Do NOT start without explicit Architect approval of the option.

---

## 📬 U-SERIES — /api/unsubscribe/ Endpoint (v7.3, MUST — Jul 12)

> Front page `src/app/[locale]/unsubscribe/page.tsx` exists but there is no API route for one-click token-based unsubscribe. Emails cannot legally ship without a working one-click link in the footer (CAN-SPAM/KVKK). Server-action flow requires form submission — insufficient for email link clicks.

**U1. Create `src/app/api/unsubscribe/route.ts`:**
- **Method:** GET (email link) + POST (front-page form parity).
- **Query param:** `?token={hmac_sha256(email + IP_SALT)}` — timing-safe token via `crypto.timingSafeEqual`.
- **Action:** update `email_preferences` set `reporter_notifications=false`, `weekly_digest=false`, `watches=false`, `unsubscribed_at=now()`.
- **Response:** GET → 302 redirect to `/{locale}/unsubscribe?ok=1`; POST → JSON `{ok: true}`.
- **Rate limit:** IP-based sliding window, 10 requests/day (share the existing Upstash helper).
- **Security:** `IP_SALT` env-required (no fallback); token invalid → 400 with generic message (do not leak whether email exists).
- *Accept:* real email → link click → 302 → success page; DB flags flipped; second click idempotent; PII-Guardian passes on log lines.

**U2. Wire the token into email templates.** `src/emails/templates.ts` — every user-facing template's footer must contain `<a href="{APP_URL}/api/unsubscribe?token={hmac}">Unsubscribe</a>`. Compute HMAC in the same helper that builds the email, never in the template body.

**U3. Playwright coverage.** Add e2e spec: seeded user → mock email link → GET → assert 302 + DB row flipped. *Accept:* spec fails if the token check is removed (demonstrate, then restore).

---

## 🧭 H-SERIES — "408 Incidents" Honesty Pass (v7.3, MUST — Jul 20)

> Launch copy (HN Show HN, PH page, TR press pitches, academic pack) claims **408 published / verified incidents**. `incidents` table content is dominated by seed migrations (`seed_massive_ai_ecosystem`, `seed_massive_2026_incidents`, `seed_turkish_and_famous_incidents`, `seed_midsize_labs`); the v7.1 traction correction acknowledged only 4 organic reports. Unqualified "408 verified" claims will not survive the first technical audit. Two-layer fix:

**H1. UI badge from `incident_source` column.** The `incidents.incident_source` enum already exists (`user_submitted | aiaaic_import | aiid_import | news_curated | court_record`). Render a badge on incident list rows + detail header:

- `user_submitted` → "Kullanıcı Raporu" / "User Report" — brand emerald `#00FF88`
- `aiaaic_import`, `aiid_import` → "İçe Aktarılmış: AIAAIC" / "AIID Import" — neutral gray
- `news_curated` → "Kürasyon: Haber" / "News Curation" — neutral gray
- `court_record` → "Mahkeme Kaydı" / "Court Record" — neutral gray

Emerald reserved for organic user reports only. Bilingual (next-intl). Small tooltip explains provenance.

**H2. Launch copy revision.** Executor drafts new EN + TR wording; **founder approves before any external send**:

- "408 published incidents" → "408 curated + user-reported cases across [AIAAIC, AIID, court records, first user reports]"
- The word "verified" reserved for `expert_verified=true` rows (F1 feature, not yet live) — remove from launch copy.
- TR: "408 doğrulanmış olay" → "408 küratörlü + kullanıcı raporu"
- HN Show HN, PH tagline, TR media pitches, academic one-pager, all Twitter/X threads.

**H3. Live-query claim guard.** Any component that renders a big number (e.g. `<StatBanner count={408}>`) must read from DB at build/request time — no hardcoded literals. Executor greps for `"408"` and `"400+"` and replaces with a helper that queries `SELECT count(*)` grouped by `incident_source`. *Accept:* zero hardcoded incident-count string in `src/`; landing banner reads live counts split by source.

---

## 🚀 P-SERIES — Pre-Launch T-25 → T-0 Campaign (v7.3, MUST — Jul 12 kickoff)

> Existing Twitter/X threads are all written for "live launch" day. The 25-day pre-launch attention window has no material. **Executor drafts everything; founder approves; founder sends** — Standing Rule #6 fully applies.

**P1. Countdown thread series (3 posts/week).** Under `docs/launch-assets/countdown/`:
- `T-25_neden_simdi.md` — "Why now: EU AI Act Art. 73 countdown starts today"
- `T-18_art73_neden_onemli.md` — "The one date every AI provider needs to know"
- `T-11_turk_orneklerimiz.md` — Turkish reporting case + KVKK bridge teaser
- `T-7_countdown.md` — "One week to Aug 2 — here's what launches"
- `T-3_final_push.md` — "72 hours: what you can do now"
- `T-0_live.md` — launch-day thread (already exists as `twitter_threads.md`; link + preserve)

Bilingual (EN + TR). Each draft ≤280 chars/tweet, 5–8 tweets per thread. No unverified statistics.

**P2. Teaser landing + waitlist.** Two options:
- (a) `/countdown` page — full landing with countdown timer, waitlist form, teaser copy.
- (b) Home-page banner "Aug 2'de Canlı" + inline waitlist form.

**Founder decision required** — Executor implements (b) as default (lower risk, faster) unless founder picks (a). Waitlist form writes to `email_preferences(email, marketing_opt_in=true, source='waitlist')`. Launch day: single early-access email to waitlist.

**P3. Turkish media pre-launch pitch (embargo Aug 2).** Under `docs/launch-assets/tr-press/`:
- `webrazzi_embargo_pitch.md` (exists — polish)
- `shiftdelete_embargo_pitch.md` (new)
- `technopat_embargo_pitch.md` (new)
- `donanimhaber_embargo_pitch.md` (new)

Send Jul 15; embargo lift Aug 2 at 09:00 TRT. **Executor drafts; founder sends** — never contact media directly.

**P4. LinkedIn + Reddit expansion.** LinkedIn: single founder thought-leadership post (Jul 20) tying AI accountability gap to Art. 73. Reddit: r/MachineLearning + r/artificial launch-day discussion posts (draft only; founder decides subreddit rules compliance).

*Accept:* all drafts in `docs/launch-assets/countdown/`, `docs/launch-assets/tr-press/`, `docs/launch-assets/linkedin/`, `docs/launch-assets/reddit/`; zero external sends performed by Executor; waitlist form live and collecting subscribers.

---

## ⏰ W-SERIES — Aug 2 Launch-Day Hour-by-Hour Timeline (v7.4, MUST — assets ready Aug 1)

> Founder must be able to operate the launch day alone. The Executor prepares a single-file playbook (`docs/RUNBOOK_LAUNCH_DAY.md`) that a non-technical person can follow line-by-line while the timer runs. Aug 2 is a Saturday — team-of-one operation is the design constraint.

**All times in Turkey Time (TRT, UTC+3). Convert to local as needed for co-workers.**

| Time (TRT) | Action | Owner | Success signal | Kill switch |
|------------|--------|-------|----------------|-------------|
| **Aug 1, 22:00** | Deploy freeze begins — no code merges to master until Aug 10 (Stage D window) | Executor | Last merge commit hash logged in RUNBOOK_LAUNCH_DAY.md | — |
| **Aug 2, 07:00** | Sanity: Sentry rules armed, cron jobs green (5 registered), health endpoint 200 | Founder | Screenshots into launch log | If red: postpone 24h |
| **Aug 2, 07:30** | Waitlist early-access email sent (single send from queue) | Founder approves; system sends | Resend log 200; open rate check at T+2h | — |
| **Aug 2, 08:00** | Turnstile spot-check on submit form | Founder | Test submit completes | Env flag `TURNSTILE_KILL_SWITCH=true` if broken |
| **Aug 2, 08:30** | Dashboard suite open (Vercel Analytics, Plausible live, Sentry, Supabase, Upstash) | Founder | Baseline snapshot at T-30m | — |
| **Aug 2, 09:00** | **HN "Show HN: ALPAR AI" post** (from `docs/launch-assets/hacker_news.md`) | Founder | HN URL logged; visitor spike expected T+15m | — |
| **Aug 2, 09:15** | **Product Hunt page goes live** | Founder | PH ranking screenshot every hour | — |
| **Aug 2, 09:30** | **TR press embargo lift** — send email to Webrazzi/Shiftdelete/Technopat/Donanım Haber | Founder | Sends logged with subject-line audit | — |
| **Aug 2, 10:00** | **X/Twitter EN launch thread** publish | Founder | Thread URL logged | — |
| **Aug 2, 10:15** | **X/Twitter TR launch thread** publish | Founder | Thread URL logged | — |
| **Aug 2, 11:00** | **LinkedIn founder post** (thought-leadership frame: EU AI Act Art. 73 countdown) | Founder | Post URL logged | — |
| **Aug 2, 12:00** | **Reddit posts** — r/MachineLearning + r/artificial (check subreddit self-promo rules first) | Founder | Post URLs logged; downvote rate check | Delete + retract if brigaded |
| **Aug 2, 13:00** | **T+4h dashboard check** — submission velocity, unique visitors, HN rank, PH rank, cross-audit throughput, Sentry error rate | Founder | Numbers into launch log; compare against pre-launch baseline (0) | If Sentry > 20 err/hr: pause new-submit CTA on landing |
| **Aug 2, 15:00** | **Mid-day response wave** — reply to HN comments (Executor drafts, founder approves+posts) | Founder + Executor | Comment thread active | — |
| **Aug 2, 18:00** | **T+9h checkpoint** — submission count, first organic report count, unique visitors, geo split (TR vs EN) | Founder | Numbers into launch log | If organic submissions = 0: escalate to founder-in-person outreach |
| **Aug 2, 21:00** | **EOD summary** — decide Day 2 amplification (second thread? community response? paid boost?) | Founder | Day 2 plan committed | — |
| **Aug 3, 09:00** | **T+24h retro** — one-page: what worked, what broke, what to change for the week | Founder | Retro in launch log | — |

**Pre-populated kill-switch env flags (must exist in Vercel env by Aug 1):**
- `AUTOPILOT_KILL_SWITCH=false` (flip true to halt cross-audit)
- `TURNSTILE_KILL_SWITCH=false` (flip true to bypass challenge on submit — emergency only, use with rate limit up)
- `SUBMIT_CTA_HIDDEN=false` (flip true to hide "Report an incident" CTA on landing if quality degrades)
- `RESEND_KILL_SWITCH=false` (flip true to halt all outbound email)

**Communication channel during launch:** single group chat (founder + Executor async via commit messages, since Executor cannot post external comms). If Executor is unavailable, founder follows RUNBOOK_LAUNCH_DAY.md line-by-line.

*Accept (Aug 1):* `docs/RUNBOOK_LAUNCH_DAY.md` exists with this table + copy-ready CTA links + kill-switch commands; all 4 env flags exist in Vercel with baseline `false`.

---

## ⚖️ X-SERIES — Legal & Crisis Playbook (v7.4, MUST — drafts by Jul 25)

> A public accountability platform attracts adversarial attention on day one. Silence is not a strategy. Executor pre-drafts **response templates + decision trees** so the founder can execute within the incident's news cycle (typically 6 hours), not a legal-review cycle (typically 6 days). All templates live under `docs/CRISIS_PLAYBOOK/` and are Architect-approved before launch.

**X1. Provider defamation claim / DMCA takedown notice.**

- **Trigger:** an AI provider (OpenAI, Anthropic, xAI, Google, TR provider) sends a legal letter demanding takedown of an incident record OR threatens defamation suit.
- **Immediate action (T+0 to T+24h):** do NOT take content down without legal review. Public response: acknowledge receipt, restate the incident is user-reported and links to public source(s), invite provider to file a **claimed profile response** (existing feature) instead.
- **Template file:** `docs/CRISIS_PLAYBOOK/X1-provider-legal-response.md` (EN + TR variants).
- **Decision tree:**
  - Is the incident sourced from a public, verifiable record (news article, court filing, X thread)? → refuse takedown, redirect to claim response.
  - Is the incident source unverifiable (single-user submission, no corroboration)? → move to `expert_review` queue; if not verified within 72h, retract publicly with note.
  - Is the DMCA claim a copyright hit (screenshot of AI output)? → check fair use posture; likely retain under research/journalism.
- **Attorney contact:** founder-provided; slot in RUNBOOK escalation ladder (v7.4 update).

**X2. False incident report / bad-faith submission.**

- **Trigger:** a submitted incident is factually wrong, defamatory toward a person, or a coordinated brigading attempt (e.g. multiple identical submissions from bot network).
- **Immediate action:** move to `expert_review` if not caught by pre-triage; unpublish (soft-delete) within 24h if evidence of bad faith; issue retraction note on the incident URL (public transparency about the correction).
- **Template file:** `docs/CRISIS_PLAYBOOK/X2-false-report-retraction.md` — retraction copy + email to reporter explaining the decision.
- **Standing Rule cross-link:** #19 (numeric-claim honesty) applies to retractions too — the transparency page must show the retraction count.

**X3. Media misinformation campaign about ALPAR.**

- **Trigger:** a news outlet, influencer, or coordinated social campaign accuses ALPAR of bias, methodology fraud, or political affiliation.
- **Decision gate:** does the outlet have >10k TR or >100k global reach? If **no**, follow silence-and-monitor protocol (do not amplify by responding). If **yes**, publish a public methodology defense within 24h.
- **Template file:** `docs/CRISIS_PLAYBOOK/X3-methodology-defense.md` — one-pager linking to `docs/EU_AI_ACT_TAXONOMY.md`, TruthScore methodology, and the AGPL open-source repo (post-launch curated public repo).
- **Never:** attack the accuser personally, block critics on X, or issue a legal threat as first response. Substance-only defense.

**X4. On-platform harassment / doxxing incident.**

- **Trigger:** a reporter's profile is doxxed (real identity revealed against their will), or an incident record contains PII that a subject requests removed.
- **Immediate action:** honor removal within 24h under KVKK Art. 11 (data subject right to erasure); PII Guardian handles the sanitization automatically for new writes, but historical records may need manual scrubbing.
- **Template file:** `docs/CRISIS_PLAYBOOK/X4-pii-erasure.md` — user-facing explanation + internal checklist for admin PII removal + audit trail requirement.

**X5. Regulatory inquiry (KVKK / EU DSA / provider regulator).**

- **Trigger:** written request from KVKK (Türkiye), EU DSA authority, or a provider's home regulator.
- **Response window:** 30 days (KVKK) or per the request's own deadline (whichever is shorter).
- **Immediate action:** acknowledge receipt within 3 business days; assemble the requested data pack (audit logs, PII processing records, methodology documentation) into `docs/CRISIS_PLAYBOOK/X5-regulator-response-pack/` — pre-templated file structure so the founder can populate one folder per inquiry.
- **Template file:** `docs/CRISIS_PLAYBOOK/X5-regulator-response.md` + `docs/CRISIS_PLAYBOOK/X5-inquiry-log.md` (running log of every inquiry received).

**X-series Accept:** all five template files exist under `docs/CRISIS_PLAYBOOK/` by Jul 25; RUNBOOK's escalation ladder includes attorney contact + PR contact + KVKK compliance contact; Executor never sends a public response — always founder.

---

## 📊 Y-SERIES — Post-Launch T+0 → T+30 Growth Signal Kit (v7.4, MUST — Y1 ready Aug 2, Y2/Y3 automated)

> The v6 pacing rule bars idle Executors. The Executor's post-launch work is **reading signals fast enough to know what to build next.** Y-series formalizes the read: what to measure, when to declare it, and what triggers a pivot.

**Y1. Day-0/Day-1 signal panel — `/admin/launch-signal` (Executor ships by Aug 1).**

Single admin page updating live during the launch window:
- Submission velocity (submissions/hour, last 24h) — organic vs. auto-import split via `incident_source`
- Unique visitor count (Plausible)
- Traffic source split (Direct / X / HN / PH / TR press / Reddit / LinkedIn)
- Cross-audit throughput and latency P50/P95
- Sentry error rate (errors/hour)
- HN post rank (scraped or manual entry)
- PH ranking (manual entry)

*Accept:* renders at 10s auto-refresh; admin-only RLS; bilingual; safe if a data source (Plausible, HN) is unreachable.

**Y2. Day-7 kill-metric readout — automated Slack/email report (Aug 9).**

Sunday 20:00 TRT, a cron sends the founder a single-page readout:
- Total organic reports in the first week
- **Kill-metric check:** if organic reports < 10 in first 7 days → escalation flag in the report (not automatic pivot — founder decides)
- Registered users, D3 return rate, D7 return rate
- Which traffic source produced actual submissions (not just visitors)
- Top 3 organic incidents by TruthScore
- Cost report: cross-audit spend, pre-triage skip rate

*Accept:* email arrives Aug 9 20:00 TRT with real numbers; a test-mode dry-run works on Aug 1.

**Y3. Day-30 pivot-check readout — Sept 1 (automated).**

Same layout as Y2 but with the 30-day denominator, plus:
- Weekly organic-reports trend (line chart, 4 weeks)
- **Sept 15 kill-metric anchor:** if weekly organic reports < 10 by Sept 15 → founder+Architect strategy session, per the existing kill-criteria clause. Y3 report is the raw input to that session.
- API tier signup count (Free / Developer / Enterprise) — Stage C validation
- Expert interest count (Academy expert-form submissions)
- Media coverage inventory (URL list with reach estimate)

*Accept:* Sept 1 automated email; format matches Y2; historical Y2 numbers included as comparison.

**Y-series design principle:** the Executor does not interpret the data — the Executor delivers a stable, honest report cadence. The **Architect interprets**, the **founder decides**. Numbers speak; nobody spins them.

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
11. **Haftalık DB snapshot.** Her Pazartesi `supabase db dump` (PII-masked) çıktısını güvenli depolamaya kaydet. FREE tier inaktivite kontrolü: Supabase dashboard'a en az ayda 1 login. Önceki `alparai-db` kaybı tekrarlanmamalı. **v7.3 ek:** Weekly snapshot report'una `process-deletions` cron'un son 7 gün çalıştırma kanıtı (log satırları) eklenir; KVKK yükümlülüğünün fiilen işlediği doğrulanır.
12. **Her migration dosyası rollback yorumu içerir.** Dosyanın sonunda `-- ROLLBACK:` yorum bloğu olarak geri alma SQL'i yer alır.
13. **"User-zero" test.** Every user-facing feature must be manually tested as a first-time anonymous visitor on production before marking Accept. If you can't explain the value to a non-technical person in one sentence, simplify.
14. 🆕 **Plan documents are read-only for the Executor.** Only the Architect edits `docs/ANTIGRAVITY_EXECUTION_PLAN.md`, `docs/MASTER_PLAN_2026H2.md`, `docs/UPDATE_PLAN_2026Q3.md`. Executor may append proposals to `docs/PROPOSALS/`.
15. 🆕 **Single-branch workflow.** Work directly on `master` with small, reviewable commits. No feature branches, no PRs on plan docs. Emergency hotfix branches must be deleted within 24h of merge.
16. 🆕 **Stage completion requires an Architect approval line** in the report block: `Architect-Approval: <commit-hash> <YYYY-MM-DD>`. Executor may not self-mark a stage complete.
17. 🆕 **v7.3 — SHA-256 credential authentication.** Every externally-reachable API endpoint authenticates credentials by hashed comparison (`digest(input, 'sha256') === stored_sha256`), never plain-text equality. Plain-text credential comparison (`api_key === stored`) fails code review automatically. Constant-time comparison via `crypto.timingSafeEqual` remains required on top of the hash check.
18. 🆕 **v7.3 — Code-reality reconciliation before implementation.** Before starting any stage the Executor greps the codebase against the plan (`docs/API.md`, migration schemas, existing routes, `vercel.json` cron list). Any mismatch → write a proposal note (`docs/PROPOSALS/`), do not write code. This rule was created because v7.3 audit found B1/B5/C5 already shipped, C1 schema unsafe, and 2 crons unregistered — all missed by prior plans.
19. 🆕 **v7.3 — Numeric-claim honesty.** Any user-facing numeric claim in the app or launch copy (`N incidents`, `N users`, `N providers`) must query the database live and split by source (`incident_source`, `verified_by`, etc.). The word "verified" is reserved for `expert_verified = true` rows only until F1 (expert-review queue) is live. Hardcoded landing-page numbers are a review-fail.
20. 🆕 **v7.4 — Daily cost-budget alarm & monthly ceiling.** Executor ships a `weekly_cost_summary` cron (or extends the existing weekly summary) that sums `cross-audit spend + Vercel + Supabase + Upstash + Resend + OpenRouter + Vertex` per day and per month. Thresholds:
    - **Daily > $50 USD** → Sentry warning + admin banner "cost trending high, review last 24h submissions"
    - **Daily > $100 USD** → automatic pre-triage tightening (raise min description-word threshold from 15 → 25 for 24h) + founder email
    - **Monthly ceiling $500 USD** — when reached, cross-audit throttles to expert-review queue only until month roll-over; founder email + admin banner
    - Kill switch `COST_KILL_SWITCH=true` env flag halts new cross-audit calls immediately
    Rationale: launch traffic 10× organic could 10× spend overnight. A budget alarm is cheaper than a bankrupt Series A pitch.

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

## STAGE C — API Productization (REWRITTEN in v7.3; hard deadline: Aug 15)

> **v6 ecosystem note:** the Commission has published **draft guidance + a reporting template for Art. 73 serious incidents** (digital-strategy.ec.europa.eu, stakeholder consultation open). C2's API docs and the future Reporting Assistant (2027 Q3) must target that official template's field structure. Differentiation to state in docs: OneTrust/Prediction Guard sell compliance tooling to providers; ALPAR is the **independent public registry** — referee, not vendor.
>
> **v7.3 reality check (from 360° audit):**
> - **C1** — current `api_keys` schema is plain-text (no sha256, no tier, no client_type). **Launch-blocking security migration.** Split into C1a (hardening, MUST) + C1b (enterprise onboarding, SHOULD).
> - **C2** — `docs/API.md` L3 claims "No REST endpoints are exposed" while 6 v1 endpoints are live. Wrong doc = bad first impression. Fix urgently.
> - **C3** — usage metering is at 0%. Push to post-freeze.
> - **C4** — `src/lib/utils/rate-limit.ts` uses per-minute IP-based limits (5/30/100); the plan says per-day key-based (100/1000/10000). Must reconcile. Push to post-freeze.
> - **C5** — embed + OG image + share buttons **already shipped** (`src/app/[locale]/incidents/[id]/embed/page.tsx`, `opengraph-image.tsx`, `src/components/incidents/share-buttons.tsx`). Verification-only.

**C1a. API key hardening migration (MUST — Jul 15).** New migration `supabase/migrations/20260715000000_api_keys_hardening.sql`:

- Add columns to `api_keys`:
  - `key_sha256 TEXT UNIQUE` — sha256 hex of the raw key
  - `tier TEXT CHECK (tier IN ('free','developer','enterprise'))`
  - `client_type TEXT CHECK (client_type IN ('llm_provider','client'))`
  - `label TEXT` — human-readable identifier
  - `last_used_at timestamptz`
  - `revoked_at timestamptz`
  - `plain_api_key_deprecated_at timestamptz` — flag for future drop
- Data step: `UPDATE api_keys SET key_sha256 = encode(digest(api_key,'sha256'),'hex')` for existing rows; parse `provider` string ("client_free" etc.) into `tier` + `client_type` where possible.
- RLS: admin/ceo only (`is_ceo()` OR `is_admin()`); no anon access.
- Rollback comment per Standing Rule #12.
- **Follow-up (Aug 10+, separate migration):** DROP plain-text `api_key` column once auth path fully switched.
- **Auth path change:** `src/app/api/v1/*/route.ts` — replace `key === row.api_key` with sha256 hash compare + `timingSafeEqual` guard. Add `last_used_at = now()` on successful match.
- **Admin UI update:** `src/app/[locale]/admin/api-keys/page.tsx` renders tier, label, `last_used_at`, revoke button; "reveal key once at creation" pattern (key shown one time, sha256 stored).

*Accept:* two test enterprise keys hold distinct sha256 hashes; a revoked key returns 401; unit test proves plain-text comparison path is dead code; `pnpm typecheck` + `pnpm test` green.

**C1b. Enterprise onboarding (SHOULD — Aug 15).** Two real enterprise customers each hold their own key + revoke test. Complements C1a's schema readiness.

**C2. API documentation fix (MUST — Jul 20).**
- **`docs/API.md` L3** — delete the "No REST endpoints are exposed to external consumers" line **first**. This is misinformation and any external reader trusts it.
- Add a **REST v1** section documenting the actually-live endpoints:
  - `GET /api/v1/incidents` — filters: `category`, `severity`, `eu_risk`, `provider`, `model`, `verification_level`, `since`, `limit`, `offset`
  - `GET /api/v1/incidents/[id]`
  - `GET /api/v1/providers`
  - `GET /api/v1/providers/[id]/stats`
  - `GET /api/v1/leaderboard`
  - `POST /api/v1/extract` — pre-triage extraction, tier-gated
- Include tier limits (link to C4 once live), `verification_level` semantics, curl examples per endpoint.
- Regenerate sample dataset into gitignored `exports/` (JSON + CSV).

*Accept:* every documented curl runs against prod and returns 200; "No REST endpoints" string is removed from the entire repo (grep-verified).

**C3. Usage metering (Aug 10, post-freeze).** Upstash sliding-window keyed by `metering:{key_sha256}:{yyyy-mm-dd}` → `INCR + EXPIRE`. Admin UI: per-key 24h/7d/30d request counts. Optional: aggregate `api_usage_daily` view for reporting. *Accept:* counts visible in admin and correct after test calls.

**C4. Tier-based rate limiting rewrite (Aug 10, post-freeze).**
- **Current gap:** `src/lib/utils/rate-limit.ts` enforces per-minute IP-based limits; the plan requires per-day key-based limits with a per-minute burst ceiling.
- **Founder decision required — recommended hybrid model:**
  - Free: 100/day + 5/min burst
  - Developer: 1,000/day + 30/min burst
  - Enterprise: 10,000/day + 100/min burst
- Migrate rate-limit key from `${bucket}:${ip}` to `${bucket}:${key_sha256}` (falls back to IP only when no key present).
- Return 429 + `Retry-After` header from both the daily and burst limiters.
- *Accept:* 101st request from a free key inside 24h → 429 with correct `Retry-After`; the same key with 1s intervals hits the burst limit at 6/min; unit tests cover both limiters.

**C5. Embed widget & viral kit — ✅ ALREADY SHIPPED (v7.3 audit). Verification-only:**
- `src/app/[locale]/incidents/[id]/embed/page.tsx` — copyable iframe/script variant, "Powered by ALPAR AI" footer link back to full incident.
- `src/app/[locale]/incidents/[id]/opengraph-image.tsx` — dynamic OG image (title + TruthScore + severity badge).
- `src/components/incidents/share-buttons.tsx` — X / LinkedIn / Copy Link.
- **Remaining verification work (SHOULD, ~1 hour):**
  1. Add a discovery link from the admin incident detail row → embed page.
  2. Facebook + Twitter card validators against 3 live incident URLs; screenshots into `docs/PROPOSALS/C5-verification.md`.
  3. External embed test — founder embeds one incident on any third-party HTML page; screenshot for the record.
- *Accept:* validator reports + external embed screenshot exist; discovery link added.

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

**D-extra2. 🆕 Academic outreach pack** (Executor drafts; FOUNDER sends — Executor never contacts anyone): EN outreach email + 1-page PDF/markdown one-pager for university AI-governance groups. Target list: Harvard Berkman Klein Center, MIT Media Lab / AI governance, Stanford HAI, Oxford Internet Institute + the Academy page's existing "Target/Invited" tiers. Pitch: research access to the incident corpus (F2 portal), co-authorship on the Q4 "State of AI Incidents" report. Do NOT cite any specific survey/statistic unless the founder supplies a verified source. Files under `docs/launch-assets/academic/`. *Accept:* drafts exist, bilingual cover note for founder, zero external sends.

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

## 💡 I-SERIES — Innovation Pool (added in v7; PROPOSAL STATUS ONLY)

> Sourced from the July 2026 ecosystem scan. **None of these are approved for implementation.** Each graduates into a stage only with an explicit Architect approval line. The Executor may write feasibility notes in `docs/PROPOSALS/` but writes no code for them.

| ID | Idea | Why now | Moat effect |
|----|------|---------|-------------|
| I1 | **Incident Passport** — one-click export of an ALPAR incident in the Commission's official Art. 73 reporting-template field structure | Commission's draft template is public now; being format-compatible first = becoming the default drafting tool | Every exported passport carries ALPAR provenance |
| I2 | **ALPAR MCP server / LLM tool** — expose the incident API as a tool AI agents can query ("has this model had incidents?") | Agent ecosystems are exploding; agents citing ALPAR = zero-CAC distribution | Becomes infrastructure, not a website |
| I3 | **Provider Response SLA badge** — free, embeddable "responds within X days" badge for providers with claimed profiles | Free giveaway that makes providers advertise ALPAR themselves | Two-sided lock-in |
| I4 | **Insurance/actuarial data feed** — anonymized incident frequency/severity by category for AI-liability underwriters | AI liability insurance is emerging with no loss-history data anywhere | First loss-history dataset in the category |
| I5 | **Browser extension** — one-click "report this AI output" capturing URL + screenshot into the submit flow | Cuts submission friction to near zero | Volume growth engine |
| I6 | **Model drift watch** — track provider model-card/version changes, correlate with incident spikes | Providers ship silent updates; nobody correlates them with failures | Unique longitudinal dataset |
| I7 | **Research sandbox** — hosted notebooks over the PII-masked corpus for approved academics (extends F2) | Deepens university partnerships beyond CSV export | Academic citations = credibility flywheel |
| I8 | **KVKK bridge** — TR-localized incident notification formatting for Turkish public institutions | ALPAR's TR identity is a wedge no US competitor has | Home-market regulatory moat |

### 🌱 I-SERIES → Admin Panel Görünürlüğü (Antigravity görevi — M-series biter bitmez yap)

`strategy_innovations` tablosu ve `/admin/innovations` sayfası MEVCUT (`20260702000200_innovations.sql`; RLS: ceo/admin only). Yalnızca seed gerekiyor.

**Dosya:** `supabase/migrations/20260709000001_seed_i_series_innovations.sql`

Her satır ayrı `INSERT … WHERE NOT EXISTS` ile idempotent eklenir (title başına göre `LIKE 'IX —%'`).

| title | description (TR) | priority | status |
|-------|-----------------|----------|--------|
| I1 — Incident Passport (Art. 73 resmi şablon çıktısı) | ALPAR kayıtlarını Komisyon'un resmi Art. 73 bildiri şablonu alanlarına tek tıkla dönüştürür. Taslak şablon kamuya açık; format uyumlu ilk platform olmak varsayılan hazırlık aracı olma fırsatı. Her dışa aktarılan pasaport ALPAR kökenini taşır. | high | idea |
| I2 — ALPAR MCP Server / LLM Aracı | Olay API'sini yapay zeka ajanlarının sorgulayabileceği bir araç olarak sunar. Ajan ekosistemi büyüyor; ALPAR'ı kullanan ajanlar sıfır CAC dağıtım kanalı. Platform altyapıya dönüşür. | high | idea |
| I3 — Sağlayıcı Yanıt SLA Rozeti | Talep edilmiş profilli sağlayıcılar için gömülebilir ücretsiz "X gün içinde yanıtlar" rozeti. Sağlayıcılar ALPAR'ı kendileri reklam eder. İki taraflı kilit. | medium | idea |
| I4 — Sigorta/Aktüeryal Veri Akışı | AI sorumluluk sigortacıları için kategori bazlı anonim olay sıklık/ağırlık verileri. Pazar büyüyor, zarar geçmişi yok. Kategoride ilk zarar verisi. | low | idea |
| I5 — Tarayıcı Eklentisi | URL + ekran görüntüsü yakalayarak submit akışına tek tıkla raporlama. Raporlama yükünü sıfıra yakın düşürür. Hacim büyüme motoru. | low | idea |
| I6 — Model Sürüklenme İzleme | Sağlayıcı model kartı/sürüm değişikliklerini izler, olay artışlarıyla ilişkilendirir. Sessiz güncellemeler yaygın; kimse başarısızlıklarla ilişkilendirmiyor. Benzersiz uzunlamasına veri. | low | idea |
| I7 — Araştırma Sanal Ortamı | PII maskelenmiş veri seti üzerinde onaylı akademisyenler için barındırılan not defterleri (F2 genişletmesi). Akademik alıntılar güvenilirlik vlanı oluşturur. | low | idea |
| I8 — KVKK Köprüsü | Türk kamu kurumları için KVKK uyumlu yerelleştirilmiş olay bildirim biçimlendirmesi. ALPAR'ın TR kimliği hiçbir ABD rakibinin sahip olmadığı kama. Yerel pazar düzenleyici hendeği. | medium | idea |

**Dosya sonu zorunlu yorum (Standing Rule #12):**
```sql
-- ROLLBACK: DELETE FROM public.strategy_innovations WHERE title ~ '^I[1-8] —';
```

**Accept kriterleri:**
- `/admin/innovations` sayfasında tam 8 I-serisi kaydı görünür
- Anon kullanıcı bu kayıtları görmez (RLS korumalı)
- Migration dosyası rollback yorumu içerir
- Doğrulama sorgusu: `SELECT title, priority, status FROM public.strategy_innovations WHERE title LIKE 'I% —%' ORDER BY title;`

---

## 🗓️ 2027 HORIZON (long-term roadmap — Architect refines each quarter into stages)

> **The strategic anchor: 2 Dec 2027.** On that day, Art. 73 serious-incident reporting becomes mandatory for high-risk AI systems in the EU. Providers will need incident data, taxonomy mapping, and reporting workflows — overnight. ALPAR's entire 2027 is a countdown to owning that moment: the platform that spent two years cataloguing AI incidents becomes the obvious reference when reporting them becomes law.

### Q4 2026 — Prove the Engine (Oct–Dec)
- **First paying API customer** (C1–C4 live; target: 1 signed, 3 in pipeline)
- **1,000 published incidents** (import pipeline + organic; taxonomy coverage ≥80%)
- **"State of AI Incidents 2026" report** (F3) — the credibility artifact for press, academics, and investors
- **Expert network:** ≥5 active experts with real verification actions (F1)
- *North-star:* Weekly active reporters ≥30; first revenue booked.
- *Kill/pivot check (Dec 31):* if organic submissions <10/week despite launch + growth loops, pivot primary motion from community-sourced to curated-editorial + API-first.

### Q1 2027 — Revenue Engine (Jan–Mar)
- **Compliance Readiness Dashboard** (new product surface): providers see their incident exposure mapped to Art. 73 classes, gap analysis, response-rate benchmark vs. peers. Free tier read-only; paid tier = alerts + API + white-label reports.
- **API v2:** webhook subscriptions (new incident matching filters), bulk export, SLA tiers
- **Pricing goes live** (founder sets amounts; Executor builds Stripe integration + billing portal)
- **TR + EU regulatory content engine:** weekly "readiness gap" analyses auto-drafted into approval queue
- *North-star:* MRR > €1k; ≥3 provider profiles claimed by the companies themselves.

### Q2 2027 — The Authority Position (Apr–Jun)
- **Academic partnership formalized:** ≥1 university MOU (founder-led; Executor builds the research portal capacity F2 needs)
- **Methodology audit:** external academic review of TruthScore published — closes the "methodology attack" risk permanently
- **"180 days to Art. 73" campaign** (Jun 5): repeat of the Aug 2026 countdown playbook, aimed at compliance officers, not tech twitter
- **SOC 2 Type I readiness** (if enterprise pipeline demands it — founder decision gate)
- *North-star:* 3 enterprise pilots; ALPAR cited in ≥2 external publications (press or academic).

### Q3 2027 — Scale the Rail (Jul–Sep)
- **Regulatory Reporting Assistant:** guided Art. 73 report drafting from an ALPAR incident record (export to the format regulators accept). This is the wedge product for Dec 2.
- **10,000-incident corpus** goal via connector expansion (only sources with clean licensing)
- **Multi-language expansion decision gate:** DE/FR if EU enterprise demand is real (founder decides on data, not ambition)
- *North-star:* MRR > €5k; ≥1 provider using the Reporting Assistant in anger.

### Q4 2027 — The Moment (Oct–Dec)
- **Nov:** "30 days to Art. 73" full-court press: report, webinars (founder), press kit v2
- **Dec 2:** Art. 73 goes live. ALPAR ships the **live obligation tracker**: which providers are reporting, which aren't. The accountability gap closes — and ALPAR is the scoreboard.
- **Series A window opens:** dataroom auto-assembled from what already exists (metrics dashboards, cost reports, cohort data — E7/G4 outputs are the dataroom)
- *North-star:* the Dec 2 news cycle cites ALPAR; MRR > €10k or a signed enterprise contract that implies it.

### Long-term operating principles
1. **Quarterly re-planning:** each quarter's detail is written by the Architect in the last 2 weeks of the prior quarter; this section is direction, not spec. The Executor never self-derives tasks from the Horizon.
2. **Revenue tasks outrank feature tasks from Jan 2027.** The 2026 rule was "does it bring users?"; the 2027 rule is "does it bring or protect revenue?"
3. **The regulatory calendar is the marketing calendar.** Every EU AI Act milestone (guidance publications, delegated acts, the Dec 2 go-live) gets a countdown campaign through the same approval queue.
4. **Kill criteria stay live:** any quarter missing both its north-stars triggers a founder+Architect strategy session before new feature work is approved.

---

## 🆕 v7.3 ANTIGRAVITY WORK QUEUE (sequential; each item = separate commit + `Architect-Approval:` wait)

The Executor works this list top-to-bottom. Every item = its own commit, pushed before reporting, awaiting an Architect approval line before the next item starts.

| # | Item | Priority | Est. | Blocks |
|---|------|----------|------|--------|
| 1 | V1+V2 — `vercel.json` cron register (`process-deletions`, `generate-marketing`) | MUST | 15 min | KVKK, launch narrative |
| 2 | U1+U2+U3 — `/api/unsubscribe/route.ts` + HMAC token + email template wire + e2e | MUST | 2 h | CAN-SPAM/KVKK legality |
| 3 | M0 — Playwright config (iPhone SE, Pixel 7) + skip() cleanup | MUST | 2–3 h | M1 audit reliability |
| 4 | M1 — Mobile audit → `docs/MOBILE_AUDIT.md` | MUST | 1 d | M2 fixes |
| 5 | M2 — Fix all M1 findings (per-page or per-shared-component commits) | MUST | 3–5 d | Launch mobile UX |
| 6 | M3 — Mobile CI regression lock (specs + axe at 375) | MUST | 1 d | Long-term mobile quality |
| 7 | C1a — `20260715000000_api_keys_hardening.sql` + auth path + admin UI | MUST | 1 d | API security |
| 8 | I-series seed — `20260715000001_seed_i_series_innovations.sql` (per v7.2 spec) | MUST | 30 min | Innovation visibility |
| 9 | C2 — `docs/API.md` REST v1 section + "No REST endpoints" line removal | MUST | 3 h | Doc credibility |
| 10 | H1+H2+H3 — `incident_source` badge component + launch copy revision drafts + hardcoded-count grep-fix | MUST | 4–6 h | Honesty pass |
| 11 | P1 — Countdown thread drafts (T-25/T-18/T-11/T-7/T-3/T-0) under `docs/launch-assets/countdown/` | MUST | 4 h | Pre-launch traction |
| 12 | P2 — Waitlist form (home-page banner variant) → `email_preferences` | MUST | 3 h | Waitlist collection |
| 13 | C5 — Admin discovery link + OG validator report + external-embed screenshot | SHOULD | 1 h | Embed proof |
| 14 | P3 — TR press embargo pitches (Shiftdelete/Technopat/Donanım Haber drafts) | SHOULD | 4 h | TR media coverage |
| 15 | P4 — LinkedIn + Reddit drafts | SHOULD | 3 h | Launch-week amplification |
| 16 | D-extra assets completion (LinkedIn, Reddit, PH screenshots) | SHOULD | 1 d | Launch-day amplification |
| 17 | RUNBOOK_LAUNCH.md v1.1 — Turnstile / Resend / SSE kill-switches + T-25→T-0 checklist | MUST | 3 h | Founder solo-op capability |
| 18 | C1b — Two enterprise onboarding keys + revoke test | SHOULD | 2 h | Enterprise readiness |
| **19** | **🆕 v7.4 W-series — `docs/RUNBOOK_LAUNCH_DAY.md` (hour-by-hour Aug 2 timeline + 4 kill-switch env flags added to Vercel)** | **MUST** | **4 h** | **Founder launch-day solo op** |
| **20** | **🆕 v7.4 X-series — 5 crisis playbook templates under `docs/CRISIS_PLAYBOOK/` (X1 provider legal, X2 false report, X3 media, X4 PII erasure, X5 regulatory)** | **MUST** | **1 d** | **Legal/PR incident readiness** |
| **21** | **🆕 v7.4 M2-home — fix home-page horizontal overflow (`div.bg-brand-600/8`, `div.bg-warning-500/15`, `div.flex`; likely one shared component)** | **MUST** | **2 h** | **Landing page HIGH-severity mobile** |
| **22** | **🆕 v7.4 Y1 — `/admin/launch-signal` page (submission velocity, traffic split, HN/PH rank, Sentry, cross-audit throughput)** | **MUST** | **4 h** | **Launch-day signal reading** |
| **23** | **🆕 v7.4 Y2 + Y3 — day-7 and day-30 automated readouts (cron + email template)** | **MUST** | **3 h** | **Automated pivot-check input** |
| **24** | **🆕 v7.4 Standing Rule #20 — daily cost-budget alarm cron + monthly ceiling + `COST_KILL_SWITCH` env** | **MUST** | **3 h** | **Prevent budget blow-up under launch traffic** |
| 25 | M2-touch (post-launch, SHOULD) — sweep 44px touch-target findings on 9 non-home pages | SHOULD | 1–2 d | Mobile ergonomics polish |

**Post-launch (Aug 10+) items** — do NOT start before Aug 10:
- C3 — Usage metering
- C4 — Tier-based rate limiting rewrite (hybrid daily + burst)
- B2b — Expert-verification email + weekly reporter digest
- N4 — Incident content language decision (Architect approval pending)
- Plain-text `api_key` column drop (follow-up migration to C1a)

---

## 🆕 v7.3 FOUNDER DECISION POINTS

The following require founder input before or during the sequence above. Executor writes proposals to `docs/PROPOSALS/` and waits.

1. **R1 repo → private timing.** The GitHub MCP does not expose a `update_repository` visibility tool. Founder must click through repo Settings → Danger Zone → Change visibility → Private. When? *Recommended: within 24h.*
2. **C4 rate-limit model.** Hybrid (daily tavan + per-minute burst) vs. daily-only. *Recommended: hybrid.*
3. **"408 incidents" copy dili.** "408 curated + user-reported" vs. "400+ documented" vs. something sharper. Founder picks the phrasing for HN/PH/TR/academic before H2 drafts finalize.
4. **Vercel tier.** Hobby (2-cron cap = insufficient after V1+V2) or Pro (~$20/mo). *Recommended: Pro; Executor writes a cost-benefit proposal.*
5. **P2 waitlist location.** Home-page banner (recommended) vs. dedicated `/countdown` page.
6. **B2b scheduling.** Push weekly-digest / expert-verification emails to Aug 10+ freeze exit? *Recommended: yes — M-series + C-series already saturate pre-launch.*
7. **N4 imported-incident language.** (a) Gemini batch-translation of summaries, (b) small "EN" badge on Turkish pages. Executor drafts feasibility notes for both; founder picks.
8. **🆕 v7.4 — Attorney + PR contact for X-series.** X1/X3/X5 escalation ladder needs a named lawyer (TR + EU), a PR contact (TR + EN), and a KVKK compliance advisor. Founder provides names + phones + emails; Executor slots into RUNBOOK.
9. **🆕 v7.4 — Cost-budget ceiling values.** Standing Rule #20 uses $50/day warn, $100/day auto-tighten, $500/month ceiling. Founder confirms or adjusts before Rule #20 cron ships.
10. **🆕 v7.4 — X3 media-response reach threshold.** Public defense triggered at "outlet >10k TR or >100k global". Founder confirms these thresholds or supplies preferred numbers.
11. **🆕 v7.4 — Day-2 amplification budget.** If Day-1 numbers are strong, does the founder authorize a paid amplification budget (X ads, LinkedIn boost) and if yes, cap it. If numbers are weak, does the founder want an emergency Day-2 outreach list (contacts to warm up)?

Every decision resolves in `docs/PROPOSALS/NNN-title.md` first — Executor never assumes.

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

All stages A–H accepted; launch executed Aug 2 with zero P0; ≥1 paying customer flow technically ready (C1–C4); embed widget live with measurable external embeds (C5); **≥100 organic signups tracked in growth dashboard (E7);** expert portal live with ≥1 real expert action; monthly cost + coverage reports automated. Then execution moves to the 2027 Horizon above — the Architect writes each quarter's stage spec in the final 2 weeks of the prior quarter.

---

## CHANGELOG (v7.3 → v7.4) — Professional Planning Gaps Closed

| Change | Rationale |
|--------|-----------|
| **🆕 W-series added** — Aug 2 hour-by-hour launch-day timeline in `docs/RUNBOOK_LAUNCH_DAY.md` (16 timeline rows + 4 pre-populated kill-switch env flags) | Launch-day is Saturday; founder operates alone; line-by-line playbook is the design constraint |
| **🆕 X-series added** — 5 crisis playbook templates (provider legal, false report, media misinformation, PII erasure, regulatory inquiry) under `docs/CRISIS_PLAYBOOK/` | Public accountability platform draws adversarial attention on day one; silence is not a strategy; response window is news cycle (6h), not legal cycle (6d) |
| **🆕 Y-series added** — T+0 signal panel + T+7 kill-metric readout + T+30 pivot-check readout | Executor's post-launch job is signal cadence, not interpretation; Sept 15 kill-metric anchor needs raw input |
| **🆕 Standing Rule #20** — daily cost-budget alarm ($50 warn / $100 auto-tighten / $500 monthly ceiling) + `COST_KILL_SWITCH` env | Launch traffic 10× = spend 10×; cheaper alarm than Series A pitched with $2k COGS/mo |
| **M1 audit result processed** (`bb1fcca`) — home page is the only HIGH-severity finding (3-element shared-component overflow); every other page is LOW touch-target ergonomics | Antigravity front-ran M1; plan now differentiates M2-home (MUST, launch-blocker) from M2-touch (SHOULD, post-launch) |
| **Work queue extended to 25 items** (adds M2-home, W-series RUNBOOK, X-series templates, Y1/Y2/Y3 pages+crons, Rule #20 cron) | Single execution sheet stays authoritative |

## CHANGELOG (v7.2 → v7.3) — 360° Code-Reality Audit

| Change | Rationale |
|--------|-----------|
| **Stage C fully rewritten** (C1 → C1a hardening + C1b onboarding; C5 marked shipped; C3/C4 pushed to post-freeze) | 360° audit exposed plan-vs-code drift: C5 already live, C1 plain-text (security), C4 config disagrees with plan values |
| **C1a MUST-listed for Jul 15** | Plain-text credential storage in `api_keys` — launch-blocking security gap |
| **🆕 V-series MUST added for Jul 9** — `vercel.json` cron register | `process-deletions` KVKK LEGAL, `generate-marketing` narrative — both silently non-functional in prod |
| **🆕 U-series MUST added for Jul 12** — `/api/unsubscribe/` endpoint | Front page exists but no API route; email link clicks legally required (CAN-SPAM/KVKK) |
| **🆕 H-series MUST added for Jul 20** — "408 incidents" honesty pass (source badges + copy softening + hardcoded-count removal) | Launch copy claims "408 verified" while DB is dominated by seeds; will not survive first audit |
| **🆕 P-series MUST added for Jul 12** — Pre-launch T-25→T-0 campaign (countdown threads + waitlist + TR press embargo + LinkedIn/Reddit drafts) | 25-day attention window was empty; every existing thread targets launch day |
| **🆕 M0 pre-audit added** (Playwright viewport projects + skip() cleanup) | Config missed iPhone SE + Pixel 7; e2e specs blindly skipped mobile |
| **M1 hot-spots list added** (incident-list.tsx, submit page, admin tables, UI-UX-AUDIT.md cross-ref) | Audit needs pre-flagged risk anchors |
| **Standing Rules #17, #18, #19 added** | Enforce sha256 credentials, code-reality pre-check, numeric-claim honesty |
| **Standing Rule #11 extended** | Weekly snapshot must include `process-deletions` cron proof |
| **B1, B5, C5 confirmed COMPLETE via audit** (path/column-name corrections logged in header) | Plan misidentified them as TODO; wasted future effort avoided |
| **API.md L3 fix note added to C2** | "No REST endpoints" claim is misinformation — 6 v1 endpoints are live |
| **Antigravity work queue** (18-item ordered table) + **Founder Decision Points** (7 items) added | Single top-to-bottom execution sheet; every founder-required choice in one place |
| I-series admin panel seed (v7.2) preserved | Unchanged — will run as step 8 of the work queue |
| Traction 4-organic-report note (v7.1) preserved | Unchanged |

## CHANGELOG (v7.1 → v7.2)

| Change | Rationale |
|--------|-----------|
| I-series → Admin Panel seed task added (`strategy_innovations` seed migration spec + rollback + accept criteria) | Founder wants to see I1–I8 innovations professionally in admin panel; existing table + admin page already support it |

## CHANGELOG (v7 → v7.1)

| Change | Rationale |
|--------|-----------|
| Traction baseline corrected in state header: 4 organic incident reports (incl. Grok passport case), not 0 | Board report had "zero organic" — incorrect; both marketplace sides have first signal |

## CHANGELOG (v6 → v7)

| Change | Rationale |
|--------|-----------|
| M-series mobile quality sprint added, priority over Stage C | Founder reports broken mobile UI; launch traffic will be majority-mobile |
| N-series marked complete (`Architect-Approval: 1d225fe 2026-07-08`) | Verified on origin |
| Stage C formally opened | Pacing rule: N-series approved → C starts; M-series outranks it |
| I-series innovation pool (8 proposals, no implementation without approval) | July 2026 ecosystem brainstorm captured as governed backlog, not scope creep |

## CHANGELOG (v5 → v6)

| Change | Rationale |
|--------|-----------|
| Stage R added at top priority (repo→private, token rotation, curated public repo post-launch) | 2026-07-08 audit found the repo publicly visible with security-vuln docs, valuation data, and strategy plans inside |
| Pacing rule rewritten: no waiting on dates, only Aug 1–9 freeze is calendar-locked; idle Executor = review finding | Founder correction: the agent must never sit idle because a stage's deadline is in the future |
| N-series added (Academy top-level nav, hardcoded strings, i18n CI guard, incident-language decision) | Founder priority on Academy visibility; i18n audit found key coverage complete but 8 hardcoded strings + English incident content |
| D-extra2 academic outreach pack (Harvard Berkman Klein, MIT, Stanford HAI, Oxford + Academy tiers) | Founder wants university engagement; Executor drafts, founder sends; unverified statistics stay out |
| Stage C start condition changed from "Aug 10" to "as soon as N-series approved" | Same pacing correction |
| Ecosystem note: Commission draft Art. 73 guidance + reporting template; referee-not-vendor positioning vs OneTrust/Prediction Guard | July 2026 ecosystem scan |
| Stage B marked complete (`Architect-Approval: 5b1a0f5 2026-07-07`) | All items + audit findings verified on origin |

## CHANGELOG (v4 → v5)

| Change | Rationale |
|--------|-----------|
| 2027 Horizon added (Q4'26 → Q4'27, quarterly) | Long-term direction anchored on 2 Dec 2027 Art. 73 go-live — the single date that defines the company's market moment |
| Per-quarter north-stars + kill/pivot criteria | Professional plans state failure conditions, not just goals |
| Long-term operating principles (quarterly re-planning, revenue-first from Jan 2027, regulatory calendar = marketing calendar) | Prevents the Executor deriving tasks from direction; keeps Horizon strategic, stages tactical |
| Header status refreshed to `5e29c34` approval state | Reflects Stage B partial approval |
| Definition of Done handoff updated | 2027 plan no longer "requested later" — it's in this document |

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

## IMMEDIATE NEXT STEPS FOR EXECUTOR (v7, 2026-07-08 evening)

1. **M1 mobile audit** — before anything else. Audit table + screenshots pushed.
2. **M2 fixes** — one commit per page/root-cause, before/after evidence.
3. **M3 mobile regression lock in CI.**
4. **Then Stage C** (C1 client_api_keys → C2 docs → C3 metering → C4 rate tiers → C5 embed kit), pausing only for the Aug 1–9 freeze.
5. N4 and all I-series items remain LOCKED without explicit Architect approval.
6. R2 token rotation: support the founder when they do their dashboard side.
7. All work on `master`. No new branches. No plan-doc edits. **Reports MUST use the PASS/FAIL Accept-criteria table — narrative-only reports get rejected.**
