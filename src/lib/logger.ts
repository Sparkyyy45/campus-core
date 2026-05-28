// src/lib/logger.ts

type LogLevel = "info" | "warn" | "error";

interface LogContext {
  userId?: string;
  ip?: string;
  resourceId?: string;
  [key: string]: any;
}

const isProduction = process.env.NODE_ENV === "production";

function log(level: LogLevel, message: string, context?: LogContext) {
  const timestamp = new Date().toISOString();

  if (isProduction) {
    // Structured JSON logging for production log aggregators
    const logPayload = {
      timestamp,
      level,
      message,
      environment: "production",
      ...context,
    };
    console.log(JSON.stringify(logPayload));
  } else {
    // Prettified colored logging for local development
    const color =
      level === "error"
        ? "\x1b[31m" // red
        : level === "warn"
          ? "\x1b[33m" // yellow
          : "\x1b[36m"; // cyan
    const reset = "\x1b[0m";
    const contextStr = context ? ` ${JSON.stringify(context)}` : "";
    console.log(
      `[${timestamp}] ${color}${level.toUpperCase()}${reset}: ${message}${contextStr}`
    );
  }
}

export const logger = {
  info: (message: string, context?: LogContext) =>
    log("info", message, context),
  warn: (message: string, context?: LogContext) =>
    log("warn", message, context),
  error: (message: string, context?: LogContext) =>
    log("error", message, context),
};
export default logger;
