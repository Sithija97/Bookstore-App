export type RefreshTokenStatus = "active" | "rotated" | "revoked" | "reused";

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
}

export interface AuthResponseTokens {
  accessToken: string;
}

export interface AuthResponse {
  user: SafeUser;
  tokens: AuthResponseTokens;
}

export interface AccessTokenClaims {
  sub: string;
  email: string;
  role: "user" | "admin";
  tokenVersion: number;
  type: "access";
  jti: string;
}

export interface RefreshTokenClaims {
  sub: string;
  familyId: string;
  tokenVersion: number;
  type: "refresh";
  jti: string;
  parentTokenId?: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: "user" | "admin";
  tokenVersion: number;
}

export interface RequestContext {
  ip?: string;
  userAgent?: string;
}
