# ALPAR AI — Seed Data Room (#201)

**Company:** ALPAR AI Inc.  
**Domain:** Trust Infrastructure for AI Accountability  
**URL:** https://alparai.com  
**Contact:** ercument.erden@alparai.com  
**Target Round:** Pre-Seed / Seed (€500K–€750K SAFE / Equity)  
**Target Valuation:** €3.5M–€4.5M ($3.5M–$4.5M) Post-Money

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

## 2. Velocity-Indexed 18-Month Operational & Financial Model

ALPAR AI's operational growth is indexed against **Incident Registry Velocity** (weekly incident reporting rate, verification velocity, and API audit call volume).

### 18-Month Growth Matrix (M1 – M18)

| Metric / Milestone                       | M1 – M6 (Alpha & Pre-Launch) | M7 – M12 (EU AI Act Scaling)  | M13 – M18 (Enforcement & Expansion) |
| ---------------------------------------- | ---------------------------- | ----------------------------- | ----------------------------------- |
| **Monthly Active Incidents Indexed**     | 100 / mo (+15% MoM)          | 450 / mo (+25% MoM)           | 1,500+ / mo (+30% MoM)              |
| **Weekly Incident Velocity Index**       | 25 incidents / wk            | 110 incidents / wk            | 375+ incidents / wk                 |
| **Pro SaaS Tier Subscribers ($499/mo)**  | 15                           | 80                            | 180                                 |
| **Enterprise Audit Clients ($4,999/mo)** | 1                            | 3                             | 7                                   |
| **API Verification Calls / Month**       | 50,000                       | 350,000                       | 1,500,000+                          |
| **Run-Rate ARR**                         | **$149,800**                 | **$658,920**                  | **$1,498,920**                      |
| **Gross Margin**                         | 84.5%                        | 86.4%                         | 88.2%                               |
| **Team Size (FTE)**                      | 3 (2 Eng + 1 Founder)        | 5 (3 Eng + 1 GTM + 1 Founder) | 8 (5 Eng + 2 GTM + 1 Founder)       |

### Key Velocity Milestones:

- **Velocity Trigger A (M6):** Reach 100+ verified incidents indexed per month. Triggers Pro SaaS self-serve conversion.
- **Velocity Trigger B (M12):** Cross $650K ARR during the EU AI Act compliance rush. Enterprise tier expansion into FinTech/Insurance.
- **Velocity Trigger C (M18):** Exceed $1.49M ARR with 1,500+ monthly indexed AI incidents across tier-1 & tier-2 European AI models.

---

## 3. EU AI Act Market Opportunity & Compliance Mandate

The EU AI Act introduces strict obligations for high-risk AI systems and general-purpose AI (GPAI) models, enforcing mandatory incident logging, transparency, and independent auditing.

### Market Sizing Breakdown:

- **TAM (Total Addressable Market):** **€2.1B** (2027 global regulatory compliance & AI governance software market, source: Gartner AI governance forecast).
- **SAM (Serviceable Addressable Market):** **€210M** (Independent AI audit, real-time logging, and verification layer for EU-operating enterprises).
- **SOM (Serviceable Obtainable Market):** **€21M** (Targeting 10% penetration of early-adopter European FinTech, Healthcare, Insurance, and Enterprise SaaS providers by Y3).

```
+-------------------------------------------------------------------+
| TAM: €2.1B — Global EU AI Act Regulatory Compliance Market       |
|  +-------------------------------------------------------------+  |
|  | SAM: €210M — Independent AI Audit & Verification Layer       |  |
|  |   +-------------------------------------------------------+ |  |
|  |   | SOM: €21M — 10% Penetration in EU Enterprise/FinTech  | |  |
|  |   +-------------------------------------------------------+ |  |
|  +-------------------------------------------------------------+  |
+-------------------------------------------------------------------+
```

---

## 4. Unit Economics & LTV/CAC Targets

ALPAR AI maintains hyper-efficient capital allocation leveraging organic developer relations, automated benchmarks (K-BENCHMARK), and public incident transparency.

### Unit Economics Summary:

| Parameter                           | Pro SaaS Tier              | Enterprise Audit Tier         | Target Blend     |
| ----------------------------------- | -------------------------- | ----------------------------- | ---------------- |
| **Price Point**                     | $499 / month ($5,988 / yr) | $4,999 / month ($59,988 / yr) | Multi-tier blend |
| **Average Customer Lifespan**       | 24 months                  | 36 months                     | 30 months avg    |
| **Lifetime Value (LTV)**            | $11,976                    | $179,964                      | $45,570 avg      |
| **Customer Acquisition Cost (CAC)** | $850                       | $1,250                        | $950 avg         |
| **LTV : CAC Ratio**                 | **14.1 : 1**               | **143.9 : 1**                 | **47.9 : 1**     |
| **Payback Period**                  | 1.7 months                 | 0.25 months                   | 1.1 months       |
| **Gross Margin**                    | 86.4%                      | 91.2%                         | **87.5%**        |

---

## 5. Architecture Summary & Technical Moat

ALPAR AI is built as a zero-trust, enterprise-grade AI compliance platform designed for high performance and strict isolation.

### Technical Stack & Scale:

- **Core Framework:** Next.js 15 (App Router, Server Actions for all mutations).
- **Database & Security:** Supabase (PostgreSQL) with 100% RLS policy coverage on every table.
- **PII Protection:** Automated PII masking via `src/lib/pii/guardian.ts` before database insertion.
- **Localization:** 5-language public coverage (EN, TR, DE, FR, RU) via `next-intl`.
- **Proprietary Moat (TOM Token Budget Engine):** Physical boundary controls preventing LLM entropy and hallucination drift during automated audit reporting.
- **Scale Metrics:** 56+ spatial cockpit routes, 203+ automated migrations, 52 Server Actions, 0 `any` types (strict TypeScript).

---

## 6. Capital Allocation & Use of Pre-Seed Funds

**Target Raise:** €500,000 – €750,000 (SAFE / Equity)

| Allocation Category               | Percentage | Amount (€600K Base) | Primary Milestone                                                    |
| --------------------------------- | ---------- | ------------------- | -------------------------------------------------------------------- |
| **Engineering & AI Safety R&D**   | 60%        | €360,000            | Core platform expansion, K-BENCHMARK automated engine, TOM budget v2 |
| **Go-To-Market (GTM) & EU Sales** | 20%        | €120,000            | Big 4 channel reseller setup, enterprise sales engineering           |
| **Legal, Regulatory & Audit**     | 10%        | €60,000             | EU AI Act certification framework & advisory board setup             |
| **Operations & Infra**            | 10%        | €60,000             | Vercel Pro, Supabase Enterprise, LLM compute infrastructure          |

---

_Document Version: 1.0.0 — Synchronized with MASTER_PLAN v12.131_
