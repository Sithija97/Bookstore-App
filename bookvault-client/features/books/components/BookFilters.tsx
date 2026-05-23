"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { BOOK_GENRES } from "@/features/books/types/book.types";
import type {
  BookFilterValue,
  ViewMode,
} from "@/features/books/types/book.types";

const FILTER_TABS: { label: string; value: BookFilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Available", value: "available" },
  ...BOOK_GENRES.map((g) => ({
    label: g.charAt(0).toUpperCase() + g.slice(1),
    value: g as BookFilterValue,
  })),
];

interface BookFiltersProps {
  activeFilter: BookFilterValue;
  viewMode: ViewMode;
  totalCount: number;
}

export function BookFilters({
  activeFilter,
  viewMode,
  totalCount,
}: BookFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      // Reset to first page whenever filter or view mode changes
      if (key !== "page") params.set("page", "1");
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-px [scrollbar-width:none]">
        {FILTER_TABS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => updateParam("filter", value)}
            className={cn(
              "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              activeFilter === value
                ? "bg-zinc-900 text-white"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {/* Count */}
        <span className="hidden text-xs text-zinc-400 sm:block">
          {totalCount} {totalCount === 1 ? "book" : "books"}
        </span>

        {/* View mode toggle */}
        <div className="flex items-center gap-0.5 rounded-lg border border-zinc-200 p-0.5">
          <button
            onClick={() => updateParam("view", "grid")}
            aria-label="Grid view"
            className={cn(
              "rounded-md p-1.5 transition-colors",
              viewMode === "grid"
                ? "bg-zinc-900 text-white"
                : "text-zinc-400 hover:text-zinc-600",
            )}
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => updateParam("view", "list")}
            aria-label="List view"
            className={cn(
              "rounded-md p-1.5 transition-colors",
              viewMode === "list"
                ? "bg-zinc-900 text-white"
                : "text-zinc-400 hover:text-zinc-600",
            )}
          >
            <List size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
