import { Router } from "express";

import { asyncHandler } from "@/common/errors/asyncHandler";
import {
  authGuard,
  loginLimiter,
  refreshLimiter,
  requireCsrfIfCookieAuth,
  validateBody,
} from "@/common/middleware";
import {
  loginSchema,
  logoutAllSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
} from "@/features/auth/schemas/auth.schema";
import {
  loginController,
  logoutAllController,
  logoutController,
  meController,
  refreshController,
  registerController,
} from "@/features/auth/controller/auth.controller";

const authRouter = Router();

authRouter.post(
  "/register",
  loginLimiter,
  validateBody(registerSchema),
  asyncHandler(registerController),
);
authRouter.post(
  "/login",
  loginLimiter,
  validateBody(loginSchema),
  asyncHandler(loginController),
);
authRouter.post(
  "/refresh",
  refreshLimiter,
  validateBody(refreshSchema),
  requireCsrfIfCookieAuth,
  asyncHandler(refreshController),
);
authRouter.post(
  "/logout",
  refreshLimiter,
  validateBody(logoutSchema),
  requireCsrfIfCookieAuth,
  asyncHandler(logoutController),
);
authRouter.post(
  "/logout-all",
  authGuard,
  refreshLimiter,
  validateBody(logoutAllSchema),
  requireCsrfIfCookieAuth,
  asyncHandler(logoutAllController),
);
authRouter.get("/me", authGuard, asyncHandler(meController));

export { authRouter };
