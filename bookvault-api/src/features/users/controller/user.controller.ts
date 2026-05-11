import type { Request, Response } from "express";

import { getPublicUser } from "@/features/users/service/user.service";
import { AppError } from "@/common/errors/AppError";

export async function meController(req: Request, res: Response): Promise<void> {
  if (!req.authUser) {
    throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
  }

  const user = await getPublicUser(req.authUser.id);

  if (!user) {
    throw new AppError(404, "User not found", "USER_NOT_FOUND");
  }

  res.json({ user });
}
