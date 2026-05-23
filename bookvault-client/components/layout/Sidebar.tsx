"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, Home, Package, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home, disabled: false },
  { label: "My Orders", href: "/orders", icon: Package, disabled: true },
  { label: "My Account", href: "/account", icon: User, disabled: true },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-zinc-100 bg-white">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-zinc-100 px-5 py-[18px]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white">
          <BookMarked size={16} />
        </div>
        <span className="text-sm font-semibold text-zinc-900">BookVault</span>
      </div>

      {/* Section label */}
      <div className="px-5 pb-1 pt-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          Store
        </p>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {NAV_ITEMS.map(({ label, href, icon: Icon, disabled }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          const baseClasses = cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            disabled
              ? "cursor-not-allowed text-zinc-300"
              : isActive
                ? "bg-blue-50 font-medium text-blue-700"
                : "font-normal text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800",
          );

          if (disabled) {
            return (
              <span key={href} aria-disabled="true" className={baseClasses}>
                <Icon size={15} />
                <span>{label}</span>
              </span>
            );
          }

          return (
            <Link key={href} href={href} className={baseClasses}>
              <Icon size={15} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-zinc-100 p-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
        >
          <Settings size={15} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
