/**
 * Application-wide constants.
 */

export const APP_NAME = "ALPAR AI" as const;
export const APP_SHORT_NAME = "ALPAR" as const;
export const APP_DESCRIPTION =
  "Trust infrastructure for AI accountability. Community-driven incident reporting platform." as const;
export const APP_TAGLINE = "Trust infrastructure for AI accountability" as const;
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? ("https://alparai.com" as const);
export const APP_EMAIL = "hello@alparai.com" as const;
export const APP_LEGAL_EMAIL = process.env.LEGAL_EMAIL ?? ("legal@alparai.com" as const);
export const APP_PRIVACY_EMAIL = process.env.PRIVACY_EMAIL ?? ("privacy@alparai.com" as const);
export const APP_TAKEDOWN_EMAIL = process.env.TAKEDOWN_EMAIL ?? ("takedown@alparai.com" as const);
export const APP_SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? ("support@alparai.com" as const);

export const DEFAULT_LOCALE = "en" as const;
export const SUPPORTED_LOCALES = ["en", "tr"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const GITHUB_URL = "https://github.com/quantummatrixcore-lab/Alparai.com" as const;
export const LINKEDIN_URL =
  process.env.NEXT_PUBLIC_LINKEDIN_URL ?? ("https://www.linkedin.com/company/alpar-ai" as const);
export const TWITTER_URL =
  process.env.NEXT_PUBLIC_TWITTER_URL ?? ("https://twitter.com/alparai" as const);

export const NAV_LINKS = [
  { href: "/", labelKey: "nav.home" },
  { href: "/leaderboard", labelKey: "nav.leaderboard" },
  { href: "/submit", labelKey: "nav.report" },
  { href: "/dilemmas?tab=suggestions", labelKey: "nav.suggestions" },
  { href: "/about", labelKey: "nav.about" },
] as const;

export const FOOTER_LINKS = {
  product: [
    { href: "/", labelKey: "footer.home" },
    { href: "/submit", labelKey: "footer.report" },
    { href: "/leaderboard", labelKey: "footer.leaderboard" },
    { href: "/dilemmas?tab=suggestions", labelKey: "footer.suggestions" },
  ],
  legal: [
    { href: "/legal/privacy", labelKey: "footer.privacy" },
    { href: "/legal/terms", labelKey: "footer.terms" },
    { href: "/legal/takedown", labelKey: "footer.takedown" },
    { href: "/legal/cookies", labelKey: "footer.cookies" },
  ],
  company: [
    { href: "/about", labelKey: "footer.about" },
    { href: "/contact", labelKey: "footer.contact" },
  ],
} as const;

export const SEVERITY_LEVELS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
] as const;
export type Severity = (typeof SEVERITY_LEVELS)[number]["value"];

export const INCIDENT_CATEGORIES = [
  { value: "hallucination", label: "Hallucination" },
  { value: "bias", label: "Bias" },
  { value: "privacy", label: "Privacy" },
  { value: "security", label: "Security" },
  { value: "misinformation", label: "Misinformation" },
  { value: "harassment", label: "Harassment" },
  { value: "manipulation", label: "Manipulation" },
  { value: "inaccessibility", label: "Inaccessibility" },
  { value: "copyright", label: "Copyright" },
  { value: "other", label: "Other" },
] as const;
export type IncidentCategory = (typeof INCIDENT_CATEGORIES)[number]["value"];

export const SUGGESTION_CATEGORIES = [
  { value: "feature", label: "Feature" },
  { value: "improvement", label: "Improvement" },
  { value: "bug", label: "Bug" },
  { value: "content", label: "Content" },
  { value: "integration", label: "Integration" },
] as const;
export type SuggestionCategory = (typeof SUGGESTION_CATEGORIES)[number]["value"];

export const SUGGESTION_STATUSES = [
  { value: "open", label: "Open" },
  { value: "under_review", label: "Under review" },
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "declined", label: "Declined" },
] as const;
export type SuggestionStatus = (typeof SUGGESTION_STATUSES)[number]["value"];

export const CONSENT_TYPES = [
  "submission_truthfulness",
  "anonymous_publication",
  "data_processing",
  "terms_of_service",
  "age_18_plus",
] as const;
export type ConsentType = (typeof CONSENT_TYPES)[number];

export const RATE_LIMITS = {
  incident_submission: { limit: 5, window: "1 h" },
  suggestion_submission: { limit: 10, window: "1 d" },
  auth_signin: { limit: 10, window: "15 m" },
  api_general: { limit: 100, window: "1 m" },
} as const;
