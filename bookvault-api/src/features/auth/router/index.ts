import { Router } from "express";
import { authRouter } from "@/features/auth/router/auth.router";
import { booksRouter } from "@/features/books";
import { userRouter } from "@/features/users";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/books", booksRouter);

export default router;
