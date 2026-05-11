import type { CookieOptions, Request, Response } from "express";

import { env } from "@/common/config";

function getBaseCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    domain: env.cookieDomain,
    path: env.cookiePath,
  };
}

export function setRefreshTokenCookie(
  res: Response,
  refreshToken: string,
): void {
  res.cookie(env.refreshCookieName, refreshToken, {
    ...getBaseCookieOptions(),
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(env.refreshCookieName, getBaseCookieOptions());
}

export function setCsrfCookie(res: Response, csrfToken: string): void {
  res.cookie(env.csrfCookieName, csrfToken, {
    ...getBaseCookieOptions(),
    httpOnly: false,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
}

export function clearCsrfCookie(res: Response): void {
  res.clearCookie(env.csrfCookieName, {
    ...getBaseCookieOptions(),
    httpOnly: false,
  });
}

export function getRefreshTokenFromRequest(req: Request): string | undefined {
  const bodyRefreshToken =
    typeof req.body?.refreshToken === "string"
      ? req.body.refreshToken
      : undefined;
  const cookieRefreshToken =
    typeof req.cookies?.[env.refreshCookieName] === "string"
      ? req.cookies[env.refreshCookieName]
      : undefined;

  return bodyRefreshToken ?? cookieRefreshToken;
}

export function getCsrfTokenFromRequest(req: Request): string | undefined {
  const bodyCsrfToken =
    typeof req.body?.csrfToken === "string" ? req.body.csrfToken : undefined;
  const headerCsrfToken =
    typeof req.header(env.csrfHeaderName) === "string"
      ? (req.header(env.csrfHeaderName) ?? undefined)
      : undefined;
  const cookieCsrfToken =
    typeof req.cookies?.[env.csrfCookieName] === "string"
      ? req.cookies[env.csrfCookieName]
      : undefined;

  return bodyCsrfToken ?? headerCsrfToken ?? cookieCsrfToken;
}
