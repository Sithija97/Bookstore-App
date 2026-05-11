import rateLimit from "express-rate-limit";

import { env } from "@/common/config";

export const loginLimiter = rateLimit({
  windowMs: env.loginRateLimitWindowMinutes * 60 * 1000,
  limit: env.loginRateLimitMax,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many login attempts", code: "RATE_LIMITED" },
});

export const refreshLimiter = rateLimit({
  windowMs: env.refreshRateLimitWindowMinutes * 60 * 1000,
  limit: env.refreshRateLimitMax,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many refresh attempts", code: "RATE_LIMITED" },
});
