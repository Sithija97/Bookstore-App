"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookMarked, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { registerApi } from "@/features/auth/services/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { cn } from "@/lib/utils";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validate(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): FieldErrors {
  const errors: FieldErrors = {};

  if (!name.trim()) {
    errors.name = "Name is required.";
  } else if (name.trim().length > 100) {
    errors.name = "Name must be at most 100 characters.";
  }

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (password.length > 128) {
    errors.password = "Password must be at most 128 characters.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validate(name, email, password, confirmPassword);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    try {
      const { user, tokens } = await registerApi(name.trim(), email, password);
      setAuth(user, tokens.accessToken);
      toast.success("Account created!", {
        description: `Welcome to BookVault, ${user.name}!`,
      });
      router.push("/");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      toast.error("Registration failed", { description: message });
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
          <p className="mt-0.5 text-sm text-zinc-500">Create your account</p>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-medium text-zinc-700">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name)
                  setFieldErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Jane Smith"
              className={cn(
                "h-9 w-full rounded-lg border bg-zinc-50 px-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors",
                fieldErrors.name
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-zinc-200 focus:border-zinc-400 focus:ring-zinc-200",
              )}
            />
            {fieldErrors.name && (
              <p className="text-xs text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reg-email"
              className="text-xs font-medium text-zinc-700"
            >
              Email address
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email)
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="you@example.com"
              className={cn(
                "h-9 w-full rounded-lg border bg-zinc-50 px-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors",
                fieldErrors.email
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-zinc-200 focus:border-zinc-400 focus:ring-zinc-200",
              )}
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reg-password"
              className="text-xs font-medium text-zinc-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password)
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                }}
                placeholder="Min. 8 characters"
                className={cn(
                  "h-9 w-full rounded-lg border bg-zinc-50 px-3 pr-9 text-sm text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors",
                  fieldErrors.password
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-zinc-200 focus:border-zinc-400 focus:ring-zinc-200",
                )}
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
            {fieldErrors.password && (
              <p className="text-xs text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirm-password"
              className="text-xs font-medium text-zinc-700"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword)
                    setFieldErrors((prev) => ({
                      ...prev,
                      confirmPassword: undefined,
                    }));
                }}
                placeholder="••••••••"
                className={cn(
                  "h-9 w-full rounded-lg border bg-zinc-50 px-3 pr-9 text-sm text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors",
                  fieldErrors.confirmPassword
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-zinc-200 focus:border-zinc-400 focus:ring-zinc-200",
                )}
              />
              <button
                type="button"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-red-600">
                {fieldErrors.confirmPassword}
              </p>
            )}
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
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>
      </div>

      {/* Login link */}
      <p className="mt-5 text-center text-xs text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-zinc-800 underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
