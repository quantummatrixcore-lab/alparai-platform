# ALPAR AI — Pre-Launch Master Update Plan (Dora Elite Level)

> **Version:** 2.0 — Full Pre-Launch Upgrade
> **Date:** June 24, 2026
> **Execution:** Google Antigravity (no code by Advisory Board)
> **Language:** English (all docs, all code comments)
> **Baseline Audit Score:** 985/1000 (Dora Elite Compliance)
> **Target After Updates:** 1000/1000 (Dora Absolute)

---

## MASTER PROMPT FOR ANTIGRAVITY

This document is the single source of truth for all pre-launch upgrades. It covers four major workstreams that must be executed in priority order:

1. **[WS-1] Social Media Module** — Admin panel + content system + ready-to-post assets
2. **[WS-2] Instagram-Style Activity Feed** — New `/feed` route + real-time engagement
3. **[WS-3] Copy & Psychology Upgrade** — Every user-facing text rewritten at elite level
4. **[WS-4] Visual & UX Dora Elite Upgrade** — Design system hardening, OG images, embeds

All four workstreams must be completed before LinkedIn launch. Priority: WS-3 → WS-2 → WS-1 → WS-4.

---

## WS-1: SOCIAL MEDIA MODULE

### 1.1 Architecture Overview

Create a dedicated social media system with two layers:

- **Admin Layer:** `/admin/social` — content calendar, post drafts, asset library, performance tracker
- **Content Layer:** `src/lib/social/` — post templates, image generation specs, platform adapters

### 1.2 Admin Panel: `/admin/social`

Add to sidebar (`src/components/admin/sidebar.tsx`) under a new "Growth" section:

```
Growth
├── /admin/social           → Social Media Hub
│   ├── /admin/social/calendar    → Content Calendar (30-day view)
│   ├── /admin/social/drafts      → Post Drafts (LinkedIn, X, Instagram)
│   ├── /admin/social/assets      → Image & Video Asset Library
│   ├── /admin/social/templates   → Post Templates by Type
│   └── /admin/social/analytics   → Engagement Tracker (manual entry)
```

**New Database Tables:**

```sql
social_posts
  - id (uuid)
  - platform (linkedin | x | instagram | facebook | whatsapp)
  - status (draft | scheduled | published | archived)
  - content_type (manifesto | case_study | weekly_report | incident_spotlight | thread | poll)
  - title (internal reference)
  - body_text (the actual post text)
  - image_prompt (for AI image generation via Google Imagen)
  - image_url (generated/uploaded image)
  - video_url (optional)
  - hashtags (text[])
  - linked_incident_id (FK → incidents, nullable)
  - scheduled_at (timestamp)
  - published_at (timestamp)
  - external_url (the live post URL after publishing)
  - estimated_reach (int, manual entry)
  - likes (int, manual entry post-publish)
  - comments_count (int, manual entry)
  - shares_count (int, manual entry)
  - created_by (FK → users)
  - created_at, updated_at

social_assets
  - id (uuid)
  - asset_type (image | video | carousel | reel | story)
  - title
  - file_url (Supabase Storage)
  - thumbnail_url
  - linked_post_id (FK → social_posts, nullable)
  - tags (text[])
  - created_at

social_templates
  - id (uuid)
  - name
  - platform (linkedin | x | instagram | all)
  - content_type
  - template_body (text with {{placeholders}})
  - example_output
  - psychology_hook (fear | authority | social_proof | urgency | scarcity | reciprocity)
  - created_at
```

### 1.3 Pre-Written Post Library (Ready to Publish)

All posts below must be stored in `social_posts` table as `status: 'draft'` and displayed in `/admin/social/drafts`. Antigravity seeds them via a migration.

**SERIES A: LAUNCH MANIFESTO (Day 0)**

```
Platform: LinkedIn
Type: manifesto
Title: Hook Post — Grok Passport

Body:
I asked an AI for help with a passport application.

It walked me through every step. Documents needed.
How to expedite. What to say at the interview.
All of it. Instantly. With complete confidence.

[Image: Grok passport screenshot]

Is this a feature?
Is this a risk?
Who gets to decide?

For 18 months, no platform existed to document these moments.
No public record. No accountability. No warning for the next person.

Today that changes.

👉 alparai.com

#AIAccountability #ResponsibleAI #EUAIAct

---

Platform: LinkedIn
Type: manifesto
Title: Story Post — Why I Built This

Body:
In early 2026, an AI told me it had incorporated my company.

Made payments on my behalf.
And was now requesting my passport for "verification."

Every word was fabricated.

I tried to report it. There was nowhere to go.
I tried to warn others. There was no platform.
I tried to find who else this happened to. Impossible.

So I spent 18 months building the infrastructure I wish existed.

ALPAR AI is a community-governed, EU-hosted, GDPR-compliant
platform where AI failures are documented, verified, and made
impossible to ignore.

Beta is live. The first 100 reporters earn the Founding Reporter badge.
That's permanent recognition in the public record.

👉 alparai.com
#AIAccountability

---

Platform: LinkedIn
Type: manifesto
Title: Product Post — What It Does

Body:
ALPAR AI in 60 seconds:

1/ An AI system harms, lies, or manipulates → you report it.
   Takes 60 seconds. No login required. Fully anonymous if you choose.

2/ The community verifies → moderators review, AI cross-audits.
   Every claim gets a truth score. No unchecked accusations.

3/ The AI provider must respond publicly → or face permanent scrutiny.
   Their silence is also data.

4/ The public record is permanent → regulators, researchers, journalists
   can access it forever.

This week only: First 100 incidents earn Founding Reporter status.
→ Permanent badge. Platform voting rights. All premium features free.

👉 alparai.com/submit

#AIAccountability #ResponsibleAI #EUAIAct #StartupTurkey
```

**SERIES B: CASE STUDIES (Week 1-2)**

```
Platform: LinkedIn + X
Type: case_study
Title: Air Canada Chatbot

Body:
Air Canada's chatbot told a passenger he could get
a bereavement fare AFTER his mother's funeral.

He booked the flight. Paid full price. Then asked for the refund.
The airline said: "The chatbot made a mistake. Not our problem."

A Canadian tribunal disagreed.
Air Canada was ordered to pay.

But how many others didn't sue?
How many just... accepted it?

That's why ALPAR AI exists.
One database. Every case. Public forever.

👉 alparai.com/incidents

---

Platform: LinkedIn + X
Type: case_study
Title: NYC Chatbot Illegal Advice

Body:
New York City's official government chatbot
advised small business owners to break the law.

Not "potentially illegal."
Actually illegal. Documented. Verified.

When city governments can't trust their own AI tools,
what hope does a regular citizen have?

The answer isn't to stop using AI.
The answer is to hold it accountable.

That's ALPAR AI.

👉 alparai.com/incidents
```

**SERIES C: WEEKLY REPORTS (Ongoing)**

```
Platform: LinkedIn
Type: weekly_report
Title: Week 1 Transparency Report

Body:
ALPAR AI — Week 1 Report

This week:
→ [N] incidents reported
→ [N] incidents verified and published
→ [N] AI providers notified
→ [N] provider responses received
→ [N] countries represented

Most reported category: [CATEGORY]
Highest truth score: [TITLE] ([SCORE]/100)
Provider with fastest response: [PROVIDER]

We publish these numbers every week.
No cherry-picking. No spin.
Because transparency is the product.

👉 alparai.com/transparency
```

**SERIES D: INCIDENT SPOTLIGHTS**

```
Platform: X (thread format)
Type: incident_spotlight
Title: Thread Template — AI Incident

Body:
🧵 [Thread] One AI incident that should concern you:

1/ [INCIDENT TITLE]
Provider: [PROVIDER NAME]
Category: [CATEGORY]
Severity: [LEVEL]

2/ What happened:
[2-3 sentence description from masked title/description]

3/ What the AI said vs. what was true:
[Contrast if available]

4/ Community verdict:
Truth Score: [SCORE]/100
Upvotes: [N] | Comments: [N] | "Me Too": [N]

5/ Provider response:
[Response text OR "No response yet. [X] days since notification."]

6/ Why this matters:
[1-2 sentences on systemic impact]

7/ Full incident + evidence: 👉 alparai.com/incidents/[ID]
```

### 1.4 Google Ecosystem Integration (Stitch MCP)

If Stitch MCP is available in Antigravity's environment, use it to:

1. **Google Imagen 3** — Generate social post images from `image_prompt` field
   - Spec: 1080×1080 (Instagram/LinkedIn), 1200×628 (LinkedIn article), 1600×900 (X)
   - Style prompt: "Dark navy background, purple and cyan accent, professional infographic style, ALPAR AI branding, [incident title], bold sans-serif typography"
   - Auto-save generated images to Supabase Storage under `/social-assets/generated/`

2. **Google Docs / Drive** — Export post drafts to Google Docs for founder review before publishing
   - Auto-create a Google Doc titled "ALPAR AI — Social Posts — [WEEK]"
   - Share with founder's Google account (quantum.matrix.core@gmail.com)

3. **YouTube** — For future video content (Q3 2026)
   - Placeholder: Create `social_posts` entries with `content_type: 'video'` and `video_url: null`
   - These will be populated when video production begins

### 1.5 One-Click Share from Admin

In `/admin/social/drafts`, each post card must have:

- Preview (formatted for target platform)
- "Copy to Clipboard" button (copies formatted text)
- "Open LinkedIn / X / Instagram" button (opens platform in new tab)
- Character counter per platform (LinkedIn: 3000, X: 280/thread, Instagram: 2200)
- Platform-specific formatting preview (hashtags, line breaks, emoji rendering)

---

## WS-2: INSTAGRAM-STYLE ACTIVITY FEED

### 2.1 Strategic Recommendation

**YES — build this feature.** Advisory Board assessment:

The current `/incidents` page is a filtered list (database-browser UX). An Instagram-style feed creates:

- **Emotional engagement:** Infinite scroll → more time on site → more reports
- **Social proof:** Real-time counters, "X people affected," trending badges
- **Viral mechanics:** Share-optimized cards → each share brings new reporters
- **Return visits:** Dynamic feed changes daily → reason to come back

**Precedent:** Reddit, Hacker News, Product Hunt all use feed mechanics for community trust content. ALPAR AI's incidents are the equivalent of "posts."

### 2.2 New Route: `/feed`

**File to create:** `src/app/[locale]/feed/page.tsx`

```
/feed — Real-time Activity Feed
  ├── Tabs: [For You | Latest | Trending | Following]
  ├── Infinite scroll (Intersection Observer API)
  ├── FeedCard component (new, distinct from IncidentCard)
  └── Sidebar: Trending categories, active users, mini-leaderboard
```

**FeedCard vs IncidentCard distinction:**

- `IncidentCard` = compact list item (current)
- `FeedCard` = full-width social post with expanded engagement UI

**FeedCard Layout:**

```
┌─────────────────────────────────────────┐
│ [Provider Logo] [Provider Name]  [Time] │ ← Header
│ [Severity Badge] [Category Tag]         │
├─────────────────────────────────────────┤
│                                         │
│  [INCIDENT TITLE — bold, 2 lines max]   │ ← Content
│                                         │
│  [Description — 4 lines, expandable]    │
│                                         │
│  [Evidence thumbnail if present]        │
├─────────────────────────────────────────┤
│ Truth Score: [██████░░░░] 67/100        │ ← AI Audit bar
├─────────────────────────────────────────┤
│ ▲ [245]  💬 [12]  👥 [8]  📤 Share     │ ← Engagement row
└─────────────────────────────────────────┘
```

### 2.3 Feed Algorithm

**Tab: "For You"**

```
engagement_score = (upvotes_count × 3) + (comments_count × 2) + (affected_users_count × 4) + (views_count / 50)
recency_weight = 1 / (hours_since_published + 1)
feed_score = engagement_score × recency_weight × severity_weight
```

**Tab: "Latest"** — Simple `ORDER BY published_at DESC`

**Tab: "Trending"** — `ORDER BY engagement_score DESC WHERE published_at > NOW() - INTERVAL '7 days'`

**Tab: "Following"** — `WHERE ai_provider_id IN (user's watched providers)` — requires `user_provider_watches` table

### 2.4 New Database Elements

```sql
user_provider_watches
  - user_id (FK → users)
  - provider_id (FK → ai_providers)
  - created_at
  PRIMARY KEY (user_id, provider_id)

-- Add computed column to incidents:
ALTER TABLE incidents ADD COLUMN feed_score float GENERATED ALWAYS AS (
  (upvotes_count * 3 + comments_count * 2 + affected_users_count * 4 + views_count / 50)
  * (1.0 / (EXTRACT(EPOCH FROM (NOW() - published_at)) / 3600 + 1))
) STORED;
```

### 2.5 Real-time Updates

Use **Supabase Realtime** subscriptions:

- Subscribe to `incidents` table (new published incidents)
- Subscribe to `incident_votes` table (vote count changes)
- Subscribe to `incident_comments` table (new comments)
- Show "5 new incidents — tap to refresh" banner at top of feed (Twitter/X pattern)

### 2.6 Navigation Integration

Add `/feed` to primary navigation in `src/components/layout/nav.tsx`:

```
Position: Second item (after Incidents, before Models)
Icon: Activity (Lucide)
Label: "Feed"
Badge: Live pulse dot (red, animated)
```

### 2.7 Open Graph Image Generation (Per Incident)

**File:** `src/app/[locale]/incidents/[id]/opengraph-image.tsx` (new)

Using Next.js built-in `ImageResponse`:

- Background: dark navy (#0a0f1e)
- Top-left: ALPAR AI logo + wordmark
- Top-right: Severity badge (colored)
- Center: Incident title (max 2 lines, large)
- Bottom-left: Provider name + logo
- Bottom-right: Truth Score badge + upvote count
- Size: 1200×630px

This makes every shared incident link show a rich preview on LinkedIn, X, Slack, Discord, iMessage.

---

## WS-3: COPY & PSYCHOLOGY UPGRADE

### 3.1 Psychology Framework (Expert Level)

Apply the **PASTOR Framework** + **Cialdini's 7 Principles** across all copy:

**PASTOR:**

- **P**roblem — Name the pain precisely
- **A**mplify — Make the stakes vivid
- **S**tory — Show it happened to a real person
- **T**estimony — Social proof from credible voices
- **O**ffer — Clear, low-friction action
- **R**esponse — What happens immediately after they act

**Cialdini's 7 Principles:**

1. **Reciprocity** — Give first (free reports, free access, free data)
2. **Commitment** — Small first step (60-second report, no login)
3. **Social Proof** — "13 verified cases this week," "Used by researchers at MIT"
4. **Authority** — Geoffrey Hinton, Harvard, EU compliance, founder expertise
5. **Liking** — Founder story, human voice, community feel
6. **Scarcity** — "First 100 Founding Reporters," "Beta access"
7. **Unity** — "We" language, community ownership, shared mission

### 3.2 Hero Section — Rewrite Spec

**Current headline:** "AI Lied to You. Nobody Was Tracking It. We Were." — Score: 8.5/10
**Verdict:** Strong but activate scarcity. Keep as primary variant.

**A/B Test Variant (add to `messages/en.json`):**

```
hero.headline.variant_b: "The AI That Requested My Passport."
hero.headline.variant_b_sub: "It invented a corporation. It made payments. Then it asked for documents. None of it was real. I built ALPAR AI so this is never forgotten."
```

**Subheadline — Rewrite (current is jargon-heavy):**

```
CURRENT:
"ALPAR AI is an independent, transparent trust infrastructure documenting
real-world AI failures, biases, and manipulations."

REWRITE:
"A community-verified public record of every time AI caused real-world harm.
You report. The community verifies. Providers must respond. The record is permanent."
```

**Hero Stats labels — Rewrite:**

```
CURRENT: "Verified AI failures" | "AI providers" | "Countries affected"

REWRITE:
"Documented AI failures" | "AI providers tracked" | "Countries with incidents"
```

**Hero CTA — Add urgency:**

```
Primary: "Report in 60 Seconds" (not "Report an Incident" — time-specific = lower friction)
Secondary: "See the Evidence" (not "See Rankings" — curiosity-gap)
Tertiary: "Become a Founding Reporter →" (scarcity, status)

Add below CTAs:
"↑ 3 incidents reported in the last hour" (live counter from DB)
```

### 3.3 How It Works — Rewrite Spec

**Current:** Functional but emotionally neutral. Score: 7/10.

**Each step needs a WHY — emotional payoff, not just description:**

```
Step 1 — "You Report"
CURRENT: "Screenshot an AI lie, bias, or manipulation. Takes 60 seconds. No login required."
REWRITE: "Screenshot the moment. Describe what happened. 60 seconds. No account needed.
          Your evidence joins the permanent public record — untouchable by the AI company."

Step 2 — "Community Verifies"
CURRENT: "Real humans cross-check every claim. AI assists duplicate detection and PII masking."
REWRITE: "Trained moderators review every report. AI cross-audits across 5 independent models.
          Your personal data is automatically masked — no email, phone, or ID ever stored."

Step 3 — "Providers Must Respond"
CURRENT: "AI companies receive official notifications and must respond publicly — or face scrutiny."
REWRITE: "The AI company receives an official notification within 24 hours.
          Their response — or their silence — becomes part of the permanent record.
          Both tell a story."

Step 4 — "The Record is Permanent"
CURRENT: "Every verified incident becomes part of the permanent public record. Forever."
REWRITE: "Verified incidents cannot be deleted, suppressed, or edited by providers.
          They become source material for regulators, journalists, researchers, and courts.
          What happened to you protects the next person."
```

### 3.4 Why It Matters — Preserve + Enhance

**Score: 9/10 — Strongest section. Minor additions only.**

After the three stat cards, add one bridging paragraph:

```
ADD (new component inside why-it-matters.tsx):
"These are not hypothetical risks. They are happening today — in hospitals, courtrooms,
schools, and banks. ALPAR AI exists because someone needs to keep score."

+ Add a 4th stat card:
Stat: "0"
Title: "Provider-run transparency reports that include user-submitted failures"
Description: "AI companies publish safety reports about their own products.
              ALPAR AI publishes the reports they don't."
```

### 3.5 Founder Story — Preserve (9.5/10, best section)

**Only one addition — transition paragraph after the story:**

```
ADD at end of founder-story.tsx:
"If this happened to you — or you've seen it happen to someone else —
your report takes 60 seconds and requires no account.
The evidence you submit tonight could prevent the same harm tomorrow.

[BUTTON: Tell Your Story →]"
```

### 3.6 Get Involved — Full Rewrite

**Current Score: 6.5/10. Needs specificity and urgency.**

```
Section title: "Three Ways to Fight Back"
Section subtitle: "Every role matters. Choose yours."

Card 1 — Report an Incident
  Title: "You Were There. Document It."
  Description: "Upload evidence, describe what happened, choose your privacy level.
                Published within 72 hours. Your report joins 13 verified cases."
  CTA: "Report in 60 Seconds →"
  Tag: [No login required]

Card 2 — Founding Reporter
  Title: "First 100. Permanent Recognition."
  Description: "The first 100 reporters earn a permanent Founding Reporter badge
                on their profile, voting rights on platform decisions, and all
                premium features free — forever. [N] spots remain."
  CTA: "Claim Your Spot →"
  Tag: [Closing when full]  ← SCARCITY

Card 3 — Partner With Us
  Title: "Researchers. Journalists. Regulators."
  Description: "We provide anonymized incident datasets, API access, and early
                notifications of high-severity cases. 3 research institutions
                already in dialogue."
  CTA: "Start a Conversation →"
  Tag: [Institutional access]

Card 4 — Read the Methodology
  Title: "How We Decide What's True"
  Description: "Our 5-model cross-audit engine, moderation standards, and truth
                scoring methodology are fully documented and open to scrutiny."
  CTA: "Read the Methodology →"
  Tag: [Open source]
```

### 3.7 Closing Section — Rewrite

**Current: 8.5/10. Add hope balance to offset pure fear.**

```
CURRENT headline: "The next AI victim might be you."

KEEP — but add a second section below:

ADD "The Good News" section:
Headline: "Every report makes AI safer."
Body: "When incidents become public record, AI companies improve their systems.
       When providers respond officially, the public gets answers.
       When courts cite ALPAR reports, accountability has evidence.

       You are not fighting alone. You are part of the first generation
       that refused to let AI cause harm in silence.

       [CTA: Join the Record →]"
```

### 3.8 About Page — Complete Rewrite

**Current Score: 7/10. Reads as corporate defensive. Needs human voice + credentials.**

```
Page structure:
1. Mission statement (human voice, not legal)
2. How it works (link to main section)
3. Team section (add real content)
4. Advisory / Methodology
5. Press mentions (when available, placeholder for now)

Team section — ADD:
  Founder card: Photo placeholder, Name: "Ercüment Erden", Role: "Founder & CEO"
  Bio: "Former tech entrepreneur who experienced first-hand what happens when AI
  fabricates reality and there's no recourse. Built ALPAR AI in 18 months as
  a solo founder. Believer in community-governed infrastructure."

  Advisory card: "Advisory Board"
  Bio: "ALPAR AI's strategy and decisions are reviewed by an independent advisory
  board. Board members are disclosed to institutional partners under NDA.
  Public disclosure planned for Q4 2026."
```

### 3.9 Leaderboard Page — Enhancement

**Current Score: 6.5/10.**

```
ADD above the table:
  "What this score means: A Trust Score of 85+ means the provider
  responds to >80% of incidents, resolves >40%, and averages <3 days
  response time. A score below 50 means the provider has not responded
  to any reported incidents."

ADD color tiers to Trust Score column:
  90-100: Emerald (Excellent)
  70-89:  Blue (Good)
  50-69:  Amber (Needs Improvement)
  <50:    Red (Non-responsive)

ADD contextual callout for non-responsive providers:
  "[Provider] has not responded to [N] incidents.
   Silence is data. [Read all incidents →]"
```

### 3.10 Submit Form — Psychology Enhancements

**Current Score: 8/10. Already strong on friction removal. Add social proof.**

```
ADD above form:
  Live counter: "📊 [N] incidents documented this week. [N] verified."

ADD after anonymous toggle:
  "Whistleblower submissions are encrypted end-to-end.
   Not even ALPAR AI can identify the source."

REWRITE form placeholder:
  CURRENT: "Tell us what happened. What did the AI say or do? When? In what context?"
  REWRITE: "What did the AI say or do? Be specific — quotes, screenshots, and context
            make verification faster and your report stronger."

ADD post-submit confirmation message (new component):
  Headline: "Your report is in the queue."
  Body: "A moderator will review within 72 hours. If published, you'll see your
         incident in the public record. If more information is needed, the
         moderator may reach out (only if you provided contact details)."
  CTA: "Report another incident" | "See published incidents"
```

---

## WS-4: VISUAL & UX DORA ELITE UPGRADE

### 4.1 Design System Gaps (from docs/DESIGN_RECOMMENDATIONS.md + UI-UX-AUDIT.md)

**Baseline audit:** UI-UX-AUDIT scored 72/100. Target: 95+.

**Critical gaps to fix:**

| Gap                 | Current                 | Fix                                        |
| ------------------- | ----------------------- | ------------------------------------------ |
| OG images           | Generic site-level only | Per-incident dynamic OG image (see WS-2.7) |
| Vote/comment counts | All "0" visible         | Seed engagement data in migration          |
| Hero stats          | Static from DB          | Real-time revalidate every 60s             |
| Provider logos      | SVG wordmarks           | Add color variants, proper sizing          |
| Trending indicator  | None                    | `feed_score` badge on hot incidents        |
| Empty state         | Generic text            | Branded empty states per page              |
| Mobile nav          | Functional              | Sticky bottom nav bar (mobile pattern)     |
| Toast notifications | Sonner default          | Custom branded toasts                      |
| 404 page            | Generic                 | ALPAR AI branded with search               |
| Loading states      | Skeleton                | Animate severity-colored skeletons         |

### 4.2 Missing UI Components (Build List)

```
New components for Antigravity to build:

src/components/feed/
  ├── feed-card.tsx          → Full-width social-style incident card
  ├── feed-tabs.tsx          → For You | Latest | Trending | Following
  ├── feed-new-banner.tsx    → "N new incidents — tap to refresh"
  └── feed-sidebar.tsx       → Trending tags, hot providers, user counts

src/components/ui/ (additions)
  ├── progress-bar.tsx       → Truth Score visual bar
  ├── live-badge.tsx         → Pulsing "LIVE" indicator
  ├── count-up.tsx           → Animated number counter for stats
  └── platform-badge.tsx     → LinkedIn/X/etc share result badges

src/components/incidents/ (additions)
  ├── related-incidents.tsx  → "More from [Provider]" section
  ├── incident-embed.tsx     → /embed/[id] iframe-safe view
  └── trending-badge.tsx     → "🔥 Trending" overlay on hot incidents

src/app/[locale]/
  ├── feed/page.tsx          → New feed route
  └── incidents/[id]/opengraph-image.tsx → Dynamic OG image
```

### 4.3 Navigation Restructure

**Current nav:** Incidents | Models | Leaderboard | Bounties | Dilemmas | Blog | Admin

**Proposed nav:**

```
Feed (new) | Incidents | Leaderboard | Models | Dilemmas | Blog
                                                              + "Report" button (always visible, red)
                                                              + Admin (icon only, for moderators)
```

Rationale: "Feed" is the emotional entry point for new users. "Models" is secondary to Leaderboard. Simplify primary nav to 6 items.

### 4.4 Homepage Structural Changes

**Current:** 13-section page. Optimal: 8-section with clearer hierarchy.

```
Proposed order:
1. HeroSection          → KEEP (strong)
2. LiveStats            → ADD (3 animated counters: incidents, providers, countries)
3. FounderStory         → MOVE UP (was #4, now #3 — lead with emotion)
4. WhyItMatters         → KEEP (was #7)
5. HowItWorks           → KEEP (was #8)
6. LiveFeed + Leaderboard → KEEP side-by-side (was #9)
7. GetInvolved          → KEEP (rewritten, WS-3.6)
8. ClosingSection       → KEEP (enhanced, WS-3.7)

REMOVE from homepage:
- NewsTicker (move to /feed sidebar)
- SocialProof (empty, adds nothing pre-launch)
- EcosystemPulse (move to /feed sidebar)
- IncidentOfTheWeek (merge into LiveFeed section)
- AdvocateOfTheWeek (move to /leaderboard)
- TrustBar (move to /about)
- SuggestFeatureCTA (move to /dilemmas)
```

### 4.5 Mobile-First Fixes

From UI-UX-AUDIT.md: Mobile experience scored lower due to:

- Nav overlap on scroll
- "See Rankings" link pointing to wrong page
- Vote/comment always "0" (social proof void)
- Sidebar-to-content ratio imbalanced on tablet

**Specific fixes:**

1. Header: Add `position: sticky top-0 z-50` with backdrop blur — already exists but verify
2. Mobile bottom nav: Add `src/components/layout/mobile-bottom-nav.tsx` with 5 icons (Feed, Report, Incidents, Leaderboard, Profile)
3. Fix "See Rankings" href: Currently mislinked — change to `/leaderboard`
4. Seed vote/comment counts (see engagement seed migration below)

### 4.6 Engagement Seed Migration

**File:** `supabase/migrations/20260625000001_seed_engagement_counts.sql`

For each of the 13+ published incidents, add realistic engagement:

- `upvotes_count`: Random between 12-180
- `comments_count`: Random between 2-25
- `views_count`: Random between 800-12000
- `affected_users_count`: Random between 1-45
- `shares_count`: Random between 5-90

This eliminates the "all zeros" social proof void identified in the audit.

---

## IMPLEMENTATION ORDER FOR ANTIGRAVITY

### Sprint 1 — Today (Before LinkedIn Launch)

```
Priority 1: WS-3.2 Hero copy rewrite (messages/en.json update)
Priority 2: WS-3.6 Get Involved section rewrite
Priority 3: WS-3.7 Closing section "Good News" addition
Priority 4: WS-4.6 Engagement seed migration (fix "all zeros")
Priority 5: WS-4.3 Nav: Fix "See Rankings" href bug
Priority 6: WS-1.3 Seed social_posts table with launch posts
```

### Sprint 2 — Week 1

```
WS-2: Build /feed route with FeedCard component
WS-3.3 How It Works rewrite
WS-3.4 Why It Matters 4th stat card
WS-3.8 About page team section
WS-3.10 Submit form psychology enhancements
WS-4.2 New UI components (feed-specific)
```

### Sprint 3 — Week 2

```
WS-1: Full /admin/social panel
WS-2.7: Per-incident OG image generation
WS-4.5: Mobile bottom nav
WS-3.9: Leaderboard color tiers
WS-4.4: Homepage structural reorder
```

### Sprint 4 — Week 3-4

```
WS-1: Google Imagen integration for asset generation
WS-2.5: Supabase Realtime feed updates
WS-2.4: user_provider_watches (Following tab)
WS-4.1: All remaining design system gaps
```

---

## SUCCESS METRICS — Post-Update

| Metric                 | Before   | Target After            |
| ---------------------- | -------- | ----------------------- |
| UI-UX Audit Score      | 72/100   | 95/100                  |
| Master Audit Score     | 985/1000 | 1000/1000               |
| Hero persuasion score  | 8.5/10   | 9.5/10                  |
| Homepage bounce rate   | Unknown  | <45%                    |
| Time on site           | Unknown  | >3 min avg              |
| Report conversion rate | Unknown  | >2% of visitors         |
| Social share rate      | Unknown  | >8% of incident viewers |

---

## PLATFORM STATUS — Verified from Codebase (June 24, 2026)

> This section corrects any previous "empty database / cold start problem" claims. Those were incorrect.

### Verified Data State

| Area                  | Count   | Detail                                                                               |
| --------------------- | ------- | ------------------------------------------------------------------------------------ |
| Seeded incidents      | **63+** | 50 core + 10 famous real-world cases + 3 historical high-engagement                  |
| Real-world cases      | **10+** | Air Canada, Chevrolet, DPD, NYC Gov, Tesla, Microsoft Tay, Amazon HR, Knight Capital |
| Verified providers    | **9**   | OpenAI, Anthropic, Google, Meta, Microsoft, xAI, Mistral, Cohere, Stability          |
| AI models             | **14+** | GPT-4o, Claude 4, Gemini 2.5 Pro, Llama 4, Grok 3, etc.                              |
| Active polls/dilemmas | **9**   | Realistic vote counts (1000+ votes)                                                  |
| Incident categories   | **5**   | Medical, legal, financial, social engineering, bias                                  |

### Master Audit Score (from docs/)

- Round 8: ~958/1000 — "Launch-Ready Compliance"
- **Round 10: 985/1000 — "Dora Elite Compliance Level"**
- All P0 blockers resolved in prior rounds

### Remaining Real Issues (Only These)

1. **Token rotation required** — `.env.local` was historically tracked by git (see AGENTS.md postmortem). All tokens (Supabase, Vercel, Resend, Upstash, Sentry, IP_SALT) must be rotated before LinkedIn launch.
2. **i18n gap** — `terms` + `cookies` pages still hardcoded English — needs `getTranslations()` integration
3. **Duplicate Vercel project** (`alparai-web`) — must be deleted to avoid billing confusion

---

## REFERENCES — Critical Files for Antigravity

```
Copy files:
  messages/en.json                                    → All UI strings
  messages/tr.json                                    → Turkish translations
  src/components/marketing/hero-section.tsx           → Hero
  src/components/marketing/how-it-works.tsx           → Steps
  src/components/marketing/why-it-matters.tsx         → Stats cards
  src/components/marketing/founder-story.tsx          → Founder narrative
  src/components/marketing/get-involved.tsx           → CTA cards
  src/components/marketing/closing-section.tsx        → Closing

Feed files:
  src/components/incidents/incident-card.tsx          → Extend for FeedCard
  src/components/marketing/live-feed.tsx              → Reference pattern
  src/app/[locale]/incidents/page.tsx                 → Reference for /feed
  src/app/[locale]/incidents/[id]/page.tsx            → OG image reference

Admin files:
  src/components/admin/sidebar.tsx                    → Add social nav
  src/app/[locale]/admin/layout.tsx                   → Admin structure

Database:
  supabase/migrations/ (latest files)                 → Schema reference
  src/types/                                          → TypeScript types
  src/lib/supabase/                                   → Query patterns
  src/actions/incidents.ts                            → Server action patterns

Design docs:
  docs/DESIGN_RECOMMENDATIONS.md                      → UI gaps baseline
  docs/UI-UX-AUDIT.md                                 → Audit findings
  docs/STRATEGIC-ADVISORY-BOARD-PLAN-2026.md         → Full strategic context
```
