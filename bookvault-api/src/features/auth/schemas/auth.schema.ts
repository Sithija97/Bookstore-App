import { z } from "zod";

const emailSchema = z.string().trim().email();
const passwordSchema = z.string().min(8).max(128);
const csrfSchema = z.string().min(8).optional();
const refreshTokenSchema = z.string().min(1).optional();

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().trim().min(1).max(100),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const refreshSchema = z.object({
  refreshToken: refreshTokenSchema,
  csrfToken: csrfSchema,
});

export const logoutSchema = refreshSchema;

export const logoutAllSchema = z.object({
  csrfToken: csrfSchema,
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type RefreshSchema = z.infer<typeof refreshSchema>;
