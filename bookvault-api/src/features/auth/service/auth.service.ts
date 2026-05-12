import type { Response } from "express";

import { env } from "@/common/config";
import { AppError } from "@/common/errors/AppError";
import type { AuthResponse, AuthTokens, SafeUser } from "@/common/types/auth";
import {
  comparePassword,
  createCsrfToken,
  generateId,
  hashPassword,
  hashToken,
  parseDurationToMilliseconds,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/common/utils";
import {
  clearCsrfCookie,
  clearRefreshTokenCookie,
  setCsrfCookie,
  setRefreshTokenCookie,
} from "@/common/utils/cookies";
import {
  createUser,
  findUserByEmail,
  findUserByIdForAuth,
  findUserForAuth,
  incrementTokenVersion,
} from "@/features/users/service/user.service";
import {
  createRefreshTokenRecord,
  findRefreshTokenByHash,
  markRefreshTokenReused,
  markRefreshTokenRevoked,
  markRefreshTokenRotated,
  revokeAllForUser,
  revokeFamily,
} from "@/features/auth/repository/auth.repository";
import type {
  LoginInput,
  RegisterInput,
  RefreshTokenDocumentData,
} from "../types/auth.types";

export async function register(
  input: RegisterInput,
  response: Response,
): Promise<AuthResponse> {
  const existingUser = await findUserByEmail(input.email);
  if (existingUser) {
    throw new AppError(409, "Email already in use", "EMAIL_TAKEN");
  }

  const user = await createUser({
    email: input.email,
    passwordHash: await hashPassword(input.password),
    name: input.name,
  });

  const tokens = await issueTokensForUser(user);
  writeSessionCookies(response, tokens);

  return { user, tokens: toAuthResponseTokens(tokens) };
}

export async function login(
  input: LoginInput,
  response: Response,
): Promise<AuthResponse> {
  const userRecord = (await findUserForAuth(input.email)) as any;

  if (!userRecord) {
    await maybeDelayForFailedLogin();
    throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
  }

  if (userRecord.isLocked()) {
    throw new AppError(423, "Account locked temporarily", "ACCOUNT_LOCKED");
  }

  const passwordMatches = await comparePassword(
    input.password,
    userRecord.passwordHash,
  );
  if (!passwordMatches) {
    await userRecord.incrementFailedLoginAttempts();
    throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
  }

  await userRecord.resetLoginState();

  const user: SafeUser = toSafeUser(userRecord);
  const tokens = await issueTokensForUser(user);
  writeSessionCookies(response, tokens);

  return { user, tokens: toAuthResponseTokens(tokens) };
}

export async function refreshSession(
  refreshToken: string,
  csrfToken: string | undefined,
  response: Response,
): Promise<AuthResponse> {
  if (!csrfToken) {
    throw new AppError(403, "CSRF token missing", "CSRF_FAILED");
  }

  verifyRefreshToken(refreshToken);
  const tokenHash = hashToken(refreshToken);
  const tokenRecord = await findRefreshTokenByHash(tokenHash);

  if (!tokenRecord) {
    throw new AppError(401, "Invalid refresh token", "INVALID_REFRESH_TOKEN");
  }

  if (tokenRecord.status !== "active") {
    await handleRefreshReuse(tokenRecord);
    throw new AppError(
      401,
      "Refresh token reuse detected",
      "REFRESH_REUSE_DETECTED",
    );
  }

  if (tokenRecord.expiresAt.getTime() <= Date.now()) {
    await markRefreshTokenRevoked(tokenRecord.tokenId);
    throw new AppError(401, "Expired refresh token", "REFRESH_TOKEN_EXPIRED");
  }

  const userRecord = await findUserByIdForAuth(tokenRecord.userId);
  if (!userRecord) {
    await markRefreshTokenRevoked(tokenRecord.tokenId);
    throw new AppError(
      401,
      "Refresh token subject missing",
      "INVALID_REFRESH_TOKEN",
    );
  }

  const oldTokenId = tokenRecord.tokenId;
  const nextTokenId = generateId();
  const nextFamilyId = tokenRecord.familyId;
  const nextTokens = await issueTokensForUser(
    toSafeUser(userRecord),
    nextFamilyId,
    oldTokenId,
    nextTokenId,
  );

  await markRefreshTokenRotated(oldTokenId, nextTokenId);
  writeSessionCookies(response, nextTokens);

  return {
    user: toSafeUser(userRecord),
    tokens: toAuthResponseTokens(nextTokens),
  };
}

export async function logoutSingleSession(
  refreshToken: string,
  response: Response,
): Promise<void> {
  const tokenHash = hashToken(refreshToken);
  const tokenRecord = await findRefreshTokenByHash(tokenHash);

  if (tokenRecord) {
    await markRefreshTokenRevoked(tokenRecord.tokenId);
  }

  clearSessionCookies(response);
}

export async function logoutAllSessions(
  userId: string,
  response: Response,
): Promise<void> {
  await revokeAllForUser(userId, "revoked");
  await incrementTokenVersion(userId);
  clearSessionCookies(response);
}

export async function handleRefreshReuse(
  tokenRecord: RefreshTokenDocumentData,
): Promise<void> {
  await markRefreshTokenReused(tokenRecord.tokenId);

  if (env.refreshReuseRevokeScope === "family") {
    await revokeFamily(tokenRecord.familyId, "reused");
  } else {
    await revokeAllForUser(String(tokenRecord.userId), "reused");
    await incrementTokenVersion(String(tokenRecord.userId));
  }
}

async function issueTokensForUser(
  user: SafeUser,
  familyId = generateId(),
  parentTokenId?: string,
  tokenId = generateId(),
): Promise<AuthTokens> {
  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion,
    jti: generateId(),
  });

  const refreshClaims = {
    sub: user.id,
    familyId,
    tokenVersion: user.tokenVersion,
    jti: tokenId,
    ...(parentTokenId ? { parentTokenId } : {}),
  };

  const refreshToken = signRefreshToken(refreshClaims);
  const csrfToken = createCsrfToken();
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(
    Date.now() + parseDurationToMilliseconds(env.refreshTokenTtl),
  );

  await createRefreshTokenRecord({
    userId: user.id,
    tokenId,
    tokenHash,
    familyId,
    parentTokenId: parentTokenId ?? null,
    status: "active",
    expiresAt,
    createdAt: new Date(),
    rotatedAt: null,
    revokedAt: null,
    replacedByTokenId: null,
  });

  return { accessToken, refreshToken, csrfToken };
}

function writeSessionCookies(response: Response, tokens: AuthTokens): void {
  setRefreshTokenCookie(response, tokens.refreshToken);
  setCsrfCookie(response, tokens.csrfToken);
}

function clearSessionCookies(response: Response): void {
  clearRefreshTokenCookie(response);
  clearCsrfCookie(response);
}

function toAuthResponseTokens(tokens: AuthTokens): { accessToken: string } {
  return { accessToken: tokens.accessToken };
}

function toSafeUser(user: {
  _id: unknown;
  email: string;
  name: string;
  role: "user" | "admin";
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}): SafeUser {
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

async function maybeDelayForFailedLogin(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 75));
}
