import type {
  AuthResponse,
  AuthTokens,
  RefreshTokenStatus,
  SafeUser,
} from "@/common/types/auth";

export type { AuthResponse, AuthTokens, RefreshTokenStatus, SafeUser };

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshInput {
  refreshToken?: string;
  csrfToken?: string;
}

export interface LogoutInput extends RefreshInput {}

export interface RefreshTokenDocumentData {
  userId: string;
  tokenId: string;
  tokenHash: string;
  familyId: string;
  parentTokenId?: string | null;
  status: RefreshTokenStatus;
  expiresAt: Date;
  createdAt: Date;
  rotatedAt?: Date | null;
  revokedAt?: Date | null;
  replacedByTokenId?: string | null;
}
