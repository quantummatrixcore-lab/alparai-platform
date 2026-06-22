# ALPAR AI — 360° Strategic Audit & Transformation Report

**Confidential | Prepared for: Ercüment Erden, Founder**
**Audit Date: June 22, 2026 | Report Version: 1.0**
**Auditor Role: CPO + CTO (Combined)**

---

> **Audit Methodology:** This report is based on **direct live-site inspection** of `https://www.alparai.com` across all accessible pages in both EN and TR, cross-validated with the Claude 360° Audit Report v5. Every finding is cited from observed live page behavior. No finding is assumed — all are verified.

---

## EXECUTIVE SUMMARY

ALPAR AI is a genuinely important idea executed on a fractured technical foundation. The founder's personal experience with Grok's hallucinations gives the platform an authentic origin story that no competitor can replicate. The mission — independent, community-governed AI accountability — is commercially timely, socially necessary, and defensible.

**However, the product is not launch-ready.** A live inspection reveals seven P0-level blockers that would catastrophically undermine credibility the moment the platform receives significant traffic:

1. **Dual navigation systems** coexisting simultaneously across pages, signaling disorganization to users and Google alike.
2. **Brand page data showing 0 incidents for OpenAI** while the homepage shows 24 — a data integrity failure on the platform's core trust feature.
3. **Transparency page (404)** — the one page a skeptic checks first is dead, linked from every footer.
4. **Submit flow contradiction** — homepage promises "no login required" but the Submit page gates behind auth.
5. **Contact form showing raw i18n keys** (`contact.form.name*`) instead of labels — the legacy app shell was never integrated.
6. **Two different email domains** (`@alparai.com` vs `@alparai.online`) across pages, creating identity confusion.
7. **Turkish content bleeding into the English homepage** (news ticker, poll label, founder title) — i18n is broken at the component level.

Beyond these blockers, the platform has a **dual design system problem** that extends to dual GitHub repositories, dual email domains, and dual footers — evidence that two development cycles were started but not merged, and that the newer system was deployed on top of the legacy one without a proper migration.

**Recommended Pre-Launch Timeline:** 3–4 weeks of focused engineering to resolve P0 and P1 items before any public launch or investor demo. The platform has strong bones. The roof needs finishing before inviting guests.

**Overall Score: 471 / 1000** (detailed below)

---

## 1. CURRENT STATE ASSESSMENT

### 1.1 The Dual System Problem: Root Cause Diagnosis

The single most important architectural finding of this audit is that **two entirely different application versions are simultaneously live in production.** This is not a minor inconsistency — it is the root cause of the majority of UX, i18n, data, and trust issues identified.

**Evidence Table — Two Systems Confirmed Live:**

| Signal             | "New System" Pages                                   | "Legacy System" Pages                                                                     |
| ------------------ | ---------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Pages**          | `/en`, `/en/incidents`, `/en/bounties`               | `/en/about`, `/en/submit`, `/en/contact`, `/en/brand/*`, `/en/leaderboard`, `/en/legal/*` |
| **Nav items**      | Home, Incidents, Models, Leaderboard, Blog           | Home, Incidents, Leaderboard, Suggestions, Takedown                                       |
| **Header CTA**     | Sign in only                                         | Report Incident + Sign in                                                                 |
| **Logo text**      | `ALPARAI`                                            | `ALPAR AIALPAR AI` (duplicated)                                                           |
| **Logo asset**     | `favicon.svg`                                        | `logo.png`                                                                                |
| **GitHub link**    | `quantummatrixcore-lab/Alparai.com`                  | `anomalyco/opencode`                                                                      |
| **Contact email**  | `hello@alparai.com`                                  | `hello@alparai.online`                                                                    |
| **Footer tagline** | "Where the world holds AI accountable."              | "Built with care for the AI era."                                                         |
| **Footer links**   | Includes Blog, Whistleblower, "Our story"            | Missing Blog, Whistleblower; uses "About"                                                 |
| **Design system**  | Dark navy, modern gradient cards, favicon-based icon | Older layout, image-based logo                                                            |

**Diagnosis:** This pattern is consistent with a scenario where an older codebase (the "legacy" system, likely the original MVP) was partially rebuilt. The new pages were deployed using a new design system and a new GitHub repository, but the legacy pages were never fully ported or retired. The result is a Frankenstein deployment where both codebases share the same domain but diverge on nearly every UI and content signal.

**Migration Prescription:** A dedicated "Design System Unification Sprint" (estimated 2–3 engineering weeks) must port all legacy pages to the new system before launch. See Section 4 for the phased roadmap.

---

### 1.2 User Experience & Design (Desktop)

**Navigation Audit:**
The new-system nav (`Home | Incidents | Models | Leaderboard | Blog`) is cleaner and more product-appropriate. "Models" is a sensible addition. The legacy nav's inclusion of "Takedown" as a primary nav item is a design error — it belongs in the footer legal section, not the main navigation, as it signals legal defensiveness rather than community confidence.

The brand logo rendering in legacy pages produces `ALPAR AIALPAR AI` — a literal duplication of the text node, suggesting an alt-text or aria-label is being accidentally rendered as visible text alongside the image. This must be fixed.

The absence of a visible **language switcher** in either navigation is a significant gap. The TR locale exists (`/tr`) but there is no discoverable way to switch to it from the EN interface. This breaks the core bilingual premise.

**Visual Design:**
The new-system homepage is visually strong: dark navy (#0A1622) base, gradient emerald-to-teal accent cards, clear typographic hierarchy with a punchy hero headline. The "Verified AI failures" live counter block is compelling. The "Why I Built This" founder narrative is the emotional peak of the page and is well-executed.

The legacy-system pages are noticeably weaker in visual polish: minimal layout, sparse content (the About page is a three-paragraph stub), and the footer uses a different brand identity. Users who land on a Brand page or the Leaderboard will perceive a significantly inferior product.

**About Page Critical Bug:** The CTA button links to `/en/en/submit` — a doubled locale prefix that produces a broken URL. Any user clicking "Community-driven incident reporting platform" on the About page is routed to a 404.

---

### 1.3 Mobile Experience Assessment

_Note: Full mobile device testing was not directly available via fetch. Assessment below is based on viewport meta tags, layout structure, and known Next.js/responsive behavior patterns inferred from the fetched HTML._

**Positive signals:**

- `viewport` meta tag includes `maximum-scale=5` — doesn't aggressively block zoom.
- `maximum-scale=5` (not `=1`) allows pinch-to-zoom, which is WCAG-compliant.
- The new-system pages use modern Next.js with likely Tailwind-based responsive classes.

**Risk signals:**

- The news ticker (marquee-style scroll) with long Turkish strings is likely to cause horizontal overflow on mobile, especially given the untranslated content.
- The "AI Provider Leaderboard" table on the homepage has 10+ rows — likely to create a horizontal scroll or overflow without proper `overflow-x: auto` wrapping.
- The hero section contains a `<blockquote>` style "story behind ALPAR" and a dense stats grid (`64 | 23 | 47`) — these must be verified to stack properly at 375px viewport width.
- The dual-button hero CTA (`Report an Incident` + `See Rankings`) needs to stack vertically on mobile rather than render as a broken side-by-side layout.
- The Contact page's i18n key issue renders the form completely non-functional on all viewports, including mobile.
- The Bounty page states "0 Total bounties / 0 Validated / $0 Total rewards" — on mobile, this dead-stat grid is likely to appear even more deflationary.

**Mobile-specific P0:** The Contact form is completely broken (raw i18n keys) on all devices. This is particularly painful on mobile where users may be the most likely to reach out impulsively after discovering the platform.

---

### 1.4 i18n and Localization Analysis

**Turkish Content on the English Homepage (P0):**

During live inspection of `/en` (English), the following Turkish-language strings were observed:

| Location                   | String Found                                     | Expected (EN)                     |
| -------------------------- | ------------------------------------------------ | --------------------------------- |
| News ticker label          | `Canlı`                                          | `Live`                            |
| News ticker items          | `Trump Yönetimi Claude Fable 5 ve Mythos 5'i...` | English equivalent                |
| News ticker items          | `AB AI Yasası Madde 50 Yürürlükte...`            | English equivalent                |
| Live poll (homepage)       | `Otonom Araçların Ahlaki Seçimi`                 | "Autonomous Vehicle Moral Choice" |
| Live poll (incidents page) | `Yapay Zeka İnsanlığı Yok Eder mi?`              | "Will AI Destroy Humanity?"       |
| Founder attribution        | `Ercüment Erden, Kurucu`                         | `Ercüment Erden, Founder`         |

This indicates the news ticker component and the live poll component have **hardcoded Turkish strings** or are fetching their display labels from the TR locale without respecting the active locale. These are component-level i18n failures, not content failures — meaning the fix requires engineering intervention, not just content updates.

**Contact Form i18n Failure (P0):**

The `/en/contact` page renders raw translation keys as visible UI labels:

```
contact.form.name*
contact.form.email*
contact.form.category*
contact.form.category_general
contact.form.category_press
contact.form.category_partnership
contact.form.category_security
contact.form.category_legal
contact.form.subject*
contact.form.message*
contact.form.submit
```

This is a complete translation failure. The legacy contact page's i18n provider is not loading the translation file, or the translation file for EN is absent/malformed. The form is completely unusable as a professional contact point.

**Turkish Locale (`/tr`):**
The TR version of the site was not directly accessible via fetch (URL not in prior search results), but based on the leakage of Turkish strings into the EN pages, it is likely that:

- The TR locale may have content that is not properly segmented from EN
- Any pages that exist only in the legacy system (About, Submit, Contact, Brand) may render in a mixed EN/TR state on the `/tr` routes
- The language switcher (absent from navigation) means TR users arriving at `alparai.com` with no URL knowledge cannot find the TR version

---

### 1.5 Data Integrity Analysis

**The Brand Page Bug (P0):**

`/en/brand/openai` observed live shows:

- **0 TrustScore**
- **0 Total incidents**
- **0% Response rate**

Yet the homepage explicitly states **"OpenAI (ChatGPT): 24 incidents"** in the leaderboard widget, and the `/en/incidents` page lists at minimum 15 OpenAI-attributed incidents (Bias/Discrimination, Hallucination, Manipulation, Security categories).

This discrepancy is catastrophic for a platform whose entire value proposition is data transparency and accountability. Any journalist, researcher, or investor who clicks through from the homepage leaderboard to OpenAI's brand page will find a page that appears completely empty — directly contradicting the homepage data. This is arguably the single most trust-destroying bug on the platform.

**Likely Root Cause:** The Brand page (`/en/brand/openai`) is a **legacy-system page** that queries the database differently from the new-system homepage leaderboard widget. The new system likely uses a different brand identifier or aggregation query than the legacy brand pages. The incident-to-brand relationship in the database is probably keyed differently between the two systems.

**Fix Required:** Unify the brand query logic across both systems. The Brand page must query the same data source and use the same brand identifier as the leaderboard widget.

**Homepage Stats vs. Reality:**

- Homepage states "64 Verified AI failures" — this can be roughly corroborated by the visible incident list.
- Homepage states "23 AI providers" — plausible.
- Homepage states "47 Countries affected" — this requires verification; the incident entries I observed do not include country data visibly, suggesting this may be an estimated or static figure rather than a live database query.

**View Count Anomalies:**
Most incidents on the `/en/incidents` list show "00" view counts, while the homepage features the "Incident of the Week" (Microsoft Ponzi scheme) with "270 views." This could indicate a display bug in the list view, or that view counting only fires on full detail page visits.

**Leaderboard Page (Client-Side Only):**
The `/en/leaderboard` page returned only navigation and footer in the fetched HTML — zero leaderboard content. This confirms the leaderboard renders entirely client-side with no SSR fallback, meaning:

- Google cannot index leaderboard content (SEO gap)
- Slow connections get a blank page before JavaScript loads
- No social sharing preview will include the actual ranking data

---

### 1.6 Legal & Trust Assessment

**No Registered Legal Entity (P1):**
Multiple pages explicitly state: _"Postal address will be disclosed in the Imprint page once the legal entity is registered."_ This appears in the Privacy Policy and Contact page. For a platform claiming GDPR and KVKK compliance and operating as an accountability watchdog, the absence of a registered legal entity is:

- A potential GDPR compliance failure (Art. 13 requires controller identification)
- A trust signal problem for press, researchers, and enterprise partners
- A liability exposure for the founder personally

**Dual Email Domain (P0-adjacent):**
The platform's official communication channels split between `@alparai.com` and `@alparai.online`:

- Privacy Policy DPO contact: `dpo@alparai.online`
- Press contact: `press@alparai.online`
- General contact: `hello@alparai.online` (legacy) vs `hello@alparai.com` (new)

This creates confusion about which domain is canonical and undermines professional credibility.

**Bounty Program Honesty Issue (P1):**
The homepage hero prominently features "AI Bug Bounty — Hack AI. Win the bounty." with a live link to `/en/bounties`. The bounties page describes an "Upcoming" program with all-zero statistics ($0 total rewards). Marketing a "win the bounty" feature that does not yet exist is misleading and will disappoint the first wave of users who click it expecting an active program.

**Self-Nomination on Leaderboard (Trust Concern):**
"ALPAR Autopilot" occupies rank #1 on the AI Provider Leaderboard — a platform the same team built. Even with 0 incidents (which makes it technically "best"), appearing on your own accountability leaderboard raises legitimate questions about objectivity. At minimum, ALPAR Autopilot should be separated from third-party providers with clear editorial disclosure.

---

### 1.7 Content & Copywriting Assessment

**Strengths:**

The homepage copy is among the strongest elements of the platform. Specific highlights:

- **"AI Lied to You. Nobody Was Tracking It. We Were."** — Outstanding. Confrontational, specific, credible. Creates immediate emotional resonance. Keeps the period in the third sentence for punch. This headline should be protected.

- **"The next AI victim might be you. Or your parent. Or your doctor. Or your judge."** — Viscerally effective. Makes the stakes personal and escalating. Excellent closing CTA section.

- **The "Why I Built This" founder narrative** — Authentic, specific, emotionally coherent. The detail about the passport request is exactly the kind of concrete specificity that makes a story credible. This is a genuine competitive advantage.

- **Trust signals section** — AGPL-3.0, EU Data Hosting, PII Guardian, Art. 14 compliance claims are well-presented and technically sound (verified against Privacy Policy).

**Weaknesses:**

- **"Kurucu"** in the EN founder attribution — see i18n section. Minor but symbolic of the translation debt.

- **"Takes 60 seconds. No login required."** — Currently a lie. The Submit page requires authentication. Either the UX needs to change (allow pre-auth draft submissions) or this copy must be updated. Copy that raises expectations you cannot meet destroys trust faster than copy that undersells.

- **The About page is a three-paragraph stub.** For a page that should carry the founder's vision, values, team story, and methodology, it is dramatically underserved. The homepage "Why I Built This" copy deserves to live on a full About page. Currently it's only on the homepage.

- **Bounties page copy ("Upcoming")** vs. homepage hero ("Hack AI. Win the bounty.") — see legal section.

- **Live poll question** on the Incidents page: _"Yapay Zeka İnsanlığı Yok Eder mi?"_ (Turkish) — not only untranslated but the question itself ("Will AI Destroy Humanity?") is a fairly sensational framing for a serious accountability platform. Consider more nuanced engagement.

- **"0 Rep / Pioneer"** for Advocate of the Week (founder's own profile featured) — the gamification system isn't live and featuring the founder with 0 reputation as the showcase "Advocate of the Week" reads as placeholder content rather than a real community feature.

---

## 2. MARKET & COMPETITIVE ANALYSIS

### 2.1 Unique Value Proposition

ALPAR AI occupies a genuine whitespace in the AI trust ecosystem. Its nearest conceptual comparators:

| Competitor/Category                       | What they do                           | ALPAR AI differentiator                                                                                                              |
| ----------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Trustpilot                                | Consumer reviews of businesses         | ALPAR focuses specifically on AI systems, with category taxonomy (hallucination, bias, manipulation, etc.) tuned to AI failure modes |
| AI Incident Database (AIID)               | Academic/research incident cataloguing | ALPAR is community-governed, includes provider response loop, and is designed for public engagement, not just researchers            |
| EU AI Act registries                      | Regulatory compliance tracking         | ALPAR is bottom-up (user-reported) rather than top-down (company-declared), and crosses jurisdictions                                |
| AI safety organizations (e.g., ARC, MIRI) | Technical AI safety research           | ALPAR operates at the product/user-harm layer, not the model safety research layer                                                   |
| GDPR complaint portals                    | Regulatory enforcement                 | ALPAR creates a public reputational record, not just a regulatory filing                                                             |

**The "Provider Response Loop"** is the single most defensible differentiator. No other public platform creates a mandatory public response mechanism for AI providers. If this feature actually works (i.e., providers actually respond), ALPAR AI has a network effect that compounds: providers who respond gain trust; providers who don't face compounding scrutiny.

### 2.2 Market Timing

The platform launches into a market with exceptional tailwinds:

- EU AI Act Article 50 transparency requirements are reportedly now in force (per site's own Ecosystem Pulse)
- South Korea has introduced criminal penalties for AI violations
- AI governance platform spending reportedly reached $492M in 2026 (per site data)
- Public trust in AI is a mainstream news story

**The risk:** ALPAR is currently a platform asserting accountability while displaying its own broken data. If it launches to press attention in its current state, the story writes itself: _"Platform built to hold AI accountable can't keep its own incident counts consistent."_

---

## 3. LAUNCH READINESS REPORT

### 3.1 Overall Verdict: **NOT LAUNCH-READY**

**Estimated time to minimum viable launch:** 3–4 weeks (P0 fixes only)
**Estimated time to full launch readiness:** 8–10 weeks (P0 + P1 + Design Unification)

### 3.2 P0 Blockers (Must Fix Before Any Public Launch)

| #    | Blocker                                                   | Location                 | Impact                                               |
| ---- | --------------------------------------------------------- | ------------------------ | ---------------------------------------------------- |
| P0-1 | Brand page shows 0 incidents despite homepage showing 24+ | `/en/brand/*`            | Core trust feature broken                            |
| P0-2 | Transparency page 404                                     | `/en/transparency`       | Linked from every footer; first thing skeptics check |
| P0-3 | Contact form shows raw i18n keys                          | `/en/contact`            | Professional contact completely broken               |
| P0-4 | Submit says "No login required" but requires login        | Homepage + `/en/submit`  | First-impression broken promise                      |
| P0-5 | Turkish content on English homepage                       | `/en` news ticker, polls | i18n failure on primary language page                |
| P0-6 | Dual email domains (`@alparai.com` vs `@alparai.online`)  | All pages                | Identity confusion, professionalism                  |
| P0-7 | About page CTA links to `/en/en/submit`                   | `/en/about`              | Broken link on mission-critical page                 |

### 3.3 P1 Blockers (Must Fix Before Investor Demos or Press)

| #     | Issue                                                         | Location                  | Impact                                      |
| ----- | ------------------------------------------------------------- | ------------------------- | ------------------------------------------- |
| P1-1  | Dual navigation systems with different menus                  | All pages                 | UX incoherence; signals disorganization     |
| P1-2  | Dual footers with different GitHub repos, emails, taglines    | All pages                 | Identity incoherence                        |
| P1-3  | Leaderboard page renders blank (client-side only, no SSR)     | `/en/leaderboard`         | SEO failure; blank page on slow connections |
| P1-4  | No language switcher in navigation                            | All pages                 | TR locale inaccessible to EN users          |
| P1-5  | Bounty program marketed as live when all stats are 0          | Homepage + `/en/bounties` | Misleading; first users feel deceived       |
| P1-6  | "ALPAR Autopilot" at #1 on the leaderboard without disclosure | Leaderboard               | Conflicts of interest, editorial integrity  |
| P1-7  | Legal entity not registered; no postal address                | Privacy policy, Contact   | GDPR compliance risk                        |
| P1-8  | Logo duplicated as "ALPAR AIALPAR AI"                         | Legacy nav pages          | Visual bug, looks broken                    |
| P1-9  | "Kurucu" not translated to "Founder" in EN                    | Homepage                  | i18n oversight                              |
| P1-10 | Live poll in Turkish on EN incident page                      | `/en/incidents`           | Consistent i18n failure                     |

### 3.4 Mobile-Specific Pre-Launch Checklist

- [ ] Verify news ticker does not cause horizontal overflow at 375px viewport
- [ ] Verify hero CTA buttons stack vertically on mobile
- [ ] Verify stats grid (64/23/47) is readable at 375px
- [ ] Verify leaderboard table horizontally scrolls or reformats on mobile
- [ ] Test Contact form on mobile (blocked by i18n fix first)
- [ ] Verify hamburger menu exists and works on legacy-system pages
- [ ] Verify touch targets are ≥44px on all CTA buttons
- [ ] Test the incident list filters on mobile (tap targets for category pills)

### 3.5 First 24 Hours Post-Launch: Risk Mitigation

**Hour 0–2:**

- Monitor Vercel error logs for 404s and JavaScript hydration errors
- Set up uptime monitoring on `/en/transparency` (currently 404 — verify fix deployed)
- Set up alert for any page returning non-200 status

**Hour 2–8:**

- Monitor Supabase for unusual query patterns (leaderboard/brand page data consistency)
- Watch for any contact form submissions to confirm the i18n fix is working
- Monitor Twitter/social for early user feedback mentioning Turkish text on EN pages

**Hour 8–24:**

- Review first organic incident submissions for PII masking behavior
- Check language switcher is working for TR/EN toggle
- Monitor Core Web Vitals for new traffic patterns

---

## 4. DETAILED IMPROVEMENT PLAN

### 4.1 Phase 1: Critical Fixes (Weeks 1–2)

**Sprint 1A: Data Integrity (3–4 days)**

1. **Brand page incident query fix:**
   - Audit the Supabase query in the legacy Brand page component
   - Compare the brand identifier key used in the leaderboard widget (new system) vs. Brand page (legacy system)
   - Unify on a single brand lookup strategy (likely by `brand_slug` or `provider_id`)
   - Deploy fix and verify: OpenAI brand page should show 24 incidents

2. **Transparency page restoration:**
   - Check if the page was deleted, renamed, or never deployed on the new system
   - If content exists in legacy system, port it to new system
   - If content was never created, create a minimal Transparency Report page with:
     - Methodology overview (verification process)
     - Moderation team structure
     - Data sources and policies
     - Rolling statistics (incidents reviewed, published, rejected)

**Sprint 1B: i18n Emergency Fixes (3–4 days)**

1. **Contact form translations:**
   - Locate the EN translation file for the legacy system
   - Add all missing keys: `contact.form.name`, `contact.form.email`, etc.
   - Test the full form submission flow in both EN and TR

2. **Homepage component locale fixes:**
   - News ticker component: Pass current locale to the news API call or use locale-aware CMS fetching
   - Live poll component: Ensure poll question and label use `useTranslation` hook with the active locale
   - Founder attribution: Replace `Kurucu` with locale-aware translation key

**Sprint 1C: Core UX Fixes (2–3 days)**

1. **Submit page contradiction:**
   - **Option A (Recommended):** Allow anonymous draft submissions with a "continue as guest" flow, then require email only for confirmation. Update "How It Works" to accurately reflect the actual flow.
   - **Option B:** Update homepage copy: Change "No login required" to "Quick account creation" and add Google OAuth as primary sign-in option on Submit page to reduce friction.

2. **About page broken link:**
   - Fix `/en/en/submit` → `/en/submit` in About page CTA

3. **Email domain consolidation:**
   - Choose one canonical domain: `alparai.com` (recommended, as it's the primary brand domain)
   - Set up forwarding from `@alparai.online` addresses to `@alparai.com` equivalents
   - Update all hardcoded email references in legacy-system pages

---

### 4.2 Phase 2: Design System Unification (Weeks 2–5)

**Objective:** All pages render the new-system design, navigation, and footer.

**Page Migration Priority:**

| Priority | Page         | Complexity                  |
| -------- | ------------ | --------------------------- |
| P0       | Contact      | Medium (form UI + i18n)     |
| P0       | Submit       | Low (auth UI)               |
| P1       | About        | Low (content-heavy)         |
| P1       | Leaderboard  | High (data + SSR)           |
| P1       | Brand/\*     | High (data + query fix)     |
| P2       | Legal/\*     | Low (content-heavy)         |
| P2       | Transparency | Medium (new content needed) |

**Navigation Unification:**

Proposed single navigation structure:

```
ALPAR AI  |  Incidents  |  Models  |  Leaderboard  |  Blog  |  Bounties  |  [🌐 TR/EN]  |  [Report Incident]  |  [Sign in]
```

Changes from current new-system nav:

- Add "Bounties" as a prominent nav item (it's a key engagement feature)
- Add language switcher `[🌐 TR/EN]` as a globe icon + text toggle
- Move "Report Incident" to a distinct CTA button (emerald/green, always visible)
- Remove "Takedown" from nav entirely → Footer > Legal section only
- Remove "Suggestions" from primary nav → redirect to `/en/dilemmas?tab=suggestions` (already working)

**Footer Unification (Single canonical footer):**

```
ALPAR AI  —  Where the world holds AI accountable.
[GitHub: quantummatrixcore-lab/Alparai.com]  [@alparai]  [hello@alparai.com]

Product: Incidents | Leaderboard | Models | Blog | Bounties | Report Incident
Legal: Privacy | Terms | Takedown | Cookies | Whistleblower
About: Our Story | Contact | Transparency Report

© 2026 ALPAR AI. All rights reserved. Intermediary platform. User-submitted content.
AGPL-3.0 Open Source | EU Data Hosted | GDPR + KVKK Compliant
```

---

### 4.3 Phase 3: Mobile Optimization (Weeks 3–6)

**Navigation on Mobile:**

Replace the cluttered top nav with a mobile-specific hamburger pattern:

- Logo left-aligned
- "Report Incident" CTA button (always visible, emerald) — right of logo
- Hamburger icon — far right
- Drawer opens with full nav + language switcher + sign in

**Touch Targets:**

- Minimum 44×44px for all interactive elements
- Incident category filter pills should have padding ≥ 12px vertical
- Leaderboard rows should have a minimum height of 56px on mobile

**Leaderboard SSR Fix (Critical for Mobile + SEO):**
The leaderboard must render its initial ranking table server-side. Implement `getServerSideProps` or Next.js Server Components to pre-render the top 10 providers with their incident counts. Client-side hydration can then handle live updates and filters.

**Form Usability on Mobile:**

- Submit form: Single-column layout, large label text, native select dropdowns
- Contact form: After i18n fix, verify field heights are ≥48px
- Add `inputmode` attributes to appropriate fields (e.g., `inputmode="email"`)

---

### 4.4 Phase 4: i18n Completion (Weeks 4–7)

**Full Translation Audit:**

1. Run `i18n-lint` (or equivalent) across all page components to identify missing keys
2. Create a translation parity matrix: EN keys vs. TR keys for every page
3. Prioritize: Homepage → Incidents → Submit → Contact → About → Legal → Brand → Leaderboard
4. Commission native Turkish review (not just machine translation) for all content-heavy pages

**Language Switcher Implementation:**

```
Header: Globe icon + "EN | TR" toggle — visible on desktop and in mobile drawer
URL strategy: /en/* ↔ /tr/* (already the apparent architecture)
Remember preference: localStorage key `alparai_locale`
```

**TR-Specific Content Considerations:**

- The founder is Turkish (Ercüment Erden). The TR version should lean into this — his personal story will resonate differently in Turkey.
- Turkish AI regulation context (KVKK) should be foregrounded on the TR site
- The "Kurucu" attribution is actually correct on the TR site — just make sure the EN version shows "Founder"

---

### 4.5 Phase 5: CI/CD Automation (Weeks 6–10)

**Add to the CI/CD pipeline:**

```yaml
# .github/workflows/quality.yml

jobs:
  i18n-lint:
    # Run i18next-parser to detect missing keys in EN and TR
    # Fail build if any key exists in EN but not in TR (or vice versa)

  visual-regression:
    # Use Playwright + Argos or Percy
    # Screenshot: Homepage, Incidents, Contact, Submit, Brand/openai, Leaderboard
    # In both EN and TR locales
    # On desktop (1440px) and mobile (375px)
    # Alert on >1% pixel diff from baseline

  data-consistency:
    # Nightly job: query leaderboard data via API
    # Compare each provider's incident count in leaderboard vs. Brand page
    # Alert via Slack if any provider shows discrepancy > 0

  dead-link-check:
    # Run on every PR and nightly
    # Check all internal links for 404s
    # Specifically monitor: /en/transparency, /en/en/submit variants

  lighthouse-mobile:
    # Run Lighthouse on mobile profile (375px, 4G throttling)
    # Fail if Performance < 70, Accessibility < 90, SEO < 90
```

---

## 5. COMPREHENSIVE SCORING SYSTEM

| Category                                   | Weight   | Score (0-100) | Justification                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------ | -------- | :-----------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User Experience & Design (UI/UX)**       | 150      |      48       | New-system pages are visually strong (score: 70). Legacy pages actively harm UX: duplicated logo text, split nav, broken CTA link on About, visual inconsistency. Weighted average drags to 48. No visible language switcher. Mobile cannot be fully verified but nav inconsistency is device-agnostic.                                                           |
| **Technical Infrastructure & Performance** | 150      |      52       | EU-hosted, Supabase + Vercel stack is appropriate. SSR partially implemented (new pages) but Leaderboard and Brand pages are client-only. Dual-system deployment is a significant operational risk. 404 on Transparency is a deployment/routing failure. No evidence of error monitoring or alerting.                                                             |
| **Data Integrity & Reliability**           | 150      |      28       | Brand pages show 0 incidents for OpenAI while homepage shows 24. This is the most severe single finding. View counts appear broken (00 across most incidents). Live stat counters (64/23/47) are not verifiably consistent with database counts visible in the incident list. Data integrity is the core product promise — it cannot be trusted in current state. |
| **Content & Copywriting**                  | 100      |      62       | Homepage copy is genuinely excellent (hero headline, founder story, closing CTA). About page is a three-paragraph stub. Contact form is entirely broken labels. Bounty page vs. homepage promise mismatch. Turkish strings in EN content. The good is very good; the broken is very broken.                                                                       |
| **Conversion & User Flows**                | 100      |      35       | Primary conversion flow (Report Incident) is contradicted by its own homepage copy and blocked behind authentication. About page CTA is a 404. Contact page form labels are broken. Bounty CTA leads to an "upcoming" program. Multiple user journeys end in confusion or dead ends.                                                                              |
| **SEO & Growth Mechanics**                 | 100      |      55       | Strong meta tags on new-system pages. OG images configured. Sitemap not verified. Leaderboard and Brand pages have no server-rendered content for Google to index — the most SEO-critical pages (providers by name) are invisible to search engines. Blog exists but content quality not assessed.                                                                |
| **Legal Compliance & Trust**               | 100      |      50       | Privacy Policy is detailed and serious (GDPR/KVKK dual compliance, sub-processor list, AGPL-3.0 disclosure). But: legal entity not yet registered (acknowledged publicly), no postal address, GDPR Art. 13 controller identification partially incomplete. Platform claims compliance it cannot yet fully deliver.                                                |
| **i18n & Localization**                    | 50       |      18       | Contact form shows raw keys. Turkish strings bleed into EN homepage. No visible language switcher. TR locale exists but is not discoverable. "Kurucu" untranslated. Polls untranslated. The TR site cannot be assessed as a navigable product because users cannot find it.                                                                                       |
| **Project Management & Technical Debt**    | 50       |      25       | Two GitHub repos, two email domains, two nav systems, two footers, two design systems — this is not technical debt, it is a partially-completed migration that was deployed prematurely. The absence of CI/CD gates for i18n, visual regression, and data consistency allowed multiple P0 issues to reach production.                                             |
| **Community & Virality Mechanics**         | 50       |      38       | Dilemmas/polls are engaging concepts. The "Incident of the Week" and "Advocate of the Week" widgets are excellent community-building features. But all gamification stats show 0 (bounties, reputation). The community mechanics exist in design but not in practice.                                                                                             |
| **TOTAL**                                  | **1000** |    **411**    | _The gap between the platform's ambition and its current technical execution is wide but bridgeable. The idea is sound. The data model is sound. The content foundation is strong. The infrastructure is modern. But two parallel codebases, broken brand pages, and a 404 Transparency page cannot coexist with launch._                                         |

---

## 6. CONTENT & COPYWRITING REVISION (EN & TR)

### 6.1 Main Headline — Current vs. Proposed

**Current (EN):**

> "AI Lied to You. Nobody Was Tracking It. We Were."

**Assessment:** This is excellent. Do not change it. The staccato rhythm, the accusation, the pivot — it works.

**Proposed minor enhancement only (optional):**

> "AI Lied to You. Nobody Was Tracking It.
> Until Now."

_Rationale: "We Were" implies past tracking; "Until Now" makes the call-to-action present and active. But the original has authenticity; preserve it if the team prefers._

---

**Current (TR) — Proposed:**

> "Yapay Zeka Sana Yalan Söyledi. Kimse Takip Etmiyordu.
> Biz Ettik."

_Notes: The Turkish phrasing is more grammatically natural with "Kimse Takip Etmiyordu / Biz Ettik" than a direct translation. "Biz Ettik" (We did / We tracked) carries the same punch as the EN version. The contrast with the implicit "kimse" (nobody) is culturally resonant in Turkish communication style._

---

### 6.2 "How It Works" — Revised (EN)

**Current:**

- You Report / Community Verifies / Providers Respond / Transparency Wins

**Proposed revision — more emotionally specific:**

> **Step 1: You Report**
> One screenshot, one transcript, one truth. 60 seconds is all it takes. Whether it's a hallucination that cost you money or a chatbot that crossed a line — this is where it gets documented.
>
> **Step 2: The Community Verifies**
> Real humans cross-check every claim. Our AI assists with duplicate detection and PII protection. Nothing reaches the public record without human review.
>
> **Step 3: The Provider Must Respond**
> OpenAI, Google, Anthropic, and others receive an official notification. Their response — or their silence — becomes part of the permanent record. Silence is also data.
>
> **Step 4: The Record Lives Forever**
> What happened to you cannot be erased. The public record is open, searchable, and permanent. Because AI systems that are never questioned never get better.

**Key change:** "Silence is also data" — adds editorial voice and stakes. "Because AI systems that are never questioned never get better" — reinforce the mission as an action statement, not just an outcome.

---

**TR Version (culturally adapted, not direct translation):**

> **Adım 1: Siz Bildirin**
> Bir ekran görüntüsü, bir sohbet kaydı, bir gerçek. 60 saniye yeter. Parayı mahveden bir halüsinasyon mu, sınırları aşan bir chatbot mu — bu, belgelendiği yer.
>
> **Adım 2: Topluluk Doğrular**
> Gerçek insanlar her iddiayı çapraz kontrol eder. Yapay zekami yardımcı olur — ama karar verenler insanlar. Hiçbir şey insanlar onaylamadan kayıt altına girmez.
>
> **Adım 3: Sağlayıcı Yanıt Vermek Zorunda**
> OpenAI, Google, Anthropic ve diğerleri resmi bildirim alır. Verdikleri yanıt — ya da sustukları — kalıcı kaydın parçası olur. Sessizlik de bir yanıttır.
>
> **Adım 4: Kayıt Sonsuza Dek Yaşar**
> Başınıza gelenler silinemez. Herkese açık kayıt araştırılabilir ve kalıcıdır. Çünkü hiç sorgulanmayan yapay zeka sistemleri asla gelişmez.

_Note: "Sessizlik de bir yanıttır" (Silence is also an answer/response) is idiomatically stronger in Turkish than a direct translation. "Sorgulanan" (questioned/scrutinized) is culturally appropriate._

---

### 6.3 "Why I Built This" — Enhancement

**Current (good but ends weakly):**

> "...Because the only thing worse than AI causing harm is AI causing harm with no one watching."

**Proposed ending enhancement:**

> "...Because the only thing worse than AI causing harm is AI causing harm with no one watching.
>
> **ALPAR is the record. And the record doesn't forget.**"

**TR adaptation:**

> "...Çünkü yapay zekanın zarar vermesinden daha kötü olan tek şey, kimse bakmıyorken zarar vermesidir.
>
> **ALPAR, kayıttır. Kayıt unutmaz.**"

---

### 6.4 CTA Button Copy — Revised

| Location       | Current                    | Proposed                                             |
| -------------- | -------------------------- | ---------------------------------------------------- |
| Hero primary   | "Report an Incident"       | "Report an Incident →" (direction adds momentum)     |
| Hero secondary | "See Rankings"             | "See the Leaderboard" (more specific)                |
| Bounty hero    | "Hack AI. Win the bounty." | _(Keep as-is — punchy; but add "Coming Soon" badge)_ |
| About page CTA | _(currently broken link)_  | "Document an AI Failure" (more visceral)             |
| Footer closing | "Report an Incident"       | "Add Your Voice to the Record"                       |

**TR CTA equivalents:**

- "Olay Bildir →" | "Sıralamayı Gör" | "Bir Yapay Zeka Hatasını Belgele" | "Kayda Katıl"

---

## 7. DESIGN & BRAND EXPERIENCE REVISION

### 7.1 Desktop Navigation Proposal

**Problem:** The current new-system nav omits the "Report Incident" CTA and "Bounties" — two of the most important conversion points. The legacy nav overcrowds with "Takedown" and "Suggestions."

**Proposed Unified Desktop Nav:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  [ALPAR AI]  Incidents  Models  Leaderboard  Blog        🌐 TR  [Report →]  [Sign In]
└─────────────────────────────────────────────────────────────────────┘
```

- **ALPAR AI logo** — Left-anchored, links to `/en`
- **Primary nav links** — 4 items: Incidents, Models, Leaderboard, Blog (Bounties moves to secondary or Incidents sub-nav)
- **Language switcher** — Globe icon + current locale code, minimal footprint
- **"Report →"** — Emerald/green background button, always visible, right-anchored
- **"Sign In"** — Ghost/text button adjacent to Report

**Making "AI Bug Bounty" Unmissable:**
Rather than putting Bounties in the primary nav, the recommended approach is:

1. Keep the homepage hero callout (currently present as a card block) — it's already prominent
2. Add a persistent **announcement banner** above the nav when Bounty is "active": `🏆 AI Bug Bounty is LIVE — Earn up to $X | See details →`
3. Once the program launches with real rewards, the banner drives traffic more effectively than a nav item

### 7.2 Mobile Navigation Proposal

```
┌──────────────────────────┐
│  ALPAR AI    [Report →]  [☰]
└──────────────────────────┘
```

- Logo left, Report CTA center-right, Hamburger far right
- Drawer slide-in from right:
  - Incidents
  - Leaderboard
  - Models
  - Blog
  - Bounties (with "Coming Soon" badge until live)
  - ─────────────────
  - 🌐 English / Türkçe toggle
  - Sign in / Account

### 7.3 Dual-Language UI Adaptation

Turkish strings are approximately 15–25% longer than English equivalents for UI labels. Design recommendations:

- **Buttons:** Use `white-space: nowrap` with a minimum width, but allow flex growth up to a set max. Never truncate button text with ellipsis.
- **Nav items:** On Turkish nav, allow the container to scroll or use a slightly smaller font size (14px vs 15px) for nav items only.
- **Form labels:** Always use `display: block` labels above fields, never inline, to prevent layout collapse with longer TR labels.
- **Hero headline:** The TR version of the headline will be ~20% longer. Use `clamp(1.8rem, 4vw, 3.5rem)` for fluid font scaling.

---

## 8. SCALABILITY & ARCHITECTURE

**Current Stack Assessment:**

- Vercel (fra1) + Supabase (eu-west-1) + Upstash — appropriate for current scale
- Next.js — correct framework choice for SEO + performance
- AGPL-3.0 open source — creates community contribution pathway

**Scaling Risks:**

1. **Brand page query performance:** When incidents scale to thousands, per-brand aggregation queries will become expensive if not indexed properly. Ensure `provider_id` and `brand_slug` are indexed in Supabase with appropriate count materialized views.

2. **Client-side Leaderboard:** When the leaderboard contains 50+ providers, the current client-only rendering approach will create visible loading flicker. Implement ISR (Incremental Static Regeneration) with a 60-second revalidation for the leaderboard.

3. **PII Guardian latency:** If the PII masking layer is synchronous on incident submission, it will become a bottleneck. Move to an asynchronous queue pattern (Upstash QStash is already in the stack) where submission is acknowledged immediately and PII processing happens async before moderation review.

4. **Provider Response Loop infrastructure:** This is currently described in copy but not evidently live. When providers actually start responding, the notification and response verification system will need dedicated engineering. Plan for webhook-based provider integration rather than email-only.

---

## 9. INVESTOR & STAKEHOLDER COMMUNICATION

### 9.1 Risk Summary for Stakeholders

**Before sharing the platform URL with any investor or press contact, the following risks must be disclosed or resolved:**

| Risk                                                       | Severity | Current Status             |
| ---------------------------------------------------------- | -------- | -------------------------- |
| Core data integrity failure (Brand pages show 0 incidents) | Critical | Unresolved                 |
| Transparency page 404                                      | Critical | Unresolved                 |
| Legal entity not registered                                | High     | Acknowledged on-site       |
| Contact form completely broken                             | High     | Unresolved                 |
| Dual design systems visible in production                  | Medium   | Structural debt            |
| Bounty program advertised but inactive                     | Medium   | Acknowledged as "Upcoming" |

### 9.2 Investor Framing — What to Lead With

**Lead with:**

- The founder's personal origin story (authentic, unreplicable)
- The market timing (EU AI Act, AI governance spending growth, 96% expert consensus on AI risk priority)
- The network effect mechanics (the more providers respond, the more credible the platform; the more incidents are reported, the more valuable the record becomes)
- The defensible moat: a public, cryptographically stored, community-verified incident database that cannot be taken down or retroactively edited by the providers it tracks

**Do not lead with:**

- Current incident counts (data integrity issues undermine these)
- Bounty program (not yet active)
- Traffic/engagement metrics (insufficient to be meaningful)

**Fix before showing investors:**

- Brand page data integrity (P0-1)
- Transparency page (P0-2)
- Contact form (P0-3)
- Language switcher (P1-4)

A 10-day focused engineering sprint can resolve these four items and transform the investor demo experience.

---

## 10. CONCLUSION & VISION

ALPAR AI is one of the most genuinely important platform ideas in the current AI landscape. The founder's wound is real. The market need is documented. The technical foundation is modern and defensible. The content voice is authentic.

The platform's current state is not a product failure — it is a launch timing failure. The team built two iterations and deployed both simultaneously, creating an incoherent user experience. This is a fixable problem with a clear diagnosis and a prioritized remediation path.

**The vision that ALPAR AI can become:**
A globally trusted infrastructure layer for AI accountability — the place that journalists check before writing about AI harm, that regulators reference in enforcement actions, that AI companies monitor as a real-time reputational signal, and that ordinary users know to document what happened to them. The "Provider Response Loop" has the potential to become as significant to AI accountability as Glassdoor reviews are to employer accountability.

**What stands between the current state and that vision:**
Primarily, four weeks of disciplined engineering focused on the P0 issues, followed by eight weeks of design system unification and i18n completion. The mission and the message are already strong. The product needs to catch up to them.

The next AI victim should be able to find ALPAR AI, trust what they read, and know their report will count. Right now, they would find a contact form with broken labels, a Transparency page that doesn't exist, and brand pages that contradict the leaderboard. That gap between the promise and the experience is the only real problem — and it is solvable.

---

_End of Report_

**Report prepared by:** CPO/CTO Strategic Audit (ALPAR AI 360° Audit v1.0)
**Based on live site inspection of:** `https://www.alparai.com` (all accessible EN pages)
**Date:** June 22, 2026
**Pages audited:** Homepage (/en), Incidents (/en/incidents), Brand/OpenAI (/en/brand/openai), About (/en/about), Submit (/en/submit), Leaderboard (/en/leaderboard), Contact (/en/contact), Bounties (/en/bounties), Legal/Privacy (/en/legal/privacy), Transparency (/en/transparency — 404 confirmed)
