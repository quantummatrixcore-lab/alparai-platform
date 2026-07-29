# ALPAR AI — Community & Forum Launch Content

## 1. Hacker News (Show HN)

**Title:** Show HN: ALPAR AI – AGPL-3.0 AI Incident Registry & EU AI Act Compliance Infrastructure

**Body:**
Hey HN,

We built ALPAR AI (https://alparai.com) — an open-source trust infrastructure for AI accountability.

**The Problem:** Enterprise teams adopting LLMs face zero transparency regarding real-world model failure rates, jailbreak vulnerabilities, and EU AI Act compliance risks. Existing leaderboards focus purely on academic benchmarks rather than production incident safety.

**What ALPAR AI does:**

1. **Public Incident Registry:** Tracks and categorizes AI hallucinations, data leaks, and security failures. All user-submitted free text passes through a 14-category PII Guardian before DB insert.
2. **K-BENCHMARK Puanlaması:** Evaluates frontier models (OpenAI, Anthropic, Google, NVIDIA, etc.) on Wilson-score reliability metrics.
3. **EU AI Act Art. 73 Tracker:** Live tracking for serious incident reporting readiness (`/transparency/art-73-tracker`).

The codebase is Next.js 15 + Supabase + AGPL-3.0 on GitHub (https://github.com/quantummatrixcore-lab/Alparai.com).

We'd love to hear your feedback on our evaluation metrics and incident taxonomy!

---

## 2. Reddit (r/netsec & r/LocalLLaMA)

**Title:** ALPAR AI: Open-source AI incident database & vulnerability scoring for frontier models

**Body:**
Hi everyone,

We are launching ALPAR AI (https://alparai.com) as an open-source accountability layer for foundation models.

**Key Features:**

- **Adversarial Safety Evaluation:** Evaluation of jailbreak resilience and hallucination rates.
- **Privacy-First Ingestion:** Client-side & serverless PII masking (`src/lib/pii/guardian.ts`).
- **Open API & Public Datasets:** Full CSV/JSON dumps available for security researchers.

Check out the repo at https://github.com/quantummatrixcore-lab/Alparai.com. Constructive feedback and incident reports are highly appreciated!
