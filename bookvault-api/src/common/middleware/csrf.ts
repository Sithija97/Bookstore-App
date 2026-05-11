import type { NextFunction, Request, Response } from "express";

import { AppError } from "@/common/errors/AppError";
import { env } from "@/common/config";
import { getCsrfTokenFromRequest } from "@/common/utils/cookies";

export function requireCsrfIfCookieAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const refreshCookiePresent = Boolean(req.cookies?.[env.refreshCookieName]);

  if (!refreshCookiePresent) {
    next();
    return;
  }

  const csrfToken = getCsrfTokenFromRequest(req);
  const cookieToken = req.cookies?.[env.csrfCookieName];

  if (!csrfToken || !cookieToken || csrfToken !== cookieToken) {
    next(new AppError(403, "CSRF validation failed", "CSRF_FAILED"));
    return;
  }

  next();
}
