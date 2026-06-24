# ALPAR AI — Master Issue Checklist

**Last Updated:** 2026-06-23 · **Source:** Audit dashboard (June 2026) + independent CPO/CTO report

> **For Antigravity / code agent:** Read this file before taking tasks. You do not need
> to read the raw audit reports (`reports/` folder) — the open (🔴/🟡) items here are
> the exact task definitions. When you fix an item, set its status to 🟢,
> **never mark it as ✅ on your own** (see the "Fixed is a Two-Stage Process" rule in README.md).

**Status Codes:** 🔴 Open (P0 — blocks launch) · 🟡 Open (P1 — trust/conversion risk) · 🔵 Open (P2 — growth/polish) · 🟢 Fixed — not verified · ✅ Fixed — verified

---

## P0 — Launch Blockers

| ID      | Page/Area             | Issue                                                                                                   | Status      | First Reported     | Last Verified | Source            |
| ------- | --------------------- | ------------------------------------------------------------------------------------------------------- | ----------- | ------------------ | ------------- | ----------------- |
| ALP-001 | Leaderboard, About    | Old design system: old nav (Suggestions/Takedown), old footer (hello@alparai.online, anomalyco GitHub)  | ✅ Resolved | Audit v3 (approx.) | 2026-06-23    | Dashboard Jun2026 |
| ALP-002 | Homepage / Hero       | "0 Verified AI failures" counter — does not count published incidents, shows 0 despite having 40+ cases | ✅ Resolved | Audit v4 (approx.) | 2026-06-23    | Dashboard Jun2026 |
| ALP-003 | /transparency (EN+TR) | 404 error — **same issue for 4 audits**, root cause analysis required (see Audit Report Sec. 2.7)       | ✅ Resolved | Audit v1           | 2026-06-23    | Dashboard Jun2026 |
| ALP-004 | About → /en/en/submit | Double-locale ("/en/en/") broken link, drops user to 404                                                | ✅ Resolved | Audit v4 (approx.) | 2026-06-23    | Dashboard Jun2026 |

## P1 — Trust / Conversion Risk

| ID      | Page/Area                    | Issue                                                                                                       | Status                               | First Reported     | Last Verified           | Source               |
| ------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------ | ----------------------- | -------------------- |
| ALP-005 | Leaderboard                  | "ALPAR Autopilot" score is calculated and ranks first, unfair                                               | ✅ Resolved                          | Audit v5 (approx.) | 2026-06-23              | Dashboard Jun2026    |
| ALP-006 | Incidents vs Dilemmas        | "Polls" poll questions are still in English (database i18n bug)                                             | 🟡 Open                              | Audit v2           | 2026-06-23              | Dashboard Jun2026    |
| ALP-007 | Homepage CTA                 | "Become a Founding Reporter" button links to `/en/suggestions`; should be a dedicated sign-up/reporter page | ✅ Resolved                          | Audit v4 (approx.) | 2026-06-23              | Dashboard Jun2026    |
| ALP-008 | Footer                       | (Blog, Dilemmas) "Suggestions" links to `/en/dilemmas`                                                      | ✅ Resolved                          | Audit v4 (approx.) | 2026-06-23              | Dashboard Jun2026    |
| ALP-009 | Statistics                   | "Upvote" and "View" counts remain 0 in the database (event tracking might not be functional)                | 🟡 Open                              | Audit v5 (approx.) | 2026-06-23              | Dashboard Jun2026    |
| ALP-010 | Homepage "Featured/Cited In" | MIT Tech Review / Stanford / Ars Technica logos — actual article links not verified                         | ✅ Resolved                          | Audit v2           | 2026-06-23              | Dashboard Jun2026    |
| ALP-011 | About Page                   | Content sparse (4 bullets): missing founder photo, CTO profile, founding date, manifesto, team              | ✅ Resolved                          | Audit v3 (approx.) | 2026-06-23              | Dashboard Jun2026    |
| ALP-012 | /tr/\* translations          | Raw i18n key (`contact.form.name*`) leakage in contact form                                                 | ✅ Resolved                          | Audit v3 (approx.) | 2026-06-23              | Dashboard Jun2026    |
| ALP-013 | Mobile — Leaderboard/About   | Mobile/responsive behavior of the old design system is unknown                                              | 🟡 Open — LIVE VERIFICATION REQUIRED | This round         | Unverified (2026-06-23) | Ind. report Sec. 2.3 |

## P2 — Growth / Polish

| ID      | Page/Area                | Task                                                                                                 | Status  | Source            |
| ------- | ------------------------ | ---------------------------------------------------------------------------------------------------- | ------- | ----------------- |
| ALP-014 | Incidents                | X/LinkedIn share buttons + auto-generated OG cards for each incident                                 | 🔵 Open | Dashboard Jun2026 |
| ALP-015 | Dilemmas                 | 5 new questions: autonomous weapons, self-driving cars, biometric surveillance, AGI governance, etc. | 🔵 Open | Dashboard Jun2026 |
| ALP-016 | /en/developers (new)     | Developer API layer, $99/mo tier                                                                     | 🔵 Open | Dashboard Jun2026 |
| ALP-017 | invest.alparai.com (new) | Single-page investor portal                                                                          | 🔵 Open | Dashboard Jun2026 |
| ALP-018 | Incidents (general)      | Increase incident count from 100 to 400, populate all AIID categories                                | 🔵 Open | Dashboard Jun2026 |

## ✅ Resolved and Verified

| ID       | Description                                                                                    | Verifying Round                             |
| -------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------- |
| ALP-000a | /incidents page was completely empty → added 400+ real, published cases                        | Dashboard Jun2026 (prev vs curr comparison) |
| ALP-000b | Homepage/Incidents/Blog/Dilemmas nav+footer inconsistency → resolved on 4 pages                | Dashboard Jun2026                           |
| ALP-000c | Dilemmas page was missing → created, live voting is active (flagship question has 2,680 votes) | Dashboard Jun2026                           |

---

## Order of Priority for Antigravity

1. ALP-001 → ALP-004 (P0s, total estimated effort: under 1 working day)
2. ALP-005, ALP-010 (cheapest reputation-risk fixes — removal/link addition, minimal code changes)
3. ALP-006, ALP-007, ALP-008 (redirection/label fixes)
4. ALP-009, ALP-011 (medium effort, P1)
5. ALP-012, ALP-013 — **run live verification first, then fix** (not yet confirmed)
6. P2 list — move to growth sprint

## Rules for Updating This File

At the end of each new AI audit: (1) add newly found issues with an ascending ID, (2) update the "Last Verified" date for existing open items, (3) if an item is no longer visible, set its status to 🟢 (not ✅ — see README.md).
