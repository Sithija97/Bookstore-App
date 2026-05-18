import type { Book, ViewMode } from "@/features/books/types/book.types";
import { BookCard } from "./BookCard";
import { BookListItem } from "./BookListItem";

interface BookGridProps {
  books: Book[];
  viewMode: ViewMode;
}

export function BookGrid({ books, viewMode }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
        <span className="mb-3 text-4xl">📚</span>
        <p className="text-sm font-medium">No books found</p>
        <p className="mt-1 text-xs">Try adjusting your filters</p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-2">
        {books.map((book) => (
          <BookListItem key={book.id} book={book} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
