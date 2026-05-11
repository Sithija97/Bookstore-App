import { RefreshTokenModel } from "@/features/auth/model/refreshToken.model";
import type { RefreshTokenDocumentData } from "@/features/auth/types/auth.types";

export async function createRefreshTokenRecord(
  record: RefreshTokenDocumentData,
): Promise<RefreshTokenDocumentData> {
  const created = await RefreshTokenModel.create(record);
  return created.toObject();
}

export async function findRefreshTokenByHash(tokenHash: string) {
  return RefreshTokenModel.findOne({ tokenHash }).lean();
}

export async function findRefreshTokenById(tokenId: string) {
  return RefreshTokenModel.findOne({ tokenId }).lean();
}

export async function markRefreshTokenRotated(
  tokenId: string,
  replacedByTokenId: string,
  rotatedAt = new Date(),
): Promise<void> {
  await RefreshTokenModel.updateOne(
    { tokenId },
    {
      $set: {
        status: "rotated",
        rotatedAt,
        replacedByTokenId,
      },
    },
  );
}

export async function markRefreshTokenRevoked(
  tokenId: string,
  revokedAt = new Date(),
): Promise<void> {
  await RefreshTokenModel.updateOne(
    { tokenId },
    {
      $set: {
        status: "revoked",
        revokedAt,
      },
    },
  );
}

export async function markRefreshTokenReused(
  tokenId: string,
  revokedAt = new Date(),
): Promise<void> {
  await RefreshTokenModel.updateOne(
    { tokenId },
    {
      $set: {
        status: "reused",
        revokedAt,
      },
    },
  );
}

export async function revokeFamily(
  familyId: string,
  status: "revoked" | "reused" = "revoked",
): Promise<void> {
  await RefreshTokenModel.updateMany(
    { familyId, status: { $in: ["active", "rotated"] } },
    {
      $set: {
        status,
        revokedAt: new Date(),
      },
    },
  );
}

export async function revokeAllForUser(
  userId: string,
  status: "revoked" | "reused" = "revoked",
): Promise<void> {
  await RefreshTokenModel.updateMany(
    { userId, status: { $in: ["active", "rotated"] } },
    {
      $set: {
        status,
        revokedAt: new Date(),
      },
    },
  );
}

export async function countActiveSessions(userId: string): Promise<number> {
  return RefreshTokenModel.countDocuments({ userId, status: "active" });
}
