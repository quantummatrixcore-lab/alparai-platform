# E2E Coverage Charter

## Coverage Summary (17 spec files, ~39 test cases)

| Area             | Spec                                   | Tests | Coverage                                                |
| ---------------- | -------------------------------------- | ----- | ------------------------------------------------------- |
| Homepage         | `critical-flows.spec.ts`               | 2     | Hero, live feed, leaderboard, language switch           |
| Homepage CTA     | `flows/homepage-cta.spec.ts`           | 4     | CTA visibility (EN+TR), navigation, LIVE badge          |
| Submit           | `flows/submit.spec.ts`                 | 3     | URL extraction API, form rendering, anonymous email     |
| User Journey     | `flows/user-journey.spec.ts`           | 1     | Submit nav, form validation, consent                    |
| SSE Submit       | `flows/sse-submit.spec.ts`             | 1     | Full SSE mocks, stage progression, redirect             |
| PII + Rate Limit | `flows/pii-flow.spec.ts`               | 3     | PII form, rate-limit 429, circuit-breaker 503           |
| Incident Detail  | `flows/incident-detail.spec.ts`        | 4     | Render, share buttons, voting, language switch          |
| Provider Respond | `flows/provider-respond-token.spec.ts` | 2     | Invalid/valid token paths                               |
| Admin            | `flows/admin-journey.spec.ts`          | 4     | Auth gates: /admin, /autopilot, /incidents, /moderation |
| i18n             | `flows/i18n.spec.ts`                   | 1     | EN↔TR language switch, html lang attr                   |
| Navigation       | `flows/nav.spec.ts`                    | 1     | Academy link (desktop + mobile)                         |
| AI Act           | `flows/ai-act.spec.ts`                 | 1     | Filter/pagination on tracker                            |
| Transparency     | `flows/transparency.spec.ts`           | 1     | Stat cards rendering                                    |
| Unsubscribe      | `flows/unsubscribe-cap.spec.ts`        | 5     | Token gen, GET/POST, invalid token                      |
| SEO              | `seo.spec.ts`                          | 9     | Meta tags, JSON-LD, robots.xml, sitemap, OG             |
| Layout           | `layout.spec.ts`                       | 8     | Mobile overflow on 8 key pages                          |
| Accessibility    | `a11y/accessibility.spec.ts`           | 5     | Axe WCAG 2.2 AA on 5 critical pages                     |
| Visual Regr.     | `visual/screenshot-diff.spec.ts`       | 8     | Screenshot comparison on 8 key pages                    |

## Gap Analysis

### Covered paths (42 routes tested across all specs)

`/`, `/submit`, `/incidents/[id]`, `/incidents/[id]/respond`, `/ai-act`,
`/transparency`, `/leaderboard`, `/academy`, `/blog`, `/blog/[slug]`,
`/unsubscribe`, `/auth/signin`, `/legal/privacy`, `/legal/takedown`,
`/incidents`, `/ratings`, `/methodology/k-benchmark`, `/bounties`,
`/status`, `/legal`, `/admin`, `/admin/moderation`, `/admin/incidents`,
`/admin/autopilot`, `/admin/autopilot/analytics`

### Uncovered paths — HIGH priority

| Route                            | Traffic | Risk          | Why needed                            |
| -------------------------------- | ------- | ------------- | ------------------------------------- |
| `/en/admin/users`                | Staff   | Auth + render | Admin users table with role filter    |
| `/en/admin/audit`                | Staff   | Auth + render | Audit log with filters + detail panel |
| `/en/admin/feature-flags`        | Staff   | Auth + render | New placeholder page                  |
| `/en/admin/geo`                  | Staff   | Auth + render | New placeholder page                  |
| `/en/admin/health`               | Staff   | Auth + render | New placeholder page                  |
| `/en/admin/marketing`            | Staff   | Auth + render | New placeholder page                  |
| `/en/dashboard/*` (4 dashboards) | User    | Auth + render | Compliance, Journalist, Legal, Safety |
| `/en/settings`                   | User    | Auth + render | Profile settings page                 |
| `/en/my-incidents`               | User    | Auth + render | User's own incidents                  |
| `/en/profile`                    | User    | Auth + render | User profile                          |
| `/en/pricing`                    | Visitor | Conversion    | Pricing page rendering                |
| `/en/contact`                    | Visitor | Conversion    | Contact form submits                  |
| `/en/blog/[slug]`                | Visitor | SEO           | Blog post rendering                   |

### Under-covered paths — MEDIUM priority

| Route                          | Coverage gap                                          |
| ------------------------------ | ----------------------------------------------------- |
| `/en/admin/*` (all sub-routes) | Only auth redirect tested, no authenticated rendering |
| `/en/submit`                   | No end-to-end submit (SSE spec mocks network)         |
| `/en/dilemmas`                 | Not tested                                            |
| `/en/feed`                     | Not tested                                            |
| `/en/experts`                  | Not tested                                            |
| `/en/bounties`                 | In visual diff only                                   |
| `/en/incidents/[id]/embed`     | Not tested                                            |

### Missing test types

| Type                        | Missing                                |
| --------------------------- | -------------------------------------- |
| Authenticated flows         | No login + session E2E                 |
| Admin pages (authenticated) | Zero admin content tests               |
| Form submission             | No real end-to-end incident submission |
| Search functionality        | Not tested                             |
| Error pages (404, 500)      | Not tested                             |

## Coverage percentage estimate

- **Routes with any test**: ~25/90 (~28%)
- **Critical public routes covered**: ~12/15 (80%)
- **Admin routes covered**: 4/25 (16%) — auth redirect only
- **Auth-gated routes covered**: 0/10 (0%)

## Recommended next tests (by priority)

1. Admin authenticated rendering: `/admin/users`, `/admin/moderation`, `/admin/audit`
2. Settings page: `/en/settings` layout + auth gate
3. Dashboard routes: `/en/dashboard/compliance`
4. Blog detail: `/en/blog/[slug]` rendering
5. Contact form: `/en/contact` submission flow
6. Pricing page: `/en/pricing` tiers rendering
