"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookMarked, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { loginApi } from "@/features/auth/services/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { user, tokens } = await loginApi(email, password);
      setAuth(user, tokens.accessToken);
      toast.success("Welcome back!", {
        description: `Signed in as ${user.name}`,
      });
      router.push("/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      toast.error("Sign in failed", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      {/* Brand */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm">
          <BookMarked size={20} />
        </div>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-zinc-900">BookVault</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Sign in to your account
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-zinc-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-medium text-zinc-700"
              >
                Password
              </label>
              {/* <Link
                href="/forgot-password"
                className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
              >
                Forgot password?
              </Link> */}
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 pr-9 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-colors"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "mt-1 flex h-9 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all active:translate-y-px",
              isLoading
                ? "cursor-not-allowed bg-zinc-700 text-zinc-300"
                : "bg-zinc-900 text-white hover:bg-zinc-700",
            )}
          >
            {isLoading ? (
              <>
                <LoaderCircle size={14} className="animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>

      {/* Register link */}
      <p className="mt-5 text-center text-xs text-zinc-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-zinc-800 underline-offset-2 hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
