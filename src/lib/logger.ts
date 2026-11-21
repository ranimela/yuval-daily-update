export type LogLevel = "info" | "warn" | "error";

export interface LogContext {
  correlationId: string;
  module: string;
  [key: string]: unknown;
}

const REDACTED_KEYS = new Set([
  "password",
  "app_password",
  "session_secret",
  "cron_secret",
  "database_url",
  "cookie",
  "authorization",
  "token",
  "secret",
]);

function redactValue(key: string, value: unknown): unknown {
  if (REDACTED_KEYS.has(key.toLowerCase())) {
    return "[REDACTED]";
  }
  return value;
}

function formatError(err: unknown): { errorMessage: string; stack?: string } {
  if (err instanceof Error) {
    return {
      errorMessage: err.message,
      stack: err.stack,
    };
  }
  return { errorMessage: String(err) };
}

/**
 * Emit structured JSON logs with timestamp, level, correlationId, and sanitized metadata.
 */
export function logEvent(
  level: LogLevel,
  message: string,
  context: LogContext,
  err?: unknown
): void {
  const sanitizedContext: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(context)) {
    sanitizedContext[key] = redactValue(key, value);
  }

  const payload: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...sanitizedContext,
  };

  if (err !== undefined) {
    payload.error = formatError(err);
  }

  const serialized = JSON.stringify(payload);
  if (level === "error") {
    console.error(serialized);
  } else if (level === "warn") {
    console.warn(serialized);
  } else {
    console.info(serialized);
  }
}

export function createCorrelationId(): string {
  return crypto.randomUUID();
}
