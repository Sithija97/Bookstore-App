import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import { env } from "@/common/config";
import { errorMiddleware } from "@/common/errors/error.middleware";
import { notFoundMiddleware } from "@/common/errors/notFound.middleware";
import router from "@/features/auth/router";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "bookstore-app-api" });
  });

  app.use("/api", router);
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
