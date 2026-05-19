import Link from "next/link";
import { ArrowLeft, BookOpen, ShoppingCart, Tag } from "lucide-react";
import { GENRE_COVER_STYLES } from "@/features/books/components/BookCard";
import { cn } from "@/lib/utils";
import type { Book } from "@/features/books/types/book.types";

interface BookDetailsViewProps {
  book: Book;
}

export function BookDetailsView({ book }: BookDetailsViewProps) {
  const cover = GENRE_COVER_STYLES[book.genre ?? "default"];
  const copiesPercent = Math.round(
    (book.availableCopies / book.totalCopies) * 100,
  );

  return (
    <div className="px-6 py-5">
      {/* Back */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-800"
      >
        <ArrowLeft size={13} />
        Back to catalog
      </Link>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Left — Cover */}
        <div className="flex flex-col items-center gap-4 lg:items-start">
          <div
            className={cn(
              "relative aspect-3/4 w-full max-w-55 overflow-hidden rounded-2xl bg-linear-to-br shadow-lg",
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
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <span
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-widest",
                    cover.label,
                  )}
                >
                  {book.genre ?? "book"}
                </span>
                <p className="text-sm font-bold leading-snug text-white">
                  {book.title}
                </p>
                <span
                  className={cn(
                    "mt-1 text-[10px] font-medium opacity-70",
                    cover.label,
                  )}
                >
                  {book.author}
                </span>
              </div>
            )}
          </div>

          {/* Copies availability bar */}
          <div className="w-full max-w-55">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wide text-zinc-400">
                Availability
              </span>
              <span className="text-[11px] font-medium text-zinc-600">
                {book.availableCopies}/{book.totalCopies} copies
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  copiesPercent > 50
                    ? "bg-emerald-500"
                    : copiesPercent > 20
                      ? "bg-amber-400"
                      : "bg-red-400",
                )}
                style={{ width: `${copiesPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right — Details */}
        <div className="flex flex-1 flex-col gap-5">
          {/* Genre + availability */}
          <div className="flex flex-wrap items-center gap-2">
            {book.genre && (
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium capitalize text-zinc-600">
                {book.genre}
              </span>
            )}
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
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
          </div>

          {/* Title + Author */}
          <div>
            <h1 className="text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl">
              {book.title}
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">by {book.author}</p>
          </div>

          {/* Description */}
          {book.description && (
            <div>
              <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                About this book
              </h2>
              <p className="text-sm leading-relaxed text-zinc-600">
                {book.description}
              </p>
            </div>
          )}

          {/* Pricing cards */}
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-1 flex-col gap-0.5 rounded-xl border border-zinc-100 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Purchase
              </span>
              <span className="text-2xl font-bold text-zinc-900">
                ${book.price.toFixed(2)}
              </span>
              <span className="text-[11px] text-zinc-400">
                One-time purchase
              </span>
            </div>

            {book.rentalPrice && (
              <div className="flex flex-1 flex-col gap-0.5 rounded-xl border border-zinc-100 bg-white p-4 shadow-sm">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Rental
                </span>
                <span className="text-2xl font-bold text-zinc-900">
                  ${book.rentalPrice.toFixed(2)}
                </span>
                <span className="text-[11px] text-zinc-400">
                  Per rental period
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2.5">
            <button
              disabled={!book.isAvailable}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all",
                book.isAvailable
                  ? "bg-zinc-900 text-white hover:bg-zinc-700 active:translate-y-px"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-400",
              )}
            >
              <ShoppingCart size={14} />
              Buy now
            </button>

            {book.rentalPrice && (
              <button
                disabled={!book.isAvailable}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all",
                  book.isAvailable
                    ? "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 active:translate-y-px"
                    : "cursor-not-allowed border-zinc-100 bg-zinc-50 text-zinc-400",
                )}
              >
                <BookOpen size={14} />
                Rent book
              </button>
            )}

            <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 active:translate-y-px">
              <Tag size={14} />
              Wishlist
            </button>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 border-t border-zinc-100 pt-4 sm:grid-cols-4">
            {[
              { label: "Total Copies", value: book.totalCopies },
              { label: "Available", value: book.availableCopies },
              {
                label: "Added",
                value: new Date(book.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                }),
              },
              {
                label: "Updated",
                value: new Date(book.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                }),
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-wide text-zinc-400">
                  {label}
                </span>
                <span className="text-sm font-semibold text-zinc-700">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
