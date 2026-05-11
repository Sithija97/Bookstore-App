import type { AuthenticatedUser } from "@/common/types/auth";

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthenticatedUser;
      validatedBody?: unknown;
    }
  }
}

export {};
