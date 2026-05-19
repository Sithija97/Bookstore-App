"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookPaginationProps {
  currentPage: number;
  totalPages: number;
  totalBooks: number;
}

function getPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];

  if (current > 3) pages.push("…");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("…");

  pages.push(total);

  return pages;
}

export function BookPagination({
  currentPage,
  totalPages,
  totalBooks,
}: BookPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
      {/* Summary */}
      <span className="hidden text-xs text-zinc-400 sm:block">
        {totalBooks} {totalBooks === 1 ? "book" : "books"} &middot; page{" "}
        {currentPage} of {totalPages}
      </span>

      {/* Controls */}
      <div className="flex items-center gap-1 mx-auto sm:mx-0">
        {/* Prev */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={13} />
        </button>

        {/* Page pills */}
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-7 w-7 items-center justify-center text-xs text-zinc-400 select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => goToPage(p)}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? "page" : undefined}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium transition-colors",
                p === currentPage
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
              )}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
