import type { NextFunction, Request, Response } from "express";
import { MongoServerError } from "mongodb";
import { ZodError } from "zod";

import { AppError } from "@/common/errors/AppError";

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (res.headersSent) {
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      errors: error.flatten(),
    });

    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
      ...(error.details ? { details: error.details } : {}),
    });

    return;
  }

  if (error instanceof MongoServerError && error.code === 11000) {
    res.status(409).json({
      message: "Duplicate resource",
      code: "DUPLICATE_RESOURCE",
    });

    return;
  }

  const message =
    error instanceof Error && process.env.NODE_ENV !== "production"
      ? error.message
      : "Internal server error";

  res.status(500).json({
    message,
    code: "INTERNAL_SERVER_ERROR",
  });
}
