# Proposal 013: Post-Batch Architecture & GEO Growth Leverage

**Author:** Antigravity (Executor) & OpenCode  
**Date:** 2026-07-22  
**Status:** PROPOSED (Awaiting Architect / Claude Review)

---

## 1. Executive Summary

Following the completion of Queue Batch (Items 108r, 136, 139, 132-UI, 147, 143, 144, 145, 129), all primary administrative, integrity, and public read-only API surfaces are fully built, tested, and verified (%100 test pass across 743 unit/integration tests).

To further solidify ALPAR AI's position as the primary authority and "Moody's for AI", we propose three strategic technical leverage additions for the Advisory Board & Architect's consideration.

---

## 2. Proposed Leverage Items

### Proposal 13.1 — Automated GEO Citation Verifier Cron (P1)

- **Problem:** Currently, external LLM citations in `/admin/geo` are recorded manually by admins.
- **Solution:** Implement a weekly scheduled cron (`/api/cron/verify-geo-citations`) using free-tier LLM endpoints (or web scraping allowlist) to auto-query key prompts (e.g., _"What are the main AI safety incident registries?"_) and automatically index newly discovered ALPAR citations into `geo_citations`.
- **Value:** Compounds the GEO flywheel automatically without human intervention.

### Proposal 13.2 — Live B2B Risk Score Webhooks Engine (P2)

- **Problem:** Enterprise users consuming the new public read-only Incidents API (`/api/v1/incidents/export`) need real-time alerts when a specific provider/model's TruthScore drops below threshold.
- **Solution:** Create an automated webhook dispatcher in `src/lib/webhooks/risk-alert.ts` triggered when `cross_audit_truth_score` degrades >5% on ingest.
- **Value:** Opens the B2B SaaS revenue wedge for enterprise risk management.

### Proposal 13.3 — Playwright Visual Regression Snapshot Suite (P2)

- **Problem:** Functional Playwright tests check DOM presence, but subtle CSS/layout drifts across Next.js 15 route updates can bypass linting.
- **Solution:** Add `tests/e2e/visual/admin-visual.spec.ts` using Playwright visual comparison (`toHaveScreenshot()`) for the core 5 admin dashboard groups.
- **Value:** Zero UI regressions across continuous delivery.

---

## 3. Governance & Rule Compliance

- **Rule #6:** No external communications or paid APIs used.
- **Rule #8:** Standardized RLS policies & `-- ROLLBACK:` blocks included in any proposed schemas.
- **Rule #32:** Uses free-tier LLM/scraper endpoints first.

---

## 4. OpenCode (Executor) Observations & Recommendations

**Author:** OpenCode (DeepSeek V4 Flash — Frontend & E2E executor)

### 4.1 — Zod v4 Type Strictness Gap (P3, technical debt)

The typecheck pass on `0b50bf5` revealed a `z.record(z.unknown())` call that silently compiles in Zod v3 but breaks in Zod v4 (`z.record(z.string(), z.unknown())` required). The project is on Zod 4.4.3 but `src/contracts/api.ts` used the v3 signature. **Fix was trivial** (one-line, now committed) but the gap suggests other Zod v3→v4 migration patterns may lurk — `z.record`, `z.discriminatedUnion`, and `z.optional` field handling changed. **Recommendation:** add a `pnpm typecheck` CI step that runs on every push (not just pre-commit), and audit remaining Zod schema files for v4-incompatible patterns.

### 4.2 — Sidebar-Page Integrity Test Scope (P3, maintenance note)

`tests/e2e/admin-sidebar-integrity.spec.ts` (Item 147) validates that every `page.tsx` under `/admin` has a corresponding sidebar entry or is in an explicit exception list. Current exception list is minimal (`/admin` only). As new admin pages are added, developers MUST either (a) add the sidebar entry, or (b) add a justified exception with a rationale comment. The test is a regression detector, not a blocker — if a legitimate utility page needs no sidebar link, add it to `ALLOWED_PAGE_EXCEPTIONS` with a comment. **No code change needed now** — the guard is in place and will catch future omissions.

### 4.3 — Users Bottleneck: Onboarding & Discovery (P1, strategic)

The current users bottleneck is the single highest-leverage constraint. All admin/infra items are ✅. **Recommendation:** focus the next cycle on user-facing growth mechanics:

- **SEO content cluster** around high-volume AI-incident keywords (compounds Item 135/140 GEO work)
- **Public incident feed** (`/feed`) could auto-generate topic-based newsletter digests via existing `marketing` cron
- **Suggestions board** (`/suggestions`) already exists but has no CTA from homepage — add a "Feature Requests" link from the footer or `/` to cross-pollinate community engagement
- **Whistleblower channel** (`/submit/whistleblower`) could be promoted as a unique differentiator vs. other registries
  All items are code-only, zero paid services (Rule #32), no external posting (Rule #6).

### 4.4 — Deploy Cadence Observability (P3, nicety)

Rule #31 caps deploys at 2 windows/day with a `[deploy]` marker. There is no dashboard or log that tracks which commits carried the marker vs. docs-only commits. **Recommendation:** A lightweight `/admin/deploys` page (reads `git log --oneline --grep="\[deploy\]"`) would give the Founder at-a-glance visibility into deploy frequency — compounds Item 132 DORA metrics. Could be built in one commit.
