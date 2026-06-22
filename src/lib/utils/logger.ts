type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  timestamp: string;
  error?: Error;
}

function formatEntry(entry: LogEntry): string {
  const { level, message, context, timestamp, error } = entry;
  if (process.env.NODE_ENV === "production") {
    const jsonEntry: Record<string, unknown> = {
      ts: timestamp,
      level,
      msg: message,
    };
    if (context && Object.keys(context).length > 0) jsonEntry["ctx"] = context;
    if (error) {
      jsonEntry["err"] = { name: error.name, message: error.message, stack: error.stack };
    }
    return JSON.stringify(jsonEntry);
  }
  const base = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  if (error) {
    return `${base} | error=${error.name}: ${error.message}\n${error.stack ?? ""}`;
  }
  if (context && Object.keys(context).length > 0) {
    return `${base} | context=${JSON.stringify(context)}`;
  }
  return base;
}

function shouldLog(level: LogLevel): boolean {
  if (process.env.NODE_ENV === "production" && level === "debug") return false;
  return true;
}

import * as Sentry from "@sentry/nextjs";

function log(level: LogLevel, message: string, context?: LogContext, error?: Error) {
  if (!shouldLog(level)) return;
  const entry: LogEntry = {
    level,
    message,
    ...(context !== undefined ? { context } : {}),
    timestamp: new Date().toISOString(),
    ...(error !== undefined ? { error } : {}),
  };
  const formatted = formatEntry(entry);
  if (level === "error") {
    console.error(formatted);
    try {
      if (error) {
        Sentry.captureException(error, { extra: context });
      } else {
        Sentry.captureMessage(message, { level: "error", extra: context });
      }
    } catch (sentryErr) {
      console.error("[Logger] Failed to report to Sentry:", sentryErr);
    }
  } else if (level === "warn") {
    console.warn(formatted);
    try {
      Sentry.captureMessage(message, { level: "warning", extra: context });
    } catch (sentryErr) {
      console.error("[Logger] Failed to report warn to Sentry:", sentryErr);
    }
  } else {
    console.info(formatted);
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) => log("debug", message, context),
  info: (message: string, context?: LogContext) => log("info", message, context),
  warn: (message: string, context?: LogContext) => log("warn", message, context),
  error: (message: string, context?: LogContext, error?: Error) =>
    log("error", message, context, error),
};
