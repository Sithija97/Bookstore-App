import crypto from "crypto";

import bcrypt from "bcryptjs";

import { env } from "@/common/config";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, env.bcryptRounds);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function hashToken(token: string): string {
  return crypto
    .createHmac("sha256", env.tokenHashSecret)
    .update(token)
    .digest("hex");
}

export function createCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
