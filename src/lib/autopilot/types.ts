export type AttemptId = string & { readonly __brand: "AttemptId" };
export type IdempotencyKey = string & { readonly __brand: "IdempotencyKey" };

export type AutopilotStatus =
  | "pending"
  | "running"
  | "succeeded"
  | "exhausted"
  | "replayed"
  | "circuit_open"
  | "budget_exceeded";

export type BreakerState = "closed" | "open" | "half_open";

export type BackoffStrategy = "exponential" | "linear" | "fixed";

export type ExhaustionAction =
  | "silent_log"
  | "toast_warn"
  | "email_fallback"
  | "escalate_admin"
  | "throw";

export interface RetryConfig {
  attempts: number;
  baseMs: number;
  maxMs: number;
  strategy: BackoffStrategy;
  jitter: boolean;
  jitterRatio: number;
}

export interface BreakerConfig {
  threshold: number;
  cooldownMs: number;
  halfOpenProbe: boolean;
}

export interface BudgetConfig {
  maxMs: number;
  maxTokens: number;
}

export interface IdempotencyConfig {
  enabled: boolean;
  keyHeader: string | null;
  hashInputs: boolean;
}

export interface AutopilotConfig {
  action: string;
  retry: RetryConfig;
  breaker: BreakerConfig;
  budget: BudgetConfig;
  idempotency: IdempotencyConfig;
  onExhaust: ExhaustionAction;
  redactionFields: ReadonlyArray<string>;
}

export type AutopilotResult<T> =
  | { kind: "ok"; value: T; attempts: number; durationMs: number; idempotencyKey: IdempotencyKey }
  | { kind: "replayed"; value: unknown; originalId: string; attempts: number; idempotencyKey: IdempotencyKey }
  | { kind: "exhausted"; error: string; attempts: number; durationMs: number; idempotencyKey: IdempotencyKey }
  | { kind: "circuit_open"; cooldownMs: number; idempotencyKey: IdempotencyKey }
  | { kind: "budget_exceeded"; costMs: number; attempts: number; idempotencyKey: IdempotencyKey }
  | { kind: "idempotency_violation"; reason: string; idempotencyKey: IdempotencyKey };

export interface AttemptContext {
  attempt: number;
  startedAt: number;
  idempotencyKey: IdempotencyKey;
  signal: AbortSignal;
  costTokens: number;
}

export type AttemptOutcome<T> =
  | { kind: "success"; value: T; costTokens?: number }
  | { kind: "retryable"; error: string; costTokens?: number }
  | { kind: "fatal"; error: string; costTokens?: number };

export interface AutopilotAttemptLog {
  attempt: number;
  ok: boolean;
  error: string | null;
  durationMs: number;
  costTokens: number;
  timestamp: number;
}

export interface AutopilotPolicy {
  config: AutopilotConfig;
}

export interface AutopilotTelemetryPayload {
  action: string;
  result: AutopilotResult<unknown>["kind"];
  attempts: number;
  durationMs: number;
  idempotencyKey: string;
  userId: string | null;
  ipHash: string | null;
  error: string | null;
}

export const DEFAULT_RETRY: RetryConfig = {
  attempts: 3,
  baseMs: 500,
  maxMs: 30_000,
  strategy: "exponential",
  jitter: true,
  jitterRatio: 0.25,
};

export const DEFAULT_BREAKER: BreakerConfig = {
  threshold: 10,
  cooldownMs: 30_000,
  halfOpenProbe: true,
};

export const DEFAULT_BUDGET: BudgetConfig = {
  maxMs: 8_000,
  maxTokens: 1_000,
};

export const DEFAULT_IDEMPOTENCY: IdempotencyConfig = {
  enabled: true,
  keyHeader: null,
  hashInputs: true,
};

export const SAFE_REDACTION_FIELDS: ReadonlyArray<string> = [
  "password",
  "token",
  "secret",
  "authorization",
  "cookie",
  "api_key",
  "apikey",
  "access_token",
  "refresh_token",
  "private_key",
];

export const createAttemptId = (raw: string): AttemptId => raw as AttemptId;
export const createIdempotencyKey = (raw: string): IdempotencyKey =>
  raw as IdempotencyKey;

export const attemptsOf = <T>(result: AutopilotResult<T>): number => {
  if ("attempts" in result && typeof result.attempts === "number") return result.attempts;
  return 0;
};

export const durationOf = <T>(result: AutopilotResult<T>): number => {
  if (result.kind === "ok" || result.kind === "exhausted") return result.durationMs;
  if (result.kind === "budget_exceeded") return result.costMs;
  return 0;
};

export const isSuccess = <T>(result: AutopilotResult<T>): boolean =>
  result.kind === "ok" || result.kind === "replayed";
