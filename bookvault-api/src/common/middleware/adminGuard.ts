import type { NextFunction, Request, Response } from "express";

import { AppError } from "@/common/errors/AppError";

export function adminGuard(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!req.authUser) {
    next(new AppError(401, "Unauthorized", "UNAUTHORIZED"));
    return;
  }

  if (req.authUser.role !== "admin") {
    next(new AppError(403, "Admin access required", "FORBIDDEN"));
    return;
  }

  next();
}
