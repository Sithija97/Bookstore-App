import { Router } from "express";
import { authRouter } from "@/features/auth/router/auth.router";
import { userRouter } from "@/features/users";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);

export default router;
