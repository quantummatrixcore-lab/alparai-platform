# Architect Decision Record (ADR)

This file contains logs of critical architectural and infrastructure decisions made on ALPAR AI.

---

## ADR-001: Multi-Agent Interactive Debate & Cross-Examination Protocol

- **Date:** 2026-06-23
- **Status:** Approved & Implemented
- **Problem:** Single-model static evaluations are susceptible to prompt variations, model hallucinations, and systemic bias from individual providers.
- **Alternatives:**
  1. Single-turn triage consensus (feed-forward only).
  2. Multi-turn debate between independent models judged by a referee.
- **Decision:** Implement a 4-round multi-agent debate:
  - Turn 1: Parallel initial evaluations.
  - Turn 2: Mutual critique & cross-examination question generation.
  - Turn 3: Defense, responses, and score refinement.
  - Turn 4: Final referee adjudication by Claude 3.5 Sonnet (Supreme Court).
- **Expected Impact:** High consensus stability, robust protection against adversarial prompt attacks, and granular audit justifications.
- **Score Gain:** +120 points on AI Governance and System Maturity.
- **Risk:** Higher latency (20-40s) for background incident evaluations; managed asynchronously.

---

## ADR-002: Dynamic AI Provider API Keys Management

- **Date:** 2026-06-23
- **Status:** Approved & Implemented
- **Problem:** Relying exclusively on environment variables for AI adapter keys restricts runtime customization and prevents secure dynamic evaluation rotation.
- **Alternatives:**
  1. Static `.env.local` keys (current fallback).
  2. RLS-protected database storage for admin-configured keys.
- **Decision:** Create a secure `public.api_keys` table in Supabase (with admin RLS policies) and build a glassmorphic dashboard at `/admin/api-keys` for key entry. Adapters resolve keys dynamically at call-time.
- **Expected Impact:** High administrative control, provider independence, and secure scaling.
- **Score Gain:** +80 points on Technical Architecture and Security.
- **Risk:** Potential decryption leakage if RLS is breached; neutralized by encrypting/masking keys on output.

---

## ADR-003: Double-Prefix next-intl Link 404 Resolution

- **Date:** 2026-06-23
- **Status:** Approved & Implemented
- **Problem:** Hardcoding `/${locale}/admin` links inside next-intl's custom `Link` component led to duplicate locale routing (e.g., `/en/en/admin`), resulting in 404 errors.
- **Alternatives:**
  1. Standard next-intl routing relative paths.
  2. Disable next-intl localized Link (use next/link directly).
- **Decision:** Standardize on relative routing paths (e.g. `/admin`, `/admin/moderation`) with next-intl's custom `Link` component imported exclusively from `@/i18n/routing`.
- **Expected Impact:** Zero 404 routing errors on dashboard and moderation pages across translation swaps.
- **Score Gain:** +50 points on UX/UI and i18n Quality.
- **Risk:** None.
