# Changelog

All notable changes to ALPAR AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-05

### Added
- Community-driven AI incident reporting system
- Google OAuth & magic link authentication
- PII Guardian: automatic personal data detection & masking (email, phone, TC kimlik, IBAN, credit card, API keys)
- Full-text search with tsvector + pg_trgm
- AI provider leaderboard with real-time ranking
- Community suggestions & voting system
- KVKK/GDPR-compliant consent management
- Takedown request workflow (DSA Article 16 compliant)
- Admin moderation dashboard with audit logging
- Upstash Redis rate limiting (sliding window)
- Row-Level Security on all Supabase tables
- Internationalization (English + Turkish) via next-intl
- SEO: dynamic sitemap, robots.txt, OG images, PWA manifest
- Evidence upload with SHA-256 integrity hashing
- Content Security Policy headers
- Accessibility: prefers-reduced-motion, focus-visible rings
- Responsive design (mobile-first)

### Security
- Strict CSP headers (no unsafe-inline/eval)
- IP hashing (never store raw IPs)
- Server-only Supabase clients
- Zod validation on all server actions
- Rate limiting on auth, submissions, and API endpoints
