# ALPAR AI — Strategic Advisory Board Plan

> **Date:** June 24, 2026
> **Prepared by:** Advisory Board (Top-of-Mind Strategy)
> **Status:** Pre-Launch Comprehensive Assessment & Action Roadmap
> **Execution Owner:** Google Antigravity (development) + Founder (strategy)
> **Classification:** Internal — Founder + Advisory Board only

---

## 0. EXECUTIVE SUMMARY

ALPAR AI is the **world's first community-driven trust infrastructure platform for AI systems** — positioned as "Trustpilot for Artificial Intelligence." The product stands on a strong technical foundation (Next.js 16, Supabase EU, PII Guardian, multi-LLM cross-audit), a solid legal frame (GDPR/KVKK, intermediary-platform status), and a market that is **uniquely well-timed** thanks to the EU AI Act tailwind.

### Current State — Three Sentences
1. **Product:** Technically ~85% production-ready; community data is non-existent (cold start).
2. **Market:** Empty — no direct competitor exists in the US or EU; EU-hosted, KVKK-compliant architecture is **regulator-friendly**.
3. **Risk:** The biggest risk today is not technical — it is **narrative and content cold-start**. Additionally, the `.env.local` historical leak requires immediate token rotation.

### Recommendation — Three Sentences
1. Launch today is **possible, but conditional**: token rotation + minimum 7 seeded incidents (incl. the Grok passport case) + i18n bug fixes are non-negotiable.
2. Open with a **LinkedIn manifesto format** — not a product announcement, but an "AI accountability" thesis.
3. Begin the investor narrative now; **angel round target Q3 2026**, **seed round Q1 2027**.

### Company Valuation Snapshot (Pre-Launch)

| Scenario | Pre-Money Valuation | Capital Target | Equity Dilution |
|----------|---------------------|----------------|-----------------|
| **Conservative (Angel)** | $1.5M | $250K | 14% |
| **Base (Angel)** | $2.5M | $400K | 14% |
| **Optimistic (Pre-Seed)** | $4M | $600K | 13% |
| **Vision (Seed Round Q1'27)** | $8M – $12M | $1.5M – $2M | 14-20% |

> **Note:** These valuations assume a post-launch first-60-day scenario delivering **min. 5,000 incidents + 25,000 registered users + 3 media references**. A pitch with an empty platform is not viable.

---

## 1. 360-DEGREE ANALYSIS — Multi-Perspective Assessment

### 1.1 Angel Investor Perspective

**Pros (Green Flags):**
- **Founder-market fit:** Founder is competent both technically (Next.js 16 + production-grade stack) and legally/ethically (KVKK expertise). Delivering this level of product as a solo founder is rare.
- **Lean execution:** 22 production dependencies, AGPL-3.0 license, 85% production-ready — high capital efficiency.
- **Compliance-first:** In this market, compliance is not a feature but a **moat**. US-based competitors will struggle to retrofit this.
- **Defensible content moat:** Community content = data = downstream value for AI training datasets (RLHF source).

**Cons (Yellow Flags):**
- **Solo-founder risk:** Single founder burnout + key-person risk. Co-founder or technical VP hire by Q4'26.
- **Cold-start problem:** Marketplace dynamic — no users → no content → no users loop. **First 60 days are critical.**
- **Legal exposure:** Negative content about a provider = potential defamation/unfair competition lawsuits. Legal insurance + DMCA workflow is mandatory.
- **Revenue model not crystallized:** B2C community vs. B2B SaaS direction undecided; trying both will scatter the startup.

**Angel Position:** **Investable.** Convertible (SAFE/CL), 20-25% discount, valuation cap $3M-4M is appropriate.

---

### 1.2 VC / Advisory Board Perspective

**Market Size (TAM / SAM / SOM):**

| Segment | Size | Notes |
|---------|------|-------|
| **TAM (Global AI Trust & Safety Market)** | $12B (2030) | Gartner, McKinsey reports |
| **SAM (EU + UK + TR AI Governance)** | $1.8B (2028) | EU AI Act-driven mandatory market |
| **SOM (Reachable First 3 Years)** | $24M – $48M | Compliance SaaS + API + Premium reports |

**Comparable Companies:**

| Company | Focus | Latest Valuation | Stage |
|---------|-------|------------------|-------|
| Credo AI | AI Governance | $122M | Series A (2023) |
| Holistic AI | AI Risk Assurance | $80M | Seed extension (2024) |
| Trustible | AI Compliance | $30M | Seed (2024) |
| Lakera | AI Security | $200M | Series A (2025) |
| **ALPAR AI** | **Community Trust Layer** | **Pre-money TBD** | **Pre-launch** |

**Differentiation:** All competitors above are **B2B SaaS**. ALPAR AI runs a hybrid **B2C community + B2B data layer** model — building a Trustpilot-style dynamic. This hybrid creates network effects — hard to rebuild from scratch.

**Investment Thesis (Crystallizing):**
> "In every regulated sector, community-driven transparency platforms emerged — Bloomberg for finance, Yelp for restaurants, Trustpilot for products, Glassdoor for workplaces, Healthgrades for healthcare. The AI sector enters a similar cycle from 2026 onward. ALPAR AI is building the Trust Infrastructure layer for this category — aiming to be the reference for both community and regulators."

**VC Recommendation:** Pre-seed round **not now**. First generate 60 days of metrics, then take a convertible pre-seed ($200K-$400K) in late Q3 / early Q4 2026.

---

### 1.3 Web Designer / UX Perspective

**Current State:**
- Tailwind v4 + custom design tokens (purple/cyan/emerald palette) — **modern, professional but not category-defining**.
- Framer Motion animations — premium feel.
- No shadcn/Radix, 100% custom components — **higher maintenance cost, but enables differentiation**.

**Top-of-Mind Recommendations (Design):**

1. **Brand differentiation is weak.** Current purple/cyan palette feels "Vercel/Linear pseudo." ALPAR AI is a **trust/journalism platform** — `Bloomberg + Wikipedia + Trustpilot` aesthetic is more accurate:
   - Warmer red/orange alert tones → conveys serious incident-reporting feel
   - Semi-serif typography (e.g. Inter + Tiempos) → editorial authority
   - Less gradient, more **data visualization** (charts, sparklines, heatmaps)

2. **Trust-signal void.** Homepage currently lacks **social proof**:
   - "Verified by X people" badges
   - "Y incidents reviewed this week" counters
   - Media logos (TechCrunch, MIT Tech Review — when mentioned)
   - Academic institution endorsements

3. **Onboarding emptiness.** No "what should I do now" feel for first-time users. Add a wizard:
   - "Report your first incident in 3 minutes" — gamified flow
   - "Earn the Founding Reporter badge" — reward system
   - "Verify your profile" — Google + LinkedIn integration

4. **Hero narrative.** Current hero is generic. **Manifesto format** proposal:
   > "When an AI lies to you — who is accountable?"
   > Subtitle: "ALPAR AI is the public, community-curated archive of how AI systems actually behave in the real world."
   > CTAs: "Report the First Incident" (red, primary) + "See the Leaderboard" (secondary)

5. **Mobile-first inventory.** Current design is responsive but not mobile-first. Mobile traffic will be 60%+ (LinkedIn traffic) — hero must be specifically mobile-optimized.

---

### 1.4 Strategy Consultant Perspective

**3-Year Vision:**

```
2026 Q3-Q4 → Cold Start: 10K users, 5K incidents, 5 media references
2027 Q1-Q2 → Network Effects: 50K users, 25K incidents, official provider-response program
2027 Q3-Q4 → Monetization: B2B SaaS launch, first 10 enterprise clients
2028 Q1-Q2 → Authority: EU AI Act reference, academic publications
2028 Q3-Q4 → Series A: $3M-$5M, US expansion
2029 → Category Leader: 500K+ users, 250K+ incidents, regulator data partner
```

**Strategic Decisions (Required Now):**

1. **B2C-First, B2B-Later.** First 12 months focused on community growth. Premium SaaS comes later.
2. **EU-First Geography.** Don't enter US market until 2028 — would reverse the regulator-arbitrage advantage.
3. **Founder Brand Building.** Founder's personal brand = 40% of company brand (Trustpilot/Glassdoor pattern). **3 LinkedIn posts/week is mandatory.**
4. **Data Licensing Model.** Anonymized incident data → academic research → first revenue stream (Q2 2027).
5. **AI Provider Diplomacy.** Open official dialogue channels with OpenAI/Anthropic/Google. Position as **partner**, not adversary.

---

### 1.5 Legal & Compliance Perspective

**Immediate Pre-Launch Actions:**

1. **DMCA Designated Agent registration.** $6 filing with US Copyright Office. Critical for safe-harbor under provider content takedowns.
2. **Insurance:** Cyber Liability + Defamation Insurance — $1M policy via Lloyd's of London or Beazley (~$3,500/year).
3. **Legal Disclaimers:** Prominent on each incident page: "User-generated content. Not verified by ALPAR AI. Provider responses are official."
4. **Whistleblower Protection.** Anonymous submissions must be inside legal coverage; EU Whistleblower Directive (2019/1937) compliant process documentation.
5. **Provider Right-of-Reply Charter.** Providers receive a 72-hour official-reply window. This procedure must be written + published.

**Mid-Term (3-6 Months):**

1. KVKK VERBIS registration (Turkey)
2. EU AI Act Article 71 compliance dossier
3. Trademark application (TR + EU + USPTO) — "ALPAR AI" + logo
4. Company structure decision: Delaware C-Corp (for fundraising) vs. Estonia OÜ (for compliance)

---

### 1.6 Social Media & PR Perspective

**Channel Strategy (Priority Order):**

| Channel | Priority | Format | Goal |
|---------|----------|--------|------|
| **LinkedIn** | 1 (Launch) | Manifesto + Case analysis | Professional + investor reach |
| **X / Twitter** | 2 | Case + chart + quote | AI community, journalist network |
| **Substack/Newsletter** | 3 | Weekly deep report | Editorial authority |
| **YouTube/Podcast** | 4 (Q4) | "AI Incidents" series | Long-form authority |
| **TikTok/Reels** | 5 (Q1 '27) | Incident summary < 60s | Younger audience, viral catch |
| **GitHub** | Continuous | Open-source modules | Developer trust |

**First 30 Days — Content Calendar (Core):**

- **Day 0 (Launch):** Manifesto LinkedIn post series (3 posts — hook + story + product)
- **Day 1:** Grok passport case — in-depth analysis
- **Day 3:** "AI Accountability Manifesto" Substack
- **Day 5:** First Founding Reporters list announcement
- **Day 7:** Weekly table (X incidents, Y providers)
- **Day 10:** A provider's "good response" example (positive case)
- **Day 14:** User interview (first Founding Reporter)
- **Day 21:** First media outreach (TechCrunch outreach)
- **Day 30:** End-of-month transparency report

---

## 2. SWOT ANALYSIS (Professional Format)

### Strengths
| # | Factor | Weight |
|---|--------|--------|
| S1 | Production-grade technical infrastructure (Next.js 16, RSC, Supabase EU) | High |
| S2 | Compliance moat (GDPR/KVKK/EU AI Act compliant, EU-hosted) | High |
| S3 | Multi-LLM cross-audit engine (proprietary IP, hard to copy) | High |
| S4 | PII Guardian (server-only, regulator-friendly) | High |
| S5 | Solo founder, fast decisions — low overhead | Medium |
| S6 | Bilingual (EN+TR) — two markets, one codebase | Medium |
| S7 | Open-source vibe (AGPL-3.0) — developer trust | Low |

### Weaknesses
| # | Factor | Urgency | Plan |
|---|--------|---------|------|
| W1 | Empty database (cold start) | Critical | First 7 real incidents + seed content |
| W2 | Brand identity weak (purple/cyan generic) | Medium | Q3'26 rebrand sprint |
| W3 | `.env.local` historical leak — tokens not rotated | Critical | Today (24h) |
| W4 | Solo founder risk (key person) | High | Q4'26 co-founder/VP search |
| W5 | Revenue model unclear (B2C vs B2B) | High | Q3'26 strategic decision |
| W6 | No onboarding (empty-screen problem) | Medium | First 2 weeks UX sprint |
| W7 | No legal insurance | High | Within 30 days post-launch |
| W8 | i18n coverage gap (terms, cookies hardcoded EN) | Low | Fix today |

### Opportunities
| # | Factor | Timing |
|---|--------|--------|
| O1 | EU AI Act in full effect — enterprise buyers searching | Now |
| O2 | No EU-origin direct competitor | Now |
| O3 | Turkey KVKK market wide open | Now |
| O4 | Academic dataset demand rising (for RLHF) | Q4'26+ |
| O5 | AI incidents weekly headlines in media | Continuous |
| O6 | Provider companies publishing transparency reports — partner positioning | Q4'26+ |
| O7 | Whistleblower law strengthened in EU | Continuous |
| O8 | Crypto/Web3 migration to AI — investor attention rising | 2026-2027 |

### Threats
| # | Factor | Probability | Impact | Mitigation |
|---|--------|-------------|--------|------------|
| T1 | OpenAI/Google ships a similar feature inside their product | Medium | High | Community moat — they can't replicate |
| T2 | Defamation/unfair-competition lawsuit (from a major AI co.) | Low-Medium | Very High | Insurance + DMCA + legal notice flow |
| T3 | China-origin competitor (alternative rival) | Medium | Medium | EU compliance arbitrage protects us |
| T4 | Cold start fails → momentum loss | High | Very High | First 30 days PR + content blitz |
| T5 | Key person (founder) illness/burnout | Medium | High | Q4'26 team expansion |
| T6 | EU AI Act enforced softer than expected | Low | Medium | B2C community model less compliance-dependent |
| T7 | Trolling / fake-report attacks (4chan/X groups) | High | Medium | AI moderation + Turnstile + IP rate limit |
| T8 | Provider boycott (refusing to respond officially) | Medium | Low-Medium | Empty response = transparency flag, inverse advantage |

---

## 3. RISK ANALYSIS (Risk Matrix)

### Risk Prioritization (5x5 Matrix)

```
                  IMPACT
              Low   Med   High   Very High
PROBABILITY
Very High    |  -  |  T7  |  -    |  T4      |
High         |  W8 |  W6  |  W4   |  W3,W7   |
Medium       |  T6 |  T3  |  T1   |  T2      |
Low          |  -  |  -   |  -    |  T2      |
Very Low     |  -  |  -   |  -    |  -       |
```

### Risk Mitigation Plan

| Risk ID | Risk Description | Owner | Action | Target Date |
|---------|------------------|-------|--------|-------------|
| R001 | `.env.local` leak | Founder | Rotate all tokens, refresh IP_SALT | 24 hours |
| R002 | Cold-start failure | Founder + PR | First 7 real incidents + LinkedIn manifesto blitz | 7 days |
| R003 | Defamation/legal lawsuit | Legal counsel | Cyber + Defamation $1M insurance policy | 30 days |
| R004 | DMCA gray area | Founder | US DMCA Agent registration | 30 days |
| R005 | Onboarding void | UX Sprint | Wizard + Founding Reporter badge system | 14 days |
| R006 | i18n gaps | Engineering | terms/cookies translation | 3 days |
| R007 | Trolling/fake reports | Moderation | AI moderation threshold + CAPTCHA + community guidelines | Continuous |
| R008 | Key-person risk | Founder | Begin co-founder search | 90 days |
| R009 | Revenue model uncertainty | Strategy | B2C-first decision, first paywall test | 180 days |
| R010 | Provider hostility | PR | Official dialogue channel + "Provider Charter" | 60 days |

---

## 4. COMPANY VALUATION (Detailed Model)

### 4.1 Comparable Valuations

| Company | Stage | Valuation | Multiple | Notes |
|---------|-------|-----------|----------|-------|
| Credo AI | Series A | $122M | 30x ARR | AI Governance B2B |
| Holistic AI | Seed Ext. | $80M | 25x ARR | UK-based, B2B |
| Trustible | Seed | $30M | 15x ARR | US-based |
| Lakera | Series A | $200M | 40x ARR | AI Security |
| Trustpilot | Public | $1.2B | 6x Revenue | General benchmark |
| Glassdoor (M&A) | Exit | $1.2B | — | Recruit Holdings 2018 acquisition |

### 4.2 Risk-Adjusted Discounted Valuation (Pre-Launch)

**Method 1 — Berkus Method:**

| Value Source | Maximum | ALPAR AI Value | Notes |
|--------------|---------|----------------|-------|
| Sound Idea | $500K | $500K | EU AI Act timing perfect |
| Quality MT/Founder | $500K | $400K | Solo founder, competent |
| Quality Product | $500K | $450K | 85% production-ready |
| Strategic Relations | $500K | $200K | No partners yet |
| Product Rollout | $500K | $300K | Launch today |
| **TOTAL** | **$2.5M** | **$1.85M** | Pre-money (conservative) |

**Method 2 — Scorecard Method:**

| Factor | Weight | Score (0-150%) | Impact |
|--------|--------|----------------|--------|
| Market Size | 25% | 130% | EU AI Act trigger large |
| Product/Technology | 15% | 120% | Production-grade |
| Management Team | 25% | 80% | Solo founder negative |
| Competitive Environment | 10% | 130% | No direct competitor |
| Marketing/Sales | 10% | 70% | No traction yet |
| Need Additional Investment | 5% | 100% | Expected amount |
| Other | 10% | 100% | Standard |

**Weighted Multiplier:** 1.07
**Pre-money baseline:** $2.5M (avg EU startup at similar stage)
**Calculated Pre-money:** ~$2.67M

**Method 3 — VC Method (Exit-Based):**

```
Exit Scenario (5 years out, 2031):
- ARR: $40M (3,000 enterprise + 100K B2C premium)
- Exit Multiple: 8x (M&A) or 12x (IPO)
- Exit Value: $320M - $480M

Investor Expected Return: 25x (Pre-seed standard)
Present Value (Pre-money):
- $320M / 25 = $12.8M (post-money @ exit)
- Back-calculation: ~$2.5M pre-money today
```

### 4.3 Consolidated Valuation

| Method | Pre-Money |
|--------|-----------|
| Berkus | $1.85M |
| Scorecard | $2.67M |
| VC Method | $2.50M |
| **Average (Recommended Anchor)** | **$2.34M** |

### 4.4 Round Recommendations

**Round 1 — Friends & Family / Bootstrap (Now - Q3'26):**
- Target: $50K - $100K
- Pre-money: $1.5M
- Equity dilution: 6.25% - 12.5%
- Use: 90 days of working capital, legal, insurance

**Round 2 — Angel / Pre-seed (Q3-Q4 '26):**
- Target: $300K - $500K
- Pre-money: $2.5M - $3.5M
- Instrument: SAFE (Y Combinator post-money SAFE)
- Valuation Cap: $4M
- Discount: 20%
- Use: First hire (co-founder/VP), growth

**Round 3 — Seed (Q1-Q2 '27, post-traction):**
- Target: $1.5M - $2M
- Pre-money: $8M - $12M (post-traction)
- Lead Investor: EU regtech VC (Speedinvest, Cherry Ventures, Atomico Angel)
- Use: Sales team, US-entry preparation, B2B SaaS launch

**Round 4 — Series A (Q3 '28+):**
- Target: $3M - $5M
- Pre-money: $15M - $25M
- Strategic: US entry, category leadership

---

## 5. ADMIN PANEL — NEW MODULES TO BUILD

> **Goal:** When founder/CEO logs in, they should see **live company health**, **risk level**, **valuation estimate**, and **strategic metrics** on one screen.

### 5.1 `/admin/strategy` — Strategic Overview Module

**Page Sections:**

1. **CEO Dashboard (Top Strip)**
   - 30-day incident growth chart
   - 30-day user growth chart
   - Active provider count
   - This week's media reference counter
   - "Company health score" (0-100, auto-calculated)

2. **SWOT Management Panel**
   - 4 panels (Strengths/Weaknesses/Opportunities/Threats)
   - Each item: title + weight + owner + last updated date
   - Versioning: SWOT changes over time → date-based snapshots
   - Table: `strategy_swot_items`

3. **Risk Matrix**
   - 5x5 matrix visualization (D3.js or recharts)
   - Risk list table: ID, description, probability, impact, mitigation action, owner, target date
   - Auto risk score: probability × impact
   - Table: `strategy_risks`

4. **Company Valuation Module**
   - Three methods visualized (Berkus, Scorecard, VC)
   - Each method editable
   - Auto average calculation
   - Round planning: Round 1, 2, 3, 4 targets
   - Table: `strategy_valuations`

5. **Roadmap (90/180/360 Days)**
   - Quarter-based milestone list
   - Each milestone: OKR + progress + risk
   - Table: `strategy_milestones`

### 5.2 `/admin/analytics` — Business Intelligence Module

**Extend existing `analysis` page if present.**

- **Funnel Analytics:** Visitor → Sign-up → Incident Submission → Recurring User
- **Cohort Analysis:** Weekly signup-cohort retention
- **Provider Engagement Heatmap:** Which provider gets most reports, who responds fastest
- **Trust Score Trend:** Per-provider trust score chart over time
- **PII Detection Stats:** How many incidents contained PII, which types
- **Autopilot Performance:** Cross-audit confidence distribution

### 5.3 `/admin/financial` — Financial Overview

- **Cash Runway Calculator:** Monthly burn rate × month = runway
- **MRR Forecast:** After B2B subscription launches
- **Equity Cap Table:** SAFE/Equity distribution, dilution simulator
- **Tax calendar:** VAT/withholding/corporate-tax schedule

### 5.4 `/admin/compliance` — Legal & Compliance

- **DMCA Requests:** Separate from existing takedown system, provider-focused
- **Audit Log:** All admin actions, who did what (`audit_log` table already exists)
- **KVKK/GDPR Data Request Queue:** User data deletion/export requests
- **EU AI Act Article 71 Compliance Checklist**
- **Insurance policy dates + renewal alerts**

### 5.5 `/admin/pr` — Media & Communications

- **Media Outreach CRM:** Who was contacted, last interaction, next step
- **Published media articles archive:** URL + score + estimated reach
- **Social media scheduler:** LinkedIn/X post scheduler (Buffer/Hootsuite integration)
- **Press kit generator:** Logo/founder bio/screenshot downloadable packages

### 5.6 Suggested New Database Tables

```sql
-- New tables for strategy modules (high-level; detail to be written by Antigravity)

strategy_swot_items
  - id, category (S/W/O/T), title, description, weight (low/medium/high)
  - owner_user_id, action_plan, target_date, status
  - created_at, updated_at, version_snapshot_id

strategy_risks
  - id, code (R001), title, description
  - probability (1-5), impact (1-5), risk_score (auto)
  - owner_user_id, mitigation_plan, target_date, status
  - created_at, updated_at

strategy_valuations
  - id, method (berkus|scorecard|vc), inputs (jsonb), result_pre_money
  - notes, snapshot_date
  - created_by, created_at

strategy_milestones
  - id, quarter (2026-Q3), title, okr_text
  - progress (0-100), status (planned|in_progress|done|missed)
  - linked_metric, owner_user_id

strategy_metrics_snapshots
  - id, snapshot_date, total_users, total_incidents
  - active_providers, media_mentions_count
  - mrr, runway_months, health_score (auto)
```

### 5.7 RBAC Expansion

- Current: `user`, `moderator`, `admin`, `ceo`
- `ceo` role should have **exclusive access to these modules**
- Add `advisor` (read-only) role → for advisory board members

---

## 6. ACTION PLAN — 4 Phases, 90 Days

### Phase 0: Launch Preparation (Today — 72 hours)

> **Goal:** Safe entry to today's LinkedIn launch

| Task | Owner | Duration | Status |
|------|-------|----------|--------|
| Rotate all tokens (Supabase, Vercel, Resend, Upstash, Sentry) | Founder | 2h | ⏳ |
| Refresh `IP_SALT` | Founder | 15m | ⏳ |
| Translate `terms` + `cookies` pages (i18n) | Antigravity | 3h | ⏳ |
| Officially add Grok passport incident to `incidents` table | Founder | 1h | ⏳ |
| Add minimum 7 real incidents (seed content) | Founder | 4h | ⏳ |
| Draft LinkedIn 3-post series | Founder + Advisory | 2h | ⏳ |
| Activate Sentry production DSN | Founder | 30m | ⏳ |
| Cloudflare Turnstile production key | Founder | 30m | ⏳ |
| Delete `alparai-web` duplicate Vercel project | Founder | 5m | ⏳ |

### Phase 1: Launch Week (Days 1-7)

| Day | Action |
|-----|--------|
| 1 | LinkedIn 3-post manifesto series (10:00, 12:00, 15:00) |
| 1 | Twitter/X cross-post + 3 separate threads |
| 2 | Grok passport case in-depth post |
| 3 | Substack/Newsletter kickoff — Manifesto post |
| 4 | First 50 Founding Reporter badges distributed |
| 5 | First "Incident of the Week" selection + announcement |
| 6 | LinkedIn analytics report + iteration |
| 7 | Weekly transparency report — open metrics |

### Phase 2: Beating the Cold Start (Days 8-30)

**Weekly Rhythm:**
- Monday: Sectoral trend analysis (X medium post)
- Wednesday: Incident of the Week (LinkedIn)
- Friday: AMA / Community Q&A (X Spaces or LinkedIn Live)
- Sunday: Substack deep article

**KPI Targets (End of 30 days):**
- 1,000 registered users
- 200 reported incidents
- 25 verified provider profiles
- 3 media references (at least 1 international)
- 5K LinkedIn follower growth
- First provider official response

### Phase 3: Trigger Network Effects (Days 31-60)

| Milestone | Target |
|-----------|--------|
| Admin panel new modules (strategy/swot/risk/valuation) built via Antigravity | Day 45 |
| Cyber + Defamation insurance policy | Day 45 |
| US DMCA Agent registration | Day 50 |
| First angel round (Friends & Family) opens | Day 50-60 |
| Trademark application (TR + EU) | Day 60 |
| Academic outreach (3 universities) | Day 60 |

### Phase 4: Preparation & Narrative (Days 61-90)

- Pre-seed pitch deck v1
- Co-founder search list (10 candidates)
- B2B SaaS prototype (Provider Pro tier) design
- "AI Accountability Annual Report 2026" planning
- Q4 2026 pre-seed round deck draft

---

## 7. ANTIGRAVITY DEV TASKS (Engineering Brief)

> **Note:** All development tasks below will be executed by **Google Antigravity**. The Advisory Board does not write code.

### 7.1 Today (Launch Prep)
- [ ] Translate `terms` + `cookies` pages via `getTranslations()` to EN+TR
- [ ] Add Grok passport incident via admin panel (manual)
- [ ] Add Sentry production DSN env variable
- [ ] Cloudflare Turnstile production key + secret swap
- [ ] Purge `.env.local` from git history (with BFG repo-cleaner)

### 7.2 First Week
- [ ] Onboarding wizard (`/onboarding`) — 3-step: role select, area of interest, first incident report
- [ ] Founding Reporter badge system (`/profile` badges section)
- [ ] Homepage hero update (new manifesto format)
- [ ] Make stats counter API real-time (revalidate: 60s)
- [ ] Mobile-first hero optimization

### 7.3 First Month (Strategy Module)
- [ ] `/admin/strategy` route + all sub-pages
- [ ] 5 new Supabase migrations (swot_items, risks, valuations, milestones, metrics_snapshots)
- [ ] RLS policies (`ceo` and `advisor` roles)
- [ ] Risk matrix visualization with Recharts/D3
- [ ] CEO health-score auto-calculation cronjob (weekly snapshot)
- [ ] `/admin/strategy/swot` CRUD
- [ ] `/admin/strategy/risks` CRUD + matrix
- [ ] `/admin/strategy/valuation` CRUD + three-method calculator
- [ ] `/admin/strategy/roadmap` CRUD + Gantt-like view
- [ ] `/admin/strategy/dashboard` CEO overview

### 7.4 Second Month (Analytics & Compliance)
- [ ] `/admin/analytics` — funnel + cohort + heatmap (PostgreSQL window funcs)
- [ ] `/admin/financial` — runway calculator + cap table
- [ ] `/admin/compliance` — KVKK/GDPR request queue
- [ ] `/admin/pr` — media CRM + scheduler

---

## 8. KPI & SUCCESS METRICS

### 8.1 90-Day Target Board

| KPI | Day 7 | Day 30 | Day 60 | Day 90 |
|-----|-------|--------|--------|--------|
| Registered users | 200 | 1,000 | 3,500 | 8,000 |
| Reported incidents | 25 | 200 | 800 | 2,500 |
| Verified provider profiles | 5 | 25 | 50 | 75 |
| Provider official responses | 0 | 2 | 8 | 20 |
| Media references | 0 | 3 | 10 | 25 |
| LinkedIn followers | 15.5K | 18K | 22K | 30K |
| MRR | $0 | $0 | $0 | $500 (early B2B test) |
| NPS score | — | 30+ | 40+ | 45+ |
| Monthly Active Users (MAU) | 150 | 700 | 2,500 | 6,000 |

### 8.2 Company Health Score (Auto Formula)

```
Health Score =
  (User Growth Rate × 25%) +
  (Incident Velocity × 20%) +
  (Provider Engagement × 15%) +
  (Media Mention Score × 15%) +
  (System Uptime × 10%) +
  (Compliance Status × 10%) +
  (Cash Runway × 5%)

Score:
  90-100: Excellent (Ideal for fundraising)
  70-89:  Good (Normal growth)
  50-69:  Warning (Investigate)
  <50:    Critical (Immediate intervention)
```

---

## 9. DECISION POINTS — Awaiting Founder Approval

| # | Decision | Recommended Path | Decision Deadline |
|---|----------|------------------|-------------------|
| K1 | Company structure (Delaware C-Corp vs. Estonia OÜ vs. TR LLC) | Estonia OÜ (compliance) + Delaware C-Corp (for US fundraise Q1'27) | 60 days |
| K2 | Logo/rebrand sprint launch | End of Q3'26 (before fundraise round) | 75 days |
| K3 | First hire role | Compliance/Legal Counsel (part-time) | 30 days |
| K4 | First B2B customer pilot program | Dialogue with one of OpenAI/Anthropic/Mistral | 60 days |
| K5 | Substack vs. own blog | Substack (for authority + email list growth) | 7 days |
| K6 | Co-founder vs. senior dev | Co-founder (long-term equity alignment) | 90 days |
| K7 | Open source vs. closed source | Hybrid: core open-source, premium B2B closed | 120 days |
| K8 | AI provider diplomacy tone | "Critical Friend" — partner, not adversary | Today |

---

## 10. ONE-PAGE SUMMARY — Today

```
STATUS
  Product: 85% ready
  Market: Perfect timing (EU AI Act)
  Risk: .env leak + cold start
  Value: ~$2.34M pre-money (anchor)

TODAY
  ☐ Token rotation (2h)
  ☐ i18n bug fix (Antigravity, 3h)
  ☐ Add 7 incidents (Grok + 6 more)
  ☐ LinkedIn 3-post series
  ☐ Twitter cross-post

7 DAYS
  ☐ Substack launch
  ☐ Founding Reporter program
  ☐ Weekly transparency report

30 DAYS
  ☐ 1K users, 200 incidents
  ☐ First provider official response
  ☐ Insurance + DMCA Agent
  ☐ Strategy module in admin panel

90 DAYS
  ☐ Pre-seed pitch deck
  ☐ Co-founder search
  ☐ B2B Pro tier prototype
```

---

## APPENDIX A — Launch Day LinkedIn Post Drafts

### Post 1 (10:00) — Hook

> **I asked an AI for help applying for a passport. It walked me through it step by step.**
>
> A few minutes later I had learned how to open a Delaware LLC, how to open a bank account, what documents were needed — everything.
>
> These are real screenshots. No prompt manipulation.
>
> [Image: Grok screenshot]
>
> I want to question this AI capability.
> But where?
>
> Until today, **there was no single platform recording how AI systems actually behave in the real world.**
>
> I started building it 18 months ago.
> Today is launch.
>
> 👉 alparai.com
>
> Curious to hear your views in the comments.

### Post 2 (12:00) — Story

> **18 months ago an AI system gave me wrong medical information.**
>
> I wanted to complain. I didn't know where to go.
> I wanted to share my evidence. There was no platform.
> I wanted to find others experiencing the same. Impossible.
>
> Then I thought:
>
> Yelp exists for restaurants.
> Glassdoor exists for workplaces.
> Trustpilot exists for companies.
> IMDb exists for movies.
>
> But for the technology fastest changing humanity — Artificial Intelligence — **nothing exists.**
>
> Today we change that.
>
> ALPAR AI — a community-driven, GDPR-compliant, EU-hosted platform for AI accountability.
>
> Beta launch is live. First 100 reporters earn the **Founding Reporter** badge.
>
> 👉 alparai.com

### Post 3 (15:00) — Product + CTA

> **ALPAR AI in 3 sentences:**
>
> 1. If an AI system misleads, harms, or exceeds limits → **report it anonymously or under your name.**
>
> 2. The AI company can **officially respond** — a transparent public record is created.
>
> 3. The community votes → **a real trust score emerges.**
>
> Special for the first 100 incidents this week:
>
> ✅ "Founding Reporter" badge
> ✅ Profile verification tag
> ✅ Voting rights on platform decisions
> ✅ All premium features free for first year
>
> If you want AI to be accountable, **report the first incident yourself.**
>
> 👉 alparai.com/submit
>
> #AIAccountability #ResponsibleAI #EUAIAct #StartupTurkey

---

## APPENDIX B — Ready Answers for Investor Questions

**Q: Why you? Why now?**
> As a solo founder I built the production-grade EU-compliant infrastructure single-handedly in 18 months. EU AI Act is in full force, KVKK is mature, and Turkey has no compliance-first platform of this scale. Timing and technical-stack alignment are rare.

**Q: Competition?**
> No direct competitor. Credo AI and Holistic AI offer B2B governance tools — they lack the community layer. Our moat is network effects — like Trustpilot/Glassdoor, once content accumulates rebuilding becomes impossible.

**Q: How will you make money?**
> Three layers: (1) Free B2C community → growth; (2) Provider Pro ($299/mo) → verified profile + early warning; (3) Enterprise API ($2,999/mo) → compliance reports + custom analytics. First 12 months B2C focus, B2B Q2'27.

**Q: Legal risk?**
> Intermediary-platform status (EU E-Commerce Directive). All user-generated content. 7-day takedown SLA. DMCA Agent registration. Cyber + Defamation insurance. RLS + PII Guardian. Risk under our control.

**Q: Cold start?**
> 18 months of founder content + 15K LinkedIn following + viral evidence cases like Grok passport. First 30 days target 1K users + 200 incidents. Launch-day 3-post manifesto series.

**Q: Team?**
> Currently solo. Co-founder search begins within 90 days (priority: compliance/legal background). 3-person core team target within 180 days.

---

## APPENDIX C — Key External Links & References

- **EU AI Act:** https://artificialintelligenceact.eu/
- **EU Whistleblower Directive:** Directive (EU) 2019/1937
- **KVKK:** https://www.kvkk.gov.tr
- **DMCA Agent Registration:** https://www.copyright.gov/dmca-directory/
- **Y Combinator SAFE Template:** https://www.ycombinator.com/documents
- **Trustpilot Investor Relations:** https://investors.trustpilot.com
- **Credo AI:** https://credo.ai
- **Holistic AI:** https://holisticai.com

---

> **Closing Note (From the Advisory Board):**
>
> ALPAR AI solves the right problem, at the right time, with the right infrastructure. The critical factor is the **narrative**.
>
> 85% of technical capability is done. The remaining 15% — legal and content layer — completes in 30 days.
>
> The real work — **create the category and become its first reference.**
> Trustpilot launched in 2007, went public in 2021. Glassdoor launched in 2008, sold for $1.2B in 2018.
>
> ALPAR AI launches in 2026. Target: **by 2030, be the first name that comes to mind when AI accountability is mentioned.**
>
> It is achievable. The plan is in hand. The ball is in your court.

---

**Document Version:** 1.0
**Next Update:** 7 days post-launch (with launch report)
**Signed:** Advisory Board
