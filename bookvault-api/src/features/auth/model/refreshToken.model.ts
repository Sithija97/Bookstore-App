import { Schema, model } from "mongoose";

import type { RefreshTokenDocumentData } from "../types/auth.types";

const refreshTokenSchema = new Schema<RefreshTokenDocumentData>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    tokenId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    familyId: {
      type: String,
      required: true,
      index: true,
    },
    parentTokenId: {
      type: String,
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "rotated", "revoked", "reused"],
      default: "active",
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    rotatedAt: {
      type: Date,
      default: null,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    replacedByTokenId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
refreshTokenSchema.index({ familyId: 1, status: 1 });

export const RefreshTokenModel = model<RefreshTokenDocumentData>(
  "RefreshToken",
  refreshTokenSchema,
);
