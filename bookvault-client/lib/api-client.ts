import { env } from "@/lib/env";
import { useAuthStore } from "@/features/auth/store/auth.store";

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

export async function authFetch(
  path: string,
  options: RequestOptions = {},
): Promise<Response> {
  const { accessToken } = useAuthStore.getState();
  const { body, headers, ...rest } = options;

  return fetch(`${env.apiBaseUrl}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(headers as Record<string, string> | undefined),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}
