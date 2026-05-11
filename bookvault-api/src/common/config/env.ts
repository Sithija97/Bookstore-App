import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const booleanFromEnv = z
  .union([z.string(), z.boolean()])
  .optional()
  .transform((value) => {
    if (typeof value === "boolean") {
      return value;
    }

    if (value === undefined || value === "") {
      return undefined;
    }

    return ["true", "1", "yes", "on"].includes(value.toLowerCase());
  });

const csvFromEnv = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (!value) {
      return [];
    }

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  });

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    JWT_ALGORITHM: z.enum(["HS256", "RS256"]).default("HS256"),
    JWT_ACCESS_SECRET: z.string().optional(),
    JWT_REFRESH_SECRET: z.string().optional(),
    JWT_PRIVATE_KEY: z.string().optional(),
    JWT_PUBLIC_KEY: z.string().optional(),
    TOKEN_HASH_SECRET: z
      .string()
      .min(16, "TOKEN_HASH_SECRET must be at least 16 characters"),
    ACCESS_TOKEN_TTL: z.string().default("15m"),
    REFRESH_TOKEN_TTL: z.string().default("7d"),
    CORS_ORIGINS: csvFromEnv.default([
      "http://localhost:3000",
      "http://localhost:5173",
    ]),
    COOKIE_SECURE: booleanFromEnv.default(false),
    COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
    COOKIE_DOMAIN: z.string().optional(),
    COOKIE_PATH: z.string().default("/"),
    REFRESH_COOKIE_NAME: z.string().default("refresh_token"),
    CSRF_COOKIE_NAME: z.string().default("csrf_token"),
    CSRF_HEADER_NAME: z.string().default("x-csrf-token"),
    BCRYPT_ROUNDS: z.coerce.number().int().min(8).max(15).default(12),
    LOGIN_RATE_LIMIT_WINDOW_MINUTES: z.coerce
      .number()
      .int()
      .positive()
      .default(15),
    LOGIN_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),
    REFRESH_RATE_LIMIT_WINDOW_MINUTES: z.coerce
      .number()
      .int()
      .positive()
      .default(10),
    REFRESH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(30),
    LOGIN_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),
    LOGIN_LOCK_BASE_MINUTES: z.coerce.number().int().positive().default(5),
    LOGIN_LOCK_MAX_MINUTES: z.coerce.number().int().positive().default(60),
    REFRESH_REUSE_REVOKE_SCOPE: z.enum(["family", "user"]).default("user"),
  })
  .superRefine((value, ctx) => {
    if (value.JWT_ALGORITHM === "HS256") {
      if (!value.JWT_ACCESS_SECRET) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["JWT_ACCESS_SECRET"],
          message: "JWT_ACCESS_SECRET is required for HS256",
        });
      }

      if (!value.JWT_REFRESH_SECRET) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["JWT_REFRESH_SECRET"],
          message: "JWT_REFRESH_SECRET is required for HS256",
        });
      }
    }

    if (value.JWT_ALGORITHM === "RS256") {
      if (!value.JWT_PRIVATE_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["JWT_PRIVATE_KEY"],
          message: "JWT_PRIVATE_KEY is required for RS256",
        });
      }

      if (!value.JWT_PUBLIC_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["JWT_PUBLIC_KEY"],
          message: "JWT_PUBLIC_KEY is required for RS256",
        });
      }
    }

    if (value.COOKIE_SAME_SITE === "none" && !value.COOKIE_SECURE) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["COOKIE_SECURE"],
        message: "COOKIE_SECURE must be enabled when COOKIE_SAME_SITE is none",
      });
    }
  });

const parsedEnv = envSchema.parse(process.env);

export const env = {
  nodeEnv: parsedEnv.NODE_ENV,
  port: parsedEnv.PORT,
  mongoUri: parsedEnv.MONGODB_URI,
  jwtAlgorithm: parsedEnv.JWT_ALGORITHM,
  jwtAccessSecret: parsedEnv.JWT_ACCESS_SECRET ?? "",
  jwtRefreshSecret: parsedEnv.JWT_REFRESH_SECRET ?? "",
  jwtPrivateKey: parsedEnv.JWT_PRIVATE_KEY ?? "",
  jwtPublicKey: parsedEnv.JWT_PUBLIC_KEY ?? "",
  tokenHashSecret: parsedEnv.TOKEN_HASH_SECRET,
  accessTokenTtl: parsedEnv.ACCESS_TOKEN_TTL,
  refreshTokenTtl: parsedEnv.REFRESH_TOKEN_TTL,
  corsOrigins: parsedEnv.CORS_ORIGINS,
  cookieSecure: parsedEnv.COOKIE_SECURE ?? false,
  cookieSameSite: parsedEnv.COOKIE_SAME_SITE,
  cookieDomain: parsedEnv.COOKIE_DOMAIN,
  cookiePath: parsedEnv.COOKIE_PATH,
  refreshCookieName: parsedEnv.REFRESH_COOKIE_NAME,
  csrfCookieName: parsedEnv.CSRF_COOKIE_NAME,
  csrfHeaderName: parsedEnv.CSRF_HEADER_NAME,
  bcryptRounds: parsedEnv.BCRYPT_ROUNDS,
  loginRateLimitWindowMinutes: parsedEnv.LOGIN_RATE_LIMIT_WINDOW_MINUTES,
  loginRateLimitMax: parsedEnv.LOGIN_RATE_LIMIT_MAX,
  refreshRateLimitWindowMinutes: parsedEnv.REFRESH_RATE_LIMIT_WINDOW_MINUTES,
  refreshRateLimitMax: parsedEnv.REFRESH_RATE_LIMIT_MAX,
  loginMaxAttempts: parsedEnv.LOGIN_MAX_ATTEMPTS,
  loginLockBaseMinutes: parsedEnv.LOGIN_LOCK_BASE_MINUTES,
  loginLockMaxMinutes: parsedEnv.LOGIN_LOCK_MAX_MINUTES,
  refreshReuseRevokeScope: parsedEnv.REFRESH_REUSE_REVOKE_SCOPE,
} as const;
