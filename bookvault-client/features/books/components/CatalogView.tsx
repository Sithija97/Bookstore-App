import { BookFilters } from "./BookFilters";
import { BookGrid } from "./BookGrid";
import { MOCK_BOOKS } from "@/features/books/data/books.mock";
import { BOOK_GENRES } from "@/features/books/types/book.types";
import type {
  BookFilterValue,
  ViewMode,
} from "@/features/books/types/book.types";

interface CatalogViewProps {
  filter: string;
  view: string;
}

export function CatalogView({ filter, view }: CatalogViewProps) {
  const activeFilter: BookFilterValue =
    filter === "available" ||
    (BOOK_GENRES as readonly string[]).includes(filter)
      ? (filter as BookFilterValue)
      : "all";

  const viewMode: ViewMode = view === "list" ? "list" : "grid";

  const filteredBooks =
    activeFilter === "all"
      ? MOCK_BOOKS
      : activeFilter === "available"
        ? MOCK_BOOKS.filter((b) => b.isAvailable)
        : MOCK_BOOKS.filter((b) => b.genre === activeFilter);

  return (
    <div className="flex flex-col gap-4">
      <BookFilters
        activeFilter={activeFilter}
        viewMode={viewMode}
        totalCount={filteredBooks.length}
      />
      <BookGrid books={filteredBooks} viewMode={viewMode} />
    </div>
  );
}
