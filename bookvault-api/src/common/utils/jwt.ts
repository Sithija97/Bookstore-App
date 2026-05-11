import jwt from "jsonwebtoken";

import { env } from "@/common/config";
import type { AccessTokenClaims, RefreshTokenClaims } from "@/common/types/auth";
import { parseDurationToSeconds } from "@/common/utils/duration";

function getSigningOptions(type: "access" | "refresh") {
  return {
    algorithm: env.jwtAlgorithm,
    expiresIn: parseDurationToSeconds(
      type === "access" ? env.accessTokenTtl : env.refreshTokenTtl,
    ),
  } as const;
}

function getSignKey(type: "access" | "refresh") {
  if (env.jwtAlgorithm === "RS256") {
    return env.jwtPrivateKey;
  }

  return type === "access" ? env.jwtAccessSecret : env.jwtRefreshSecret;
}

function getVerifyKey(type: "access" | "refresh") {
  if (env.jwtAlgorithm === "RS256") {
    return env.jwtPublicKey;
  }

  return type === "access" ? env.jwtAccessSecret : env.jwtRefreshSecret;
}

export function signAccessToken(
  claims: Omit<AccessTokenClaims, "type">,
): string {
  return jwt.sign(
    { ...claims, type: "access" },
    getSignKey("access") as jwt.Secret,
    getSigningOptions("access"),
  );
}

export function signRefreshToken(
  claims: Omit<RefreshTokenClaims, "type">,
): string {
  return jwt.sign(
    { ...claims, type: "refresh" },
    getSignKey("refresh") as jwt.Secret,
    getSigningOptions("refresh"),
  );
}

export function verifyAccessToken(token: string): AccessTokenClaims {
  const payload = jwt.verify(token, getVerifyKey("access") as jwt.Secret, {
    algorithms: [env.jwtAlgorithm],
  });
  return payload as AccessTokenClaims;
}

export function verifyRefreshToken(token: string): RefreshTokenClaims {
  const payload = jwt.verify(token, getVerifyKey("refresh") as jwt.Secret, {
    algorithms: [env.jwtAlgorithm],
  });
  return payload as RefreshTokenClaims;
}
