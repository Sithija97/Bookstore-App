import type { ProjectionType } from "mongoose";

import { UserModel } from "@/features/users/model/user.model";
import type { CreateUserInput, PublicUser } from "@/features/users/types/user.types";

const safeProjection = { passwordHash: 0 } as const;

export async function createUser(input: CreateUserInput): Promise<PublicUser> {
  const created = await UserModel.create({
    ...input,
    role: input.role ?? "user",
  });

  return toPublicUser(created.toObject() as any);
}

export async function findUserForAuth(email: string) {
  return UserModel.findOne({ email }).select("+passwordHash") as Promise<
    any | null
  >;
}

export async function findUserByIdForAuth(userId: string) {
  return UserModel.findById(userId).select("+passwordHash") as Promise<
    any | null
  >;
}

export async function findUserById(userId: string) {
  const user = await UserModel.findById(userId)
    .lean()
    .select(safeProjection as ProjectionType<unknown>);
  return user ? toPublicUser(user as any) : null;
}

export async function findUserByEmail(email: string) {
  const user = await UserModel.findOne({ email })
    .lean()
    .select(safeProjection as ProjectionType<unknown>);
  return user ? toPublicUser(user as any) : null;
}

export async function incrementTokenVersion(userId: string): Promise<void> {
  await UserModel.updateOne({ _id: userId }, { $inc: { tokenVersion: 1 } });
}

export async function updateLoginFailure(userId: string): Promise<void> {
  const user = (await UserModel.findById(userId)) as any | null;
  if (!user) {
    return;
  }

  await user.incrementFailedLoginAttempts();
}

export async function resetLoginFailure(userId: string): Promise<void> {
  const user = (await UserModel.findById(userId)) as any | null;
  if (!user) {
    return;
  }

  await user.resetLoginState();
}

function toPublicUser(user: {
  _id: unknown;
  email: string;
  name: string;
  role: "user" | "admin";
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}): PublicUser {
  return {
    id: String(user._id),
    email: user.email,
    name: user.name,
    role: user.role,
    tokenVersion: user.tokenVersion,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
