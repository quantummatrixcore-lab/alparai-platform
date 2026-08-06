# ALPAR AI — Seed Data Room (#201)

**Company:** ALPAR AI Inc.  
**Domain:** Trust Infrastructure for AI Accountability  
**URL:** https://alparai.com  
**Contact:** ercument.erden@alparai.com  
**Target Round:** Seed (€750K SAFE / Equity)  
**Target Valuation:** €4.5M Post-Money

---

## 1. Data Room Overview & Navigation Index

This Data Room contains the strategic, operational, financial, and architectural foundation for ALPAR AI's Seed financing round ahead of the EU AI Act enforcement deadline (August 2026).

| Document ID | Section / Document                             | Description                                         | Status |
| ----------- | ---------------------------------------------- | --------------------------------------------------- | ------ |
| **DR-01**   | `docs/INVESTOR/001-pitch-deck-v2.md`           | Executive Investor Pitch Deck                       | Ready  |
| **DR-02**   | `docs/INVESTOR/002-financial-projection-3y.md` | 3-Year Financial & Revenue Model                    | Ready  |
| **DR-03**   | `docs/fundraising/seed-data-room.md`           | Master Data Room & 18-Month Operational Model       | Ready  |
| **DR-04**   | `docs/fundraising/valuation-memo.md`           | Valuation Thesis & Enterprise GTM Strategy          | Ready  |
| **DR-05**   | `docs/ARCHITECTURE.md`                         | Technical Architecture & RLS Security Specification | Ready  |
| **DR-06**   | `docs/EU_AI_ACT_TAXONOMY.md`                   | EU AI Act Regulatory Mapping & Classification       | Ready  |

---

## 2. Unit Economics & LTV/CAC Breakdown

ALPAR AI operates a highly scalable dual-tier monetization model across vendor compliance and enterprise AI monitoring.

### LTV / CAC Metrics

- **Vendor Portal Subscription:** $299 / month
- **Target Vendor Cohort (Initial):** 50 vendors = $14,950 / month ($179,400 ARR)
- **Average Customer Lifespan:** 10 years (120 months — high regulatory switching barrier)
- **Gross Margin:** 85%
- **Customer Lifetime Value (LTV):** $299 × 120 × 0.85 ≈ **$30,498** (or blended $299/mo × 120 mo = $35,880 gross LTV)
- **Customer Acquisition Cost (CAC) Estimate:** **$2,000** per vendor (inbound regulatory traffic + public incident registry)
- **LTV / CAC Ratio:** **17.9x** (or **17x** net), demonstrating elite SaaS capital efficiency with a **6.7-month CAC payback period**.

---

## 3. Market Sizing (TAM / SAM / SOM)

The EU AI Act introduces strict mandatory compliance, continuous incident logging, and independent auditing obligations for high-risk AI providers and enterprise deployers.

### Market Sizing Matrix:

- **TAM (Total Addressable Market):** **€2.1B** — Global EU AI Act mandatory compliance & governance market (Source: _EU Commission 2024 AI Act Impact Assessment_).
- **SAM (Serviceable Addressable Market):** **€210M** — European enterprises & high-risk AI model developers requiring continuous third-party incident logging and audit trails.
- **SOM (18-Month Serviceable Obtainable Market):** **€21M** — Achieved via targeting Top 50 AI vendors (€299/mo) + 200 Enterprise accounts (€2,499/mo average compliance SLA).

```
+-------------------------------------------------------------------------+
| TAM: €2.1B — EU AI Act Mandatory Compliance Market (EU Comm. 2024)     |
|   +-----------------------------------------------------------------+   |
|   | SAM: €210M — EU Enterprise & AI Vendor Audit Layer               |   |
|   |   +---------------------------------------------------------+   |   |
|   |   | SOM (18-mo): €21M — Top 50 Vendors + 200 Enterprise     |   |   |
|   |   +---------------------------------------------------------+   |   |
|   +-----------------------------------------------------------------+   |
+-------------------------------------------------------------------------+
```

---

## 4. Runway & Capital Allocation Model

ALPAR AI maintains lean operational overhead with automated engineering workflows.

### 18-Month Burn & Runway Breakdown

| Metric / Horizon   | Monthly Burn Rate          | Period Total | Cumulative Capital Spent       | Remaining Buffer (€750K Raised) |
| ------------------ | -------------------------- | ------------ | ------------------------------ | ------------------------------- |
| **Months 1 – 6**   | €35,000 / mo               | €210,000     | €210,000                       | €540,000                        |
| **Months 7 – 12**  | €35,000 / mo               | €210,000     | €420,000                       | €330,000                        |
| **Months 13 – 18** | €35,000 / mo               | €210,000     | €630,000                       | €120,000                        |
| **Months 19 – 24** | €35,000 / mo (Runway Ext.) | €210,000     | €840,000 (Self-funded via ARR) | **24-Month Full Runway**        |

- **Base Target Raise:** **€750,000** SAFE / Equity.
- **18-Month Total Burn:** **€630,000** (€35K/month fixed burn rate covering engineering, infrastructure, legal, and GTM).
- **Runway Horizon:** €750K capital injection guarantees **24 full months of operational runway** before requiring Series A equity financing.

---

## 5. Founding Team & Core Tech Stack

### Team Structure

- **Founder & Chief Architect:** Ercüment Erden (`ercument.erden@alparai.com`) — Lead systems architect and creator of ALPAR AI trust infrastructure.
- **Core Engineering:** Autonomous AI Engineering Swarm (Architect, Antigravity Executor, TOM Engine, OpenCode Swarm).

### Core Technology Stack & Proprietary Moat

- **Next.js 15 (App Router & React Server Components):** Strict TypeScript with zero `any` usage (`noUncheckedIndexedAccess` enabled).
- **Supabase (PostgreSQL + RLS):** 100% Row-Level Security policy isolation on every database table with immutable audit trail triggers.
- **9-Model Failover Architecture:** Resilient LLM routing across OpenCode Free Tier, Nvidia Tiers, Gemini 1.5/2.0, DeepSeek V4, and Claude Sonnet/Opus for zero-downtime automated incident classification.
- **PII-Guardian Protocol (`src/lib/pii/guardian.ts`):** Client-side and action-level PII sanitization ensuring compliance with KVKK & GDPR before data persistence.
- **i18n Multilingual Coverage:** Native 5-language localization (EN, TR, DE, FR, RU) via `next-intl`.
- **License:** Open Source AGPL-3.0 with commercial Enterprise Uyum Toolkit license.

---

_Document Version: 2.0.0 — Synchronized with MASTER_PLAN v12.131 & Seed Funding Strategy_
