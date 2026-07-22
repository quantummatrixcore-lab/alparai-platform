# Proposal 013: Post-Batch Architecture & GEO Growth Leverage

**Author:** Antigravity (Executor) & OpenCode  
**Date:** 2026-07-22  
**Status:** PROPOSED (Awaiting Architect / Claude Review)

---

## 1. Executive Summary

Following the completion of Queue Batch (Items 108r, 136, 139, 132-UI, 147, 143, 144, 145, 129), all primary administrative, integrity, and public read-only API surfaces are fully built, tested, and verified (%100 test pass across 743 unit/integration tests).

To further solidify ALPAR AI's position as the primary authority and "Moody's for AI", we propose four strategic technical leverage additions for the Advisory Board & Architect's consideration — including leveraging **Stitch MCP** for Antigravity-driven frontend UI design generation.

---

## 2. Proposed Leverage Items

### Proposal 13.1 — Automated GEO Citation Verifier Cron (P1)

- **Problem:** Currently, external LLM citations in `/admin/geo` are recorded manually by admins.
- **Solution:** Implement a weekly scheduled cron (`/api/cron/verify-geo-citations`) using free-tier LLM endpoints (or web scraping allowlist) to auto-query key prompts (e.g., _"What are the main AI safety incident registries?"_) and automatically index newly discovered ALPAR citations into `geo_citations`.
- **Value:** Compounds the GEO flywheel automatically without human intervention.

### Proposal 13.2 — Antigravity Frontend UI Generation via Stitch MCP (P1 - Founder Requested)

- **Problem:** Frontend UI layout iterations and design system alignment require high-fidelity design mocks before full i18n & E2E integration.
- **Solution:** Formally empower Antigravity (Gemini Flash) to utilize **Stitch MCP** (`generate_screen_from_text`, `edit_screens`, `create_design_system`) to generate pixel-perfect, premium frontend interfaces and design systems directly. OpenCode can then handle the mechanical i18n and Playwright test coverage.
- **Value:** Unlocks ultra-fast, premium UI creation using Gemini's multimodal and design capabilities, accelerating frontend shipping velocity.

### Proposal 13.3 — Live B2B Risk Score Webhooks Engine (P2)

- **Problem:** Enterprise users consuming the new public read-only Incidents API (`/api/v1/incidents/export`) need real-time alerts when a specific provider/model's TruthScore drops below threshold.
- **Solution:** Create an automated webhook dispatcher in `src/lib/webhooks/risk-alert.ts` triggered when `cross_audit_truth_score` degrades >5% on ingest.
- **Value:** Opens the B2B SaaS revenue wedge for enterprise risk management.

### Proposal 13.4 — Playwright Visual Regression Snapshot Suite (P2)

- **Problem:** Functional Playwright tests check DOM presence, but subtle CSS/layout drifts across Next.js 15 route updates can bypass linting.
- **Solution:** Add `tests/e2e/visual/admin-visual.spec.ts` using Playwright visual comparison (`toHaveScreenshot()`) for the core 5 admin dashboard groups.
- **Value:** Zero UI regressions across continuous delivery.

---

## 3. Governance & Rule Compliance

- **Rule #6:** No external communications or paid APIs used.
- **Rule #8:** Standardized RLS policies & `-- ROLLBACK:` blocks included in any proposed schemas.
- **Rule #14:** Proposal recorded in `docs/PROPOSALS/` for Architect review.
- **Rule #32:** Uses free-tier LLM/scraper endpoints and local Stitch MCP tools first.
