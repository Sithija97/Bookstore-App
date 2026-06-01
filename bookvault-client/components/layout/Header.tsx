"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bell, LoaderCircle, LogOut, Search } from "lucide-react";
import { toast } from "sonner";
import { logoutApi } from "@/features/auth/services/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (value.trim()) {
          params.set("search", value.trim());
          params.delete("page");
        } else {
          params.delete("search");
          params.delete("page");
        }
        router.push(`/?${params.toString()}`);
      }, 400);
    },
    [router, searchParams],
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutApi();
    } catch {
      // Clear local auth even if the server call fails
    } finally {
      clearAuth();
      setDropdownOpen(false);
      setIsLoggingOut(false);
      toast.success("Signed out successfully");
      router.push("/login");
    }
  };

  const initials = user ? getInitials(user.name) : "?";

  return (
    <header className="flex items-center justify-between border-b border-zinc-100 bg-white px-6 py-3.5">
      {/* Search */}
      <div className="relative">
        <Search
          size={13}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="text"
          placeholder="Search books..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-8 w-150 rounded-lg border border-zinc-200 bg-zinc-50 pl-8 pr-3 text-xs text-zinc-700 placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          aria-label="Notifications"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-50"
        >
          <Bell size={14} />
        </button>

        {/* Avatar + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            aria-label="Account menu"
            aria-expanded={dropdownOpen}
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white transition-opacity hover:opacity-80"
          >
            {initials}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-10 z-50 w-52 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
              {user && (
                <div className="border-b border-zinc-100 px-3 py-2.5">
                  <p className="truncate text-xs font-semibold text-zinc-800">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-zinc-500">{user.email}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <LoaderCircle size={13} className="animate-spin" />
                ) : (
                  <LogOut size={13} />
                )}
                {isLoggingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
