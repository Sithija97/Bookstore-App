import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Book } from "@/features/books/types/book.types";
import { GENRE_COVER_STYLES } from "./BookCard";

interface BookListItemProps {
  book: Book;
}

export function BookListItem({ book }: BookListItemProps) {
  const cover = GENRE_COVER_STYLES[book.genre ?? "default"];

  return (
    <Link
      href={`/books/${book.id}`}
      className="flex items-center gap-4 rounded-xl bg-white border border-zinc-100 p-3 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Small cover thumbnail */}
      <div
        className={cn(
          "flex h-16 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
          cover.gradient,
        )}
      >
        {book.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          <span
            className={cn(
              "px-1 text-center text-[7px] font-bold uppercase tracking-widest",
              cover.label,
            )}
          >
            {book.genre}
          </span>
        )}
      </div>

      {/* Info row */}
      <div className="flex flex-1 items-center gap-4 min-w-0">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-900">
            {book.title}
          </p>
          <p className="text-xs text-zinc-400">{book.author}</p>
        </div>

        {/* Genre tag */}
        <span className="hidden shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs capitalize text-zinc-600 sm:block">
          {book.genre}
        </span>

        {/* Availability */}
        <span
          className={cn(
            "hidden shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs sm:flex",
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

        {/* Price */}
        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold text-zinc-800">
            ${book.price.toFixed(2)}
          </p>
          {book.rentalPrice ? (
            <p className="text-[10px] text-zinc-400">
              ${book.rentalPrice.toFixed(2)}/rent
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
