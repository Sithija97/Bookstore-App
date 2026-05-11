import { z } from "zod";

const trimmedString = z.string().trim().min(1);

export const createUserSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
  name: trimmedString.max(100),
  role: z.enum(["user", "admin"]).optional(),
});

export const userIdSchema = z.object({
  userId: z.string().min(1),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
