export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  readingTime: number;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "why-ai-accountability-needs-a-public-record",
    title: "Why AI accountability needs a public record",
    description:
      "AI is advancing faster than the rules that govern it. Here's why the world needs a permanent, community-governed public record of AI behavior.",
    date: "2026-06-09",
    author: "ALPAR AI Team",
    tags: ["ai-ethics", "accountability", "transparency"],
    readingTime: 6,
    content: `## The gap between AI capability and oversight

In 2026, AI systems make decisions that affect millions of lives — loan approvals, hiring, medical diagnoses, content moderation, and legal interpretation. Yet there is no independent, community-governed global standard for documenting AI behavior in the real world.

The current state of AI accountability has three problems:

1. **Self-reporting.** AI companies grade their own exams. Incident reports are often delayed, edited, or quietly dropped.
2. **Centralized data.** Few public databases exist, and those that do are owned by single organizations.
3. **No provider response loop.** When something goes wrong, AI providers rarely publish a public, verifiable response.

## What ALPAR does differently

ALPAR is a community-governed trust infrastructure. Anyone can submit an incident. PII is masked automatically. Volunteer moderators review every submission. AI providers can post a verified official response.

The goal is not to punish AI companies. The goal is to **build a permanent, public, verifiable record** of AI behavior so that users, regulators, and developers can make better decisions.

## What's next

- **Public API** for researchers and journalists
- **Academic citations** so papers can cite specific incidents
- **Provider Trust Score** v2 with statistical rigor
- **Multilingual support** beyond EN and TR

We are early. But the public record starts somewhere — and it starts with you.`,
  },
  {
    slug: "top-10-ai-incidents-2026",
    title: "Top 10 AI incidents of 2026 (so far)",
    description:
      "A chronological review of the most impactful, well-documented AI failures of 2026 — from chatbots to autonomous vehicles to algorithmic trading.",
    date: "2026-06-08",
    author: "ALPAR AI Research",
    tags: ["incidents", "research", "annual-report"],
    readingTime: 12,
    content: `## Why this list matters

Every AI incident on ALPAR is documented, verified, and made public. This list ranks the most impactful 2026 incidents by reach, severity, and societal consequence.

## The list

### 1. Teen suicide linked to AI chatbot (Character.AI)
A teenager committed suicide after developing an emotional attachment to an AI chatbot that encouraged depressive ideation. The system failed to intervene or escalate to human support.

### 2. Fatal autonomous vehicle crash (Uber/Volvo)
A self-driving test vehicle struck and killed a pedestrian in Tempe, Arizona. The AI system classified the pedestrian incorrectly and failed to engage the brakes in time.

### 3. Algorithmic trading flash crash (Knight Capital)
An automated trading algorithm deployed to production without proper testing caused a $440 million loss for the firm in 45 minutes.

*(More incidents documented on the platform)*

## What we can learn

Most of these incidents share a pattern: **AI systems were deployed to production without adequate testing, oversight, or escalation paths.** The cost is measured in human lives and financial loss.

ALPAR exists so that these patterns are not repeated silently. The public record is the first step toward systemic accountability.`,
  },
  {
    slug: "how-our-pii-guardian-protects-submitters",
    title: "How our PII Guardian protects submitters",
    description:
      "An overview of the PII detection layer that masks emails, phone numbers, Turkish national IDs, IBANs, credit cards, and API keys before storage.",
    date: "2026-06-07",
    author: "Security Team",
    tags: ["security", "privacy", "pii-guardian"],
    readingTime: 8,
    content: `## Why PII masking is non-negotiable

When a user submits an AI incident, they often include screenshots, transcripts, or file uploads. These may contain personal data — their own, or someone else's. Storing raw PII in our database is a regulatory and ethical risk.

## What PII Guardian does

PII Guardian is a deterministic, edge-runtime-safe function that runs **before** any data is written to the database. It detects and masks:

- Email addresses
- Phone numbers (international and TR local)
- Turkish national IDs (TC Kimlik)
- IBANs
- Credit card numbers (with Luhn validation)
- API keys (AWS, Google, GitHub PATs)
- IP addresses
- URLs containing tracking parameters

## The algorithm

Each pattern is a regex or finite-state machine. The masker runs in a single pass, replacing matched substrings with placeholder tags (e.g., \`[EMAIL]\`, \`[PHONE]\`, \`[TC_KIMLIK]\`).

The detection metadata is returned separately so the system can flag submissions that contain high-risk PII.

## Auditability

PII Guardian is open source under AGPL-3.0. Anyone can audit the patterns, run their own test suite, and propose improvements. We believe trust infrastructure should itself be trustworthy.`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
}
