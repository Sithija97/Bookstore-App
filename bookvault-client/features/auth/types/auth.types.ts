export interface SafeUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export interface AuthTokens {
  accessToken: string;
  expiresAt: string;
}

export interface AuthResponse {
  user: SafeUser;
  tokens: AuthTokens;
}
