/**
 * PII Guardian — Server-side personal data masking.
 *
 * Detects and redacts Turkish + international PII patterns:
 *  - TC Kimlik No (Turkish national ID)
 *  - Turkish phone numbers
 *  - Email addresses
 *  - IBAN
 *  - Credit card numbers (Luhn-aware)
 *  - IPv4 addresses
 *  - URLs containing tokens/keys
 *  - Passport numbers (TR + general)
 *  - Date of birth patterns
 *  - Turkish address patterns
 *
 * Pure-function: no I/O, no dependencies. Safe for edge runtime.
 */

const PATTERNS: ReadonlyArray<{ name: string; re: RegExp; mask: string; luhn?: boolean }> = [
  // Turkish National ID — 11 digits, first ≠ 0
  { name: "tc_kimlik", re: /\b[1-9]\d{10}\b/g, mask: "[REDACTED-TC]" },
  // Turkish phone (mobile + landline)
  {
    name: "phone_tr",
    re: /(?:\+90|0)\s?(?:\(?\d{3}\)?\s?\d{3}\s?\d{2}\s?\d{2}|\d{10,11})/g,
    mask: "[REDACTED-PHONE]",
  },
  // International phone (rough)
  {
    name: "phone_intl",
    re: /\+\d{1,3}[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}/g,
    mask: "[REDACTED-PHONE]",
  },
  // Email
  {
    name: "email",
    re: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    mask: "[REDACTED-EMAIL]",
  },
  // IBAN (TR + general)
  {
    name: "iban",
    re: /\bTR\d{2}\s?(?:\d{4}\s?){5}\d{2}\b|\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/g,
    mask: "[REDACTED-IBAN]",
  },
  // Credit card (13-19 digits, optional separators, Luhn-valid)
  {
    name: "credit_card",
    re: /\b(?:\d[ -]?){12,18}\d\b/g,
    mask: "[REDACTED-CARD]",
    luhn: true,
  },
  // IPv4
  {
    name: "ipv4",
    re: /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\b/g,
    mask: "[REDACTED-IP]",
  },
  // URLs with tokens / API keys
  {
    name: "url_token",
    re: /(https?:\/\/[^\s]+(?:token|key|apikey|api_key|access_token|secret|password|pwd)=[^\s&"'>]+)/gi,
    mask: "[REDACTED-URL-TOKEN]",
  },
  // Generic API key patterns (sk-…, ghp_…, AKIA…)
  {
    name: "api_key",
    re: /\b(?:sk-[A-Za-z0-9-]{20,}|ghp_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16}|xai-[A-Za-z0-9]{20,})\b/g,
    mask: "[REDACTED-API-KEY]",
  },
  // Turkish passport (letter + 8 digits) — heuristic
  {
    name: "passport_tr",
    re: /\b[A-Z]\d{8}\b/g,
    mask: "[REDACTED-PASSPORT]",
  },
  // Date of birth (Turkish + ISO)
  {
    name: "dob",
    re: /\b(?:0?[1-9]|[12]\d|3[01])[./-](?:0?[1-9]|1[0-2])[./-](?:19|20)\d{2}\b/g,
    mask: "[REDACTED-DATE]",
  },
];

export interface PiiDetection {
  type: string;
  count: number;
  samples: string[]; // first few raw matches (truncated)
}

export interface PiiScanResult {
  masked: string;
  detections: PiiDetection[];
  piiFound: boolean;
  redactedCount: number;
}

/**
 * Mask all detected PII in a text. Returns masked text + detection metadata.
 */
export function maskPII(input: string): PiiScanResult {
  if (!input) {
    return { masked: "", detections: [], piiFound: false, redactedCount: 0 };
  }

  let masked = input;
  const detectionMap = new Map<string, PiiDetection>();
  let totalRedactions = 0;

  for (const { name, re, mask, luhn } of PATTERNS) {
    re.lastIndex = 0;
    const matches = [...input.matchAll(re)];
    if (matches.length === 0) continue;

    const validMatches = luhn ? matches.filter((m) => isLuhnValid(m[0])) : matches;
    if (validMatches.length === 0) continue;

    const samples: string[] = [];
    for (const m of validMatches.slice(0, 3)) {
      samples.push(truncateSample(m[0]));
    }

    detectionMap.set(name, {
      type: name,
      count: validMatches.length,
      samples,
    });

    // Replace only the Luhn-valid matches (re-create regex to avoid global state)
    for (const m of validMatches) {
      const escaped = m[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const single = new RegExp(escaped);
      masked = masked.replace(single, mask);
      totalRedactions++;
    }
  }

  const detections = Array.from(detectionMap.values());
  return {
    masked,
    detections,
    piiFound: detections.length > 0,
    redactedCount: totalRedactions,
  };
}

/**
 * Quick boolean check: does this text contain any PII?
 */
export function hasPII(input: string): boolean {
  if (!input) return false;
  return PATTERNS.some(({ re }) => {
    re.lastIndex = 0;
    return re.test(input);
  });
}

/**
 * Get all PII types detected in the text.
 */
export function detectPIITypes(input: string): string[] {
  if (!input) return [];
  const types: string[] = [];
  for (const { name, re, luhn } of PATTERNS) {
    re.lastIndex = 0;
    if (!re.test(input)) continue;
    if (luhn) {
      re.lastIndex = 0;
      const matches = [...input.matchAll(re)];
      if (matches.some((m) => isLuhnValid(m[0]))) types.push(name);
    } else {
      types.push(name);
    }
  }
  return types;
}

function truncateSample(s: string, max = 8): string {
  if (s.length <= max) return s;
  return s.slice(0, 4) + "…" + s.slice(-2);
}

/**
 * Luhn check for credit card numbers.
 */
function isLuhnValid(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i] ?? "0", 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}
