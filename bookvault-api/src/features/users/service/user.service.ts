import type { PublicUser } from "@/features/users/types/user.types";
import {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByIdForAuth,
  findUserForAuth,
  incrementTokenVersion,
  resetLoginFailure,
  updateLoginFailure,
} from "@/features/users/repository/user.repository";

export {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByIdForAuth,
  findUserForAuth,
  incrementTokenVersion,
  resetLoginFailure,
  updateLoginFailure,
};

export async function getPublicUser(
  userId: string,
): Promise<PublicUser | null> {
  const user = await findUserById(userId);
  return user ?? null;
}
