import { Schema, model, type HydratedDocument } from "mongoose";

import type { UserDocumentData } from "@/features/users/types/user.types";

export interface UserDocument extends HydratedDocument<UserDocumentData> {
  isLocked(): boolean;
  incrementFailedLoginAttempts(): Promise<this>;
  resetLoginState(): Promise<this>;
}

const userSchema = new Schema<UserDocumentData>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    tokenVersion: {
      type: Number,
      default: 0,
      required: true,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
      required: true,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.methods.isLocked = function isLocked(): boolean {
  return Boolean(this.lockUntil && this.lockUntil.getTime() > Date.now());
};

userSchema.methods.incrementFailedLoginAttempts =
  async function incrementFailedLoginAttempts(): Promise<unknown> {
    this.failedLoginAttempts += 1;

    const attemptsOverThreshold = this.failedLoginAttempts >= 5;
    if (attemptsOverThreshold) {
      const lockMinutes = Math.min(
        60,
        5 * 2 ** Math.max(0, this.failedLoginAttempts - 5),
      );
      this.lockUntil = new Date(Date.now() + lockMinutes * 60 * 1000);
    }

    await this.save();
    return this;
  };

userSchema.methods.resetLoginState =
  async function resetLoginState(): Promise<unknown> {
    this.failedLoginAttempts = 0;
    this.lockUntil = null;
    await this.save();
    return this;
  };

export const UserModel = model<UserDocumentData>("User", userSchema);
