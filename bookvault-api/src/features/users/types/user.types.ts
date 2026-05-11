import type { SafeUser } from "@/common/types/auth";

export type UserRole = "user" | "admin";

export interface UserDocumentData {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  tokenVersion: number;
  failedLoginAttempts: number;
  lockUntil?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  name: string;
  role?: UserRole;
}

export interface PublicUser extends SafeUser {}
