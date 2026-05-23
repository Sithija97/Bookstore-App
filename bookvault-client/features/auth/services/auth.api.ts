import { env } from "@/lib/env";
import type { AuthResponse } from "../types/auth.types";

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.message ?? `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

export async function loginApi(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${env.apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function registerApi(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${env.apiBaseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function logoutApi(): Promise<void> {
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrf_token="))
    ?.split("=")[1];

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (csrfToken) headers["x-csrf-token"] = csrfToken;

  await fetch(`${env.apiBaseUrl}/auth/logout`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({}),
  });
}
