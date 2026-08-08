# OPUS ARCHITECTURAL BRIEFING — ALPAR AI PLATFORM
**Date:** 2026-08-08  
**Target:** Strategic Architectural Verdict & Guidance  
**Repository:** `d:\Alparai` (`quantummatrixcore-lab/alparai-platform`)

---

## 1. System Overview & Tech Stack
- **Framework:** Next.js 15 (App Router, Server Actions only for state mutation)
- **Database:** Supabase PostgreSQL (`alparai-prod`, region `eu-west-1`) with Row-Level Security (RLS) on all tables
- **Styling:** Tailwind CSS v4 (`@theme inline` in `src/app/globals.css`)
- **Localization:** `next-intl` (Public routes: EN, TR, DE, FR, RU | Admin routes: EN, TR)
- **Hosting:** Vercel PRO (`alparai-com`, region `fra1`)
- **License:** AGPL-3.0

---

## 2. Security & Compliance Controls
1. **PII Guardian:** All user-submitted free-text passes through `src/lib/pii/guardian.ts` prior to DB persistence.
2. **Zero Knowledge Logging:** No raw IP, email, or PII logged. Hashing & timing-safe comparisons enforced.
3. **Corporate Communications:** All emails strictly dispatched via `ercument.erden@alparai.com` / `hello@alparai.com` via Resend API.

---

## 3. Active CLI Swarm Autopilot Maintenance Tasks
- **Task A (Log Cleanliness Audit):** Scanning `src/` and `docs/` for raw `console.log` / PII trace leakage.
- **Task B (PII Guardian Validation):** Verifying regex coverage for TC Kimlik, email, phone, and credit card patterns.
- **Task C (SEO & Meta i18n):** Verifying multi-locale `title` and `description` meta tag coverage across public pages.

---

## 4. Strategic Questions for Opus / Senior Architect
1. What edge computing or edge middleware strategies should be prioritized as user traffic scales across EN/TR/DE/FR/RU regions?
2. Are there any potential RLS performance bottlenecks in Supabase given full-text search trigger vectors on `incidents`?
3. Recommended steps for expanding automated E2E test coverage on Playwright with zero paid token footprint.
