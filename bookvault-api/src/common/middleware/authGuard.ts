import type { NextFunction, Request, Response } from "express";

import { AppError } from "@/common/errors/AppError";
import { verifyAccessToken } from "@/common/utils/jwt";
import { UserModel } from "@/features/users/model/user.model";

export async function authGuard(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authorizationHeader = req.header("authorization");

  if (!authorizationHeader?.startsWith("Bearer ")) {
    next(new AppError(401, "Missing access token", "UNAUTHORIZED"));
    return;
  }

  try {
    const token = authorizationHeader.slice("Bearer ".length);
    const claims = verifyAccessToken(token);
    const user = (await UserModel.findById(claims.sub).lean()) as {
      _id: unknown;
      email: string;
      role: "user" | "admin";
      tokenVersion: number;
    } | null;

    if (!user || user.tokenVersion !== claims.tokenVersion) {
      next(new AppError(401, "Invalid access token", "UNAUTHORIZED"));
      return;
    }

    req.authUser = {
      id: String(user._id),
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    next();
  } catch {
    next(new AppError(401, "Invalid access token", "UNAUTHORIZED"));
  }
}
