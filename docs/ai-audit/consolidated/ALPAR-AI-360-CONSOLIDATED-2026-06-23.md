# ALPAR AI — 360° Consolidated Audit Report

> **Date:** June 23, 2026
> **Version:** 3.0 (Updated to Professional Format)
> **Prepared by:** opencode/mimo-v2.5-free
> **Scope:** All pages (EN + TR + Mobile) + 16 models historical data
> **Score:** 570/1000 (Independent Live Site Audit)
> **Status:** NOT READY for Launch — 7 P0 Blockers present

---

## 1. EXECUTIVE SUMMARY

### Current Status Summary

| Metric         | Value    | Note                                               |
| -------------- | -------- | -------------------------------------------------- |
| Overall Score  | 570/1000 | Independent live site audit                        |
| Previous Score | 634/1000 | MASTER-360-AUDIT-REPORT.md                         |
| P0 Blockers    | 7 items  | Critical, must be resolved before launch           |
| P1 Issues      | 12 items | High priority, within 1 week                       |
| Resolved P0s   | 4 items  | Transparency, Login wall, Contact i18n, Brand data |
| Launch Status  | NO       | 7 P0 blockers remain                               |

### Most Critical Findings (Live Site Verification)

1. **Raw i18n key in Transparency:** `legal.trustScoreMethodology` and `legal.trustScoreMethodologyDesc` are printed raw in both languages.
2. **Empty incidents on Brand page:** OpenAI page claims "24 incidents" but none are rendered.
3. **"See Rankings" misleading:** The button in the Hero section links to `/incidents` instead of `/leaderboard`.
4. **TR Live Feed in English:** "Fatal Autonomous Vehicle Crash", "AI recommended Ponzi scheme" titles are in English.
5. **Trust Score Methodology hardcoded in English:** "Verified Incidents", "Response Rate & Speed" sections are completely untranslated.
6. **Models page lists only 1 model:** Grok 3 is present, the rest are missing.
7. **Zero social proof:** 0 votes, 0 comments, platform looks dead.

---

## 2. PAGE-BY-PAGE ANALYSIS (LIVE SITE VERIFICATION)

### 2.1 Homepage — 65/100

**Strengths:**

- The hero section is engaging: "AI Lied to You. Nobody Was Tracking It. We Were." is a strong message.
- 2-column split layout (manifesto + live data) works well.
- Live stat cards (64 failures, 23 providers, 47 countries) are eye-catching.
- Founder story section builds an emotional connection.
- News ticker provides a live information stream.
- Ecosystem Pulse section offers rich content.
- "How it works" 4-step process is clear.
- Trust bar (AGPL, EU/GDPR, PII Guardian, Art. 14) builds credibility.
- Footer is comprehensive (Product, Legal, About).

**Critical Issues:**

- 🔴 "See Rankings" button is misleading — links to `/incidents` (`hero-section.tsx:98`).
- 🔴 Duplicate CTAs — features both a "See Rankings" button and a duplicate link at the bottom.
- 🔴 TR Live Feed in English — `title_tr ?? title_en` fallback in `page.tsx:213` because `title_tr` is NULL in the DB.
- 🟡 Navigation bar is cramped — 10+ elements on a single row.
- 🟡 "Last report: Just now" — unclear whether it is real-time or static.

### 2.2 Incidents — 60/100

**Strengths:**

- "All Incidents" header is clear.
- 50+ published reports.
- Filtering system is comprehensive: category + severity + search.
- Incident cards are informative.
- Timeline process is visual.
- Live Poll and Latest News in the sidebar.

**Critical Issues:**

- 🔴 Unbalanced width ratio between the sidebar and the main content area.
- 🔴 All incidents display vote=0 and comment=0 — lacks social proof.
- 🟡 Filter buttons are too small — hard to use on mobile.
- 🟡 Inconsistent severity color-coding.

### 2.3 Leaderboard — 55/100

**Strengths:**

- Table structure is clean.
- Provider logos are premium.
- `<table>` + `<caption>` elements are implemented well for accessibility.
- Sharing buttons are active.

**Critical Issues:**

- 🔴 Ranking logic is incorrect — sorted by `trust_score` instead of `incident_count`.
- 🔴 Total response=0, average response rate=0% — makes the platform look dead.
- 🔴 ALPAR Autopilot (#1, 0 incidents) — unfair ranking advantage.
- 🟡 16 providers show 0 incidents — 70% of the table is empty.

### 2.4 Models — 30/100

**Strengths:**

- "AI Models Directory" header is clear.
- Search + sort + filter are present.

**Critical Issues:**

- 🔴 ONLY 1 MODEL LISTED (Grok 3) — The page is almost empty.
- 🔴 80% of the page height is empty space.
- 🟡 Rating shows as "-(0)" — unclear whether it represents a negative value or an empty state.

### 2.5 Blog — 70/100

**Strengths:**

- "INSIGHTS & RESEARCH" eyebrow badge is thematic.
- 3 blog cards arranged in a grid.
- Tags are category-based.
- Content quality is high.

**Issues:**

- 🟡 Blog cards lack visual thumbnails.
- 🟡 Tags are too small and faded.
- 🟡 Limited to 3 blog posts.

### 2.6 Submit — 82/100

**Strengths:**

- "No login required" message is explicit.
- "100% Anonymous" builds trust.
- Form fields are clean (200/5000 chars).
- 3 required consent checkboxes.
- Evidence upload is active.

**Issues:**

- 🟡 Form page is very long — lacks a sticky submit button.
- 🟡 "PII is masked automatically" notice is shown, but how it works isn't explained.

### 2.7 Contact — 75/100

**Strengths:**

- Clean form design.
- Category dropdown is functional.
- EN and TR versions are consistent.
- Sidebar features email and registered office info.

**Issues:**

- 🟡 Missing "registered office" details — "Will be disclosed in the Imprint page".
- 🟡 Missing Imprint page — legal requirement.

### 2.8 Transparency — 50/100

**Strengths:**

- 64 total reports, 100% publish rate.
- 4-step moderation process explained.
- Platform stats are correct (4 users, 23 providers, 64 incidents).

**Critical Issues:**

- 🔴 Raw i18n key — `legal.trustScoreMethodology` and `legal.trustScoreMethodologyDesc` are printed raw.
- 🔴 Trust Score Methodology is hardcoded in English — no `t()` translations used.
- 🟡 Trust Score formula: "Verified Incidents × -5" — negative multiplier could be misleading.

### 2.9 Legal Pages — 80/100

**Strengths:**

- Terms of Service: fully translated into Turkish.
- Privacy Policy: present.
- Takedown Policy: present.
- Cookie Policy: present.

**Issues:**

- 🟡 Missing Imprint page — EU legal requirement.
- 🟡 `/legal/takedown` link appears as raw URL (anchor link might be broken).

---

## 3. TECHNICAL ANALYSIS (CODE REFERENCES)

### 3.1 i18n Status

**Problematic Areas:**

1. `transparency/page.tsx:201,206` — `trustScoreMethodology` and `trustScoreMethodologyDesc` keys are missing in translation files.
2. `transparency/page.tsx:224-249` — Trust Score section is completely hardcoded in English.
3. `page.tsx:213` — `title_tr ?? title_en` fallback; `title_tr` is likely NULL in the DB.
4. `hero-section.tsx:98` — "See Rankings" link points to `/incidents`.

**Resolved Areas:**

- Contact form i18n — fully translated.
- Legal pages — fully translated.
- Navigation — fully translated.

### 3.2 Data Integrity

**Problematic Areas:**

1. Brand page incidents — `brand/[slug]/page.tsx:121-137` fetches incidents but does not render them.
2. Leaderboard sorting — `leaderboard/page.tsx:70-77` sorts by `trust_score`.
3. Homepage vs Brand count — Homepage "64", OpenAI "24" — this might be correct.

### 3.3 Mobile Responsiveness

**Current Status:**

- `mobile-nav.tsx` is present and functional.
- 8 links, Escape key support, body scroll lock.
- LanguageSwitcher appears in the hamburger menu.

**Unverified Areas:**

- Viewport fixed to 1280px — mobile presentation could not be verified.
- Touch target sizes not verified.
- Form usability on mobile not verified.

---

## 4. SCORING (10 Categories × 100 = 1000)

| #   | Category                | Weight   | Score   | Evidence                                                               |
| --- | ----------------------- | -------- | ------- | ---------------------------------------------------------------------- |
| 1   | UX/UI & Design          | 100      | 65      | Hero strong but nav cramped, brand empty, duplicate CTAs               |
| 2   | Technical Architecture  | 100      | 75      | Next.js 16 + Supabase good but FREE plan risk, missing CI              |
| 3   | Data Integrity          | 100      | 40      | Brand empty incidents, leaderboard wrong sorting, 0 social proof       |
| 4   | Content & Copywriting   | 100      | 70      | Strong EN/TR hero copy but trust score methodology hardcoded           |
| 5   | Conversion & User Flows | 100      | 55      | Submit form good but "See Rankings" misleading, 0 votes/comments       |
| 6   | SEO & Growth            | 100      | 60      | Meta tags present but blog limited to 3 posts                          |
| 7   | Legal Compliance        | 100      | 80      | AGPL, GDPR, KVKK, PII Guardian strong. Imprint missing                 |
| 8   | i18n & Localization     | 100      | 50      | Most translations good but transparency raw key, trust score hardcoded |
| 9   | Project Management      | 100      | 45      | Two design systems, missing CI/CD, models page empty                   |
| 10  | Community & Virality    | 100      | 30      | 0 social proof, Founding Reporter has not started                      |
|     | **TOTAL**               | **1000** | **570** |                                                                        |

---

## 5. P0 BLOCKERS (MANDATORY PRE-LAUNCH)

| #   | ID     | Title                                | Category | Status | Evidence                              | Effort  |
| --- | ------ | ------------------------------------ | -------- | ------ | ------------------------------------- | ------- |
| 1   | P0-011 | Transparency raw i18n key            | i18n     | OPEN   | `transparency/page.tsx:201,206`       | 30 mins |
| 2   | P0-012 | Empty incidents on Brand page        | data     | OPEN   | `brand/[slug]/page.tsx:121-137`       | 2 hours |
| 3   | P0-013 | "See Rankings" misleading link       | ui       | OPEN   | `hero-section.tsx:98`                 | 5 mins  |
| 4   | P0-014 | TR Live Feed in English              | i18n     | OPEN   | `page.tsx:213`, `title_tr` NULL in DB | 1 hour  |
| 5   | P0-015 | Trust Score hardcoded in English     | i18n     | OPEN   | `transparency/page.tsx:224-249`       | 2 hours |
| 6   | P0-016 | Models page lists only 1 model       | data     | OPEN   | Live site verified                    | 3 hours |
| 7   | P0-017 | Zero social proof (0 votes/comments) | data     | OPEN   | Whole platform                        | 1 week  |

---

## 6. P1 HIGH PRIORITY (WITHIN 1 WEEK)

| #   | ID     | Title                                               | Category | Status | Effort    |
| --- | ------ | --------------------------------------------------- | -------- | ------ | --------- |
| 1   | P1-001 | Leaderboard ranking logic                           | data     | OPEN   | 2 hours   |
| 2   | P1-002 | Homepage duplicate CTAs                             | ui       | OPEN   | 1 hour    |
| 3   | P1-003 | Nav bar cramped                                     | ui       | OPEN   | 3 hours   |
| 4   | P1-004 | Blog cards lack thumbnails                          | ui       | OPEN   | 2 hours   |
| 5   | P1-005 | Mobile not verified                                 | ui       | OPEN   | 1 day     |
| 6   | P1-006 | Missing Imprint page                                | legal    | OPEN   | 3 hours   |
| 7   | P1-007 | Dual email domain (@alparai.com vs @alparai.online) | legal    | OPEN   | 1 hour    |
| 8   | P1-008 | Dilemmas cold start (8/9 questions 0 votes)         | data     | OPEN   | 1 week    |
| 9   | P1-009 | Dual design system                                  | ui       | OPEN   | 2-3 weeks |
| 10  | P1-010 | Health endpoint information leakage                 | security | OPEN   | 30 mins   |
| 11  | P1-011 | Cookie banner lacks Escape support                  | ui       | OPEN   | 15 mins   |
| 12  | P1-012 | Husky hooks empty                                   | project  | OPEN   | 15 mins   |

---

## 7. RESOLVED ISSUES (From Previous Reports)

| #   | Title                         | Source             | Status      | Resolution Date |
| --- | ----------------------------- | ------------------ | ----------- | --------------- |
| 1   | Transparency Report 404       | Claude P0, Minimax | ✅ RESOLVED | 2026-06-22      |
| 2   | Contact form i18n key leakage | Claude P1          | ✅ RESOLVED | 2026-06-22      |
| 3   | Submit login wall             | Claude P0          | ✅ RESOLVED | 2026-06-22      |
| 4   | Brand data error (partial)    | Claude P0          | ✅ RESOLVED | 2026-06-22      |
| 5   | About 404 link                | Claude P0          | ✅ RESOLVED | 2026-06-22      |
| 6   | Autopilot in leaderboard      | Claude P1          | ✅ RESOLVED | 2026-06-22      |
| 7   | Fake "Featured In" logos      | Claude P1          | ✅ RESOLVED | 2026-06-22      |
| 8   | Share links                   | Claude P1          | ✅ RESOLVED | 2026-06-22      |

---

## 8. UNIQUE FINDINGS (From This Audit)

### mimo-v2.5 Finding

> "On the Transparency page, the `trustScoreMethodology` key is missing in messages files, but a `defaultValue` fallback is used. The issue: even the fallback text is rendered as raw key — this is not a failure of next-intl's `defaultValue` mechanism, but rather a misuse of the component's `t()` call. In `transparency/page.tsx:201`, it should use `{t("trustScoreMethodology", { defaultValue: "Trust Score™ Methodology" })}` instead of `{t("trustScoreMethodologyDesc", { defaultValue: "..." })}`. But the root issue: these keys are not present in messages files at all — meaning even if the fallback worked, translation would be impossible."

---

## 9. RECOMMENDATIONS

### Immediate (Today)

1. Point the "See Rankings" link to `/leaderboard` — 5 mins
2. Add `trustScoreMethodology` and `trustScoreMethodologyDesc` keys to messages files — 30 mins
3. Move Trust Score Methodology to i18n — 2 hours

### This Week

4. Resolve Brand page incidents rendering issue — 2 hours
5. Fix TR Live Feed (populate `title_tr` field) — 1 hour
6. Create Imprint page — 3 hours
7. Correct Leaderboard ranking logic — 2 hours

### This Month

8. Add 10+ models to Models page — 3 hours
9. Mobile testing and optimization — 1 day
10. Dual design system unification — 2-3 weeks
11. CI/CD pipeline (visual regression, i18n-lint) — 1 week

---

## 10. CONCLUSION

### Overall Evaluation

ALPAR AI is a **high-potential but launch-unready** product. Consolidated findings from 16 models form a robust foundational analysis. My live site audit verifies these findings and identifies new P0 issues.

### Path to Launch

- **When 7 P0 blockers are resolved:** Score can rise to around 570 → 750+.
- **When 12 P1 issues are resolved:** Score can rise to around 800+.
- **Dora Elite (900+):** Can be achieved with 3-6 months of continuous development.

### Investor View

- **Strengths:** Unique value proposition, solid legal infrastructure, strong founding story
- **Weaknesses:** Zero social proof, data integrity issues, lack of mobile testing
- **Recommendation:** Do not begin your investment round before resolving P0 issues.

---

_Report prepared by opencode/mimo-v2.5-free._  
_Date: June 23, 2026_  
_Version: 3.0_
