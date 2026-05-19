import { BookFilters } from "./BookFilters";
import { BookGrid } from "./BookGrid";
import { BookPagination } from "./BookPagination";
import { MOCK_BOOKS } from "@/features/books/data/books.mock";
import { BOOK_GENRES } from "@/features/books/types/book.types";
import type {
  BookFilterValue,
  ViewMode,
} from "@/features/books/types/book.types";

const PAGE_SIZE = 8;

interface CatalogViewProps {
  filter: string;
  view: string;
  page: string;
}

export function CatalogView({ filter, view, page }: CatalogViewProps) {
  const activeFilter: BookFilterValue =
    filter === "available" ||
    (BOOK_GENRES as readonly string[]).includes(filter)
      ? (filter as BookFilterValue)
      : "all";

  const viewMode: ViewMode = view === "list" ? "list" : "grid";

  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const allFiltered =
    activeFilter === "all"
      ? MOCK_BOOKS
      : activeFilter === "available"
        ? MOCK_BOOKS.filter((b) => b.isAvailable)
        : MOCK_BOOKS.filter((b) => b.genre === activeFilter);

  const totalBooks = allFiltered.length;
  const totalPages = Math.max(1, Math.ceil(totalBooks / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageBooks = allFiltered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <div className="flex flex-col gap-4">
      <BookFilters
        activeFilter={activeFilter}
        viewMode={viewMode}
        totalCount={totalBooks}
      />
      <BookGrid books={pageBooks} viewMode={viewMode} />
      <BookPagination
        currentPage={safePage}
        totalPages={totalPages}
        totalBooks={totalBooks}
      />
    </div>
  );
}
