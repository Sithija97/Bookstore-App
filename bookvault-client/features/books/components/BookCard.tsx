import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Book, BookGenre } from "@/features/books/types/book.types";

export const GENRE_COVER_STYLES: Record<
  BookGenre | "default",
  { gradient: string; label: string }
> = {
  technology: {
    gradient: "from-blue-950 via-blue-900 to-indigo-900",
    label: "text-blue-300",
  },
  fiction: {
    gradient: "from-rose-950 via-red-900 to-rose-800",
    label: "text-rose-300",
  },
  "non-fiction": {
    gradient: "from-slate-800 via-slate-700 to-zinc-700",
    label: "text-slate-300",
  },
  science: {
    gradient: "from-emerald-950 via-emerald-900 to-teal-800",
    label: "text-emerald-300",
  },
  history: {
    gradient: "from-amber-950 via-amber-900 to-orange-800",
    label: "text-amber-300",
  },
  biography: {
    gradient: "from-purple-950 via-purple-900 to-violet-800",
    label: "text-purple-300",
  },
  other: {
    gradient: "from-zinc-800 via-zinc-700 to-stone-700",
    label: "text-zinc-300",
  },
  default: {
    gradient: "from-zinc-800 via-zinc-700 to-stone-700",
    label: "text-zinc-300",
  },
};

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const cover = GENRE_COVER_STYLES[book.genre ?? "default"];

  return (
    <Link
      href={`/books/${book.id}`}
      className="group flex flex-col rounded-xl bg-white border border-zinc-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Cover */}
      <div
        className={cn(
          "relative aspect-[3/4] w-full bg-gradient-to-br",
          cover.gradient,
        )}
      >
        {book.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverImage}
            alt={book.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <span
              className={cn(
                "text-[9px] font-semibold uppercase tracking-widest",
                cover.label,
              )}
            >
              {book.genre ?? "book"}
            </span>
            <p className="text-[11px] font-bold leading-tight text-white line-clamp-4">
              {book.title}
            </p>
            <span
              className={cn(
                "mt-1 text-[9px] font-medium opacity-70",
                cover.label,
              )}
            >
              {book.author}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-3">
        {/* Availability badge */}
        <span
          className={cn(
            "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
            book.isAvailable
              ? "bg-emerald-50 text-emerald-700"
              : "bg-zinc-100 text-zinc-500",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              book.isAvailable ? "bg-emerald-500" : "bg-zinc-400",
            )}
          />
          {book.isAvailable ? "Available" : "Unavailable"}
        </span>

        {/* Title + Author */}
        <p className="text-xs font-semibold leading-snug text-zinc-900 line-clamp-2">
          {book.title}
        </p>
        <p className="text-[10px] text-zinc-400 truncate">{book.author}</p>

        {/* Stats row */}
        <div className="mt-1 grid grid-cols-3 gap-1 border-t border-zinc-50 pt-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] uppercase tracking-wide text-zinc-400">
              Price
            </span>
            <span className="text-[11px] font-semibold text-zinc-800">
              ${book.price.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] uppercase tracking-wide text-zinc-400">
              Rental
            </span>
            <span className="text-[11px] font-semibold text-zinc-800">
              {book.rentalPrice ? `$${book.rentalPrice.toFixed(2)}` : "—"}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] uppercase tracking-wide text-zinc-400">
              Copies
            </span>
            <span className="text-[11px] font-semibold text-zinc-800">
              {book.availableCopies}/{book.totalCopies}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
