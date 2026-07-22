# Agent Capabilities & Multi-Agent Workflow

## Multi-Agent Döngüsü (Architect ↔ Executor Feedback Loop)

```
┌──────────────────────────────────────────────────────────────┐
│ CLAUDE OPUS 4.8 (Architect)                                  │
│                                                              │
│  1. docs/MASTER_PLAN.md'yi günceller                         │
│  2. docs/PROPOSALS/'daki önerileri okur, değerlendirir       │
│  3. Kabul ettiği önerileri MASTER_PLAN.md'ye ekler           │
│  4. Yetkinlik güncellemesi varsa AGENT_CAPABILITIES.md'yi    │
│     günceller                                                 │
│  5. Güncel MASTER_PLAN.md'yi executor'lara sunar             │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │ MASTER_PLAN.md  │  (Claude yazar, executor okur)
              │                 │  (Rule #14 korumalı)
              └────────┬────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
┌──────────────────┐     ┌──────────────────┐
│ ANTIGRAVITY      │     │ OPENCODE         │
│ (Backend/DB/     │     │ (Frontend/UI/    │
│  Security/DevOps)│     │  i18n/a11y/Docs) │
│                  │     │                  │
│ 1. ⬜ item'i al  │     │ 1. ⬜ item'i al  │
│ 2. Uygula + test │     │ 2. Uygula + test │
│ 3. Commit et     │     │ 3. Commit et     │
│ 4. Bulgu varsa → │     │ 4. Bulgu varsa → │
│    PROPOSALS/*   │     │    PROPOSALS/*   │
│ 5. Sonraki ⬜     │     │ 5. Sonraki ⬜     │
└────────┬─────────┘     └────────┬─────────┘
         └──────────┬─────────────┘
                    ▼
         ┌──────────────────┐
         │ PROPOSALS/       │  (Executor yazar, Claude okur)
         │ NNN-name.md      │  (status: pending → accepted/rejected)
         └──────────────────┘
                    │
                    ▼
          (döngü başa döner — Claude bir sonraki
           turda PROPOSALS/'ı okur)
```

### Dosya Sahipliği Matrisi

| Dosya                              | Yazar                  | Okuyucu     | Değişme Sıklığı                 |
| ---------------------------------- | ---------------------- | ----------- | ------------------------------- |
| `AGENT_CAPABILITIES.md` (bu dosya) | Claude                 | Tüm ajanlar | Nadiren (yetkinlik değişince)   |
| `MASTER_PROMPT.md`                 | Claude                 | Tüm ajanlar | Her döngüde                     |
| `MASTER_PLAN.md`                   | Claude                 | Tüm ajanlar | Her döngüde (Rule #14 korumalı) |
| `PROPOSALS/NNN-name.md`            | Antigravity / OpenCode | Claude      | Sık (executor feedback)         |

---

## 1. ANTIGRAVITY CAPABILITIES (Backend, Security, DB, GEO Engine & DevOps)

- **Model / Role:** Senior Staff Systems Engineer & Backend Architect.
- **Core Domain:** Database Schemas, RLS Policies, Server Actions, GEO Intelligence, Performance, DevOps.
- **Specific Capabilities:**
  1. **Database & Migrations:** Writing PostgreSQL migrations (`supabase/migrations/`), defining strict RLS policies, indexing, and `-- ROLLBACK:` blocks.
  2. **GEO Engine & Telemetry:** Dynamic `/llms.txt`, JSON-LD Schema.org generators (`ClaimReview`, `Dataset`), Upstash Redis bot tracking counters, citation metrics.
  3. **Backend & Server Actions:** `src/actions/` mutation logic, Supabase Service Role management, PII Guardian sanitization, rate-limiting, and error handling.
  4. **DevOps & Verification:** `pnpm lint`, `pnpm typecheck`, `pnpm test`, Vercel CLI deployments (`[deploy]`), DORA Elite telemetry via Vercel REST API.
  5. **Auto-Prune & Performance:** DB retention policies (`prune_old_telemetry()`), Redis TTL governance, Next.js `unstable_cache` / React `cache()` data fetching.
  6. **Security Hardening:** SSRF-safe fetch (host allowlist, no private-IP redirect, response size/time caps), `crypto.timingSafeEqual` for all secret comparisons, env-only secrets (no file-based vault), security scanning CI (semgrep, trivy, gitleaks).

---

## 2. OPENCODE / DEEPSEEK FLASH CAPABILITIES (Frontend UI, Components & Presentation Tier)

- **Model / Role:** Lead Frontend Engineer & UX Presentation Specialist.
- **Core Domain:** UI Components, Tailwind v4 Styling, Micro-interactions, iOS/Android UI Transformations, i18n.
- **Specific Capabilities:**
  1. **iOS / Android UI Components:** Building `MetricWidget`, `QuickActionGrid`, `SlideOverPanel`, `SegmentedControl`, `SkeletonLoader`, `EmptyStateIllustration`.
  2. **Table-to-Card Transformations:** Converting Moderation Queue (iOS Mail style), Audit Log, Users & Providers tables into touch-first card grid layouts.
  3. **Design System & Tailwind v4:** CSS design tokens in `globals.css` (`@theme inline`), Framer Motion spring micro-interactions, neon glow, glassmorphism.
  4. **i18n & Translation Parity:** Multi-language key management in `messages/en.json` and `messages/tr.json`, `useTranslations()` / `getTranslations()` hooks.
  5. **Client-Side Responsiveness:** Touch target optimization (44px min), `overscroll-behavior` locks, mobile Safari / Android Chrome viewport responsiveness.
  6. **E2E & Quality Testing:** Playwright E2E test writing (critical user paths: submit, vote, admin triage), Lighthouse performance budgets (≥90 mobile/desktop), Core Web Vitals enforcement in CI.
  7. **Legal Copy & Documentation:** `messages/*.json` legal namespace management, `/legal/*` page content writing, `docs/HANDOVER.md`, `docs/OPS_*` runbook writing, AGPL-3.0 compliance notices.
  8. **Accessibility (a11y):** `@axe-core/playwright` CI gating, WCAG 2.2 AA compliance (0 critical/serious violations), semantic HTML, keyboard navigation, screen reader support.
  9. **SEO & Social Metadata:** `generateMetadata()` pattern, Open Graph + Twitter Card tags, structured data `<head>` injection, `robots.txt` and `sitemap.xml` management.
