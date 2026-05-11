import type { Request, Response } from "express";

import { AppError } from "@/common/errors/AppError";
import {
  getCsrfTokenFromRequest,
  getRefreshTokenFromRequest,
} from "@/common/utils/cookies";
import {
  login,
  logoutAllSessions,
  logoutSingleSession,
  refreshSession,
  register,
} from "@/features/auth/service/auth.service";

export async function registerController(
  req: Request,
  res: Response,
): Promise<void> {
  const body = req.validatedBody as {
    email: string;
    password: string;
    name: string;
  };
  const result = await register(body, res);
  res.status(201).json(result);
}

export async function loginController(
  req: Request,
  res: Response,
): Promise<void> {
  const body = req.validatedBody as { email: string; password: string };
  const result = await login(body, res);
  res.json(result);
}

export async function refreshController(
  req: Request,
  res: Response,
): Promise<void> {
  const refreshToken = getRefreshTokenFromRequest(req);
  const csrfToken = getCsrfTokenFromRequest(req);

  if (!refreshToken) {
    throw new AppError(401, "Refresh token missing", "REFRESH_TOKEN_MISSING");
  }

  const result = await refreshSession(refreshToken, csrfToken, res);
  res.json(result);
}

export async function logoutController(
  req: Request,
  res: Response,
): Promise<void> {
  const refreshToken = getRefreshTokenFromRequest(req);

  if (!refreshToken) {
    throw new AppError(401, "Refresh token missing", "REFRESH_TOKEN_MISSING");
  }

  await logoutSingleSession(refreshToken, res);
  res.status(204).send();
}

export async function logoutAllController(
  req: Request,
  res: Response,
): Promise<void> {
  if (!req.authUser) {
    throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
  }

  await logoutAllSessions(req.authUser.id, res);
  res.status(204).send();
}

/* 
export async function meController(req: Request, res: Response): Promise<void> {
  if (!req.authUser) {
    throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
  }

  res.json({ user: req.authUser });
}
*/
