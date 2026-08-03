# ALPAR AI — Community & Forum Launch Content

> ⚠️ **NOTE:** HN "Show HN" and Reddit submissions are subject to Founder approval before publishing.

## 1. Hacker News (Show HN)

**Title:** Show HN: ALPAR AI – Open-Source AI Incident Registry

**Body:**
Hey HN,

We built ALPAR AI (https://alparai.com) — an open-source trust infrastructure for AI accountability.

**The Problem:** Enterprise teams adopting LLMs face zero transparency regarding real-world model failure rates, jailbreak vulnerabilities, and EU AI Act compliance risks. Existing leaderboards focus purely on academic benchmarks rather than production incident safety.

**What ALPAR AI does:**

1. **Public Incident Registry:** Tracks and categorizes AI hallucinations, data leaks, and security failures. All user-submitted free text passes through a 14-category PII Guardian before DB insert (`src/lib/pii/guardian.ts`).
2. **K-BENCHMARK Puanlaması:** Evaluates frontier models across 6 gateway adapters and 10+ model providers (OpenAI, Anthropic, Google, Meta, DeepSeek, NVIDIA, Cohere, etc.) on Wilson-score reliability metrics.
3. **EU AI Act Art. 73 Tracker:** Live tracking for serious incident reporting readiness (`/transparency/art-73-tracker`).

The codebase is Next.js 15 + Supabase + AGPL-3.0 on GitHub (https://github.com/quantummatrixcore-lab/Alparai.com).

We'd love to hear your feedback on our evaluation metrics and incident taxonomy!

---

## 2. Reddit

> 🛡️ **Self-Promotion Compliance:** Reddit subreddits enforce strict rules against raw promotional posts. r/netsec requires pure technical write-ups / security breakdowns. r/LocalLLaMA requires benchmark methodology & open dataset disclosures. Below are tailored, non-marketing posts for each target community.

### 2a. Reddit r/netsec (Technical Security & PII Ingestion Deep Dive)

**Title:** Technical Architecture of ALPAR AI: Open-Source PII Masking & AI Vulnerability Ingestion

**Body:**
Hi r/netsec,

We've open-sourced ALPAR AI (AGPL-3.0), a trust infrastructure designed to collect, sanitize, and score AI safety incidents and model vulnerabilities.

**Technical Highlights & Threat Model:**

- **Privacy-First Ingestion Pipeline:** User-submitted incident reports undergo 14-category client/server sanitization (`src/lib/pii/guardian.ts`) using regex and NLP masking (TCKN, credit cards, emails, IP addresses, names) before hitting PostgreSQL.
- **Row-Level Security (RLS):** Every Supabase database table enforces strict RLS policies; mutations strictly run via serverless Server Actions with zero direct client writes.
- **Wilson-Score Vulnerability Scoring:** Uses lower-bound Wilson confidence intervals to rank jailbreak resilience and hallucination severity across LLM providers.
- **Open Data & Datasets:** Public CSV/JSON dumps of anonymized incident reports for security researchers.

Code repository: https://github.com/quantummatrixcore-lab/Alparai.com

We welcome code audits, security feedback, and vulnerability taxonomy discussions!

---

### 2b. Reddit r/LocalLLaMA (Open Benchmarks & LLM Reliability Scoring)

**Title:** ALPAR AI: Open-source benchmark database for LLM hallucination and jailbreak rates

**Body:**
Hi r/LocalLLaMA,

We are launching ALPAR AI (https://alparai.com), an open-source platform tracking real-world failure modes and reliability metrics for both open-weights (Llama 3.3, DeepSeek R1/V3, Mistral, Qwen) and proprietary models.

**Key Features for the Open-Source LLM Community:**

- **K-BENCHMARK:** Evaluates real-world jailbreak resilience, context decay, and hallucination rates across 10+ model providers.
- **Open API & Public Datasets:** Raw anonymized incident datasets available in CSV and JSON formats.
- **Fully Open-Source (AGPL-3.0):** Built with Next.js 15 App Router, Supabase PostgreSQL, and Tailwind v4.

Repo: https://github.com/quantummatrixcore-lab/Alparai.com

We'd love to collaborate on open model evaluation datasets and custom benchmark suites!
