import { Router } from "express";

import { asyncHandler } from "@/common/errors/asyncHandler";
import { authGuard } from "@/common/middleware";
import { meController } from "@/features/users/controller/user.controller";

const userRouter = Router();

userRouter.get("/me", authGuard, asyncHandler(meController));

export { userRouter };
