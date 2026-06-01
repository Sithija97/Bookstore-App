import { BookFilters } from "./BookFilters";
import { BookGrid } from "./BookGrid";
import { BookPagination } from "./BookPagination";
import { fetchBooks } from "@/features/books/services/books.api";
import { BOOK_GENRES } from "@/features/books/types/book.types";
import type {
  BookFilterValue,
  BookGenre,
  ViewMode,
} from "@/features/books/types/book.types";

const PAGE_SIZE = 8;

interface CatalogViewProps {
  filter: string;
  view: string;
  page: string;
  search?: string;
}

export async function CatalogView({ filter, view, page, search }: CatalogViewProps) {
  const activeFilter: BookFilterValue =
    filter === "available" ||
    (BOOK_GENRES as readonly string[]).includes(filter)
      ? (filter as BookFilterValue)
      : "all";

  const viewMode: ViewMode = view === "list" ? "list" : "grid";
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const genre =
    activeFilter !== "all" && activeFilter !== "available"
      ? (activeFilter as BookGenre)
      : undefined;

  const available = activeFilter === "available" ? true : undefined;

  const { books, totalPages, totalBooks, currentPage: apiPage } = await fetchBooks({
    search: search || undefined,
    genre,
    available,
    page: currentPage,
    limit: PAGE_SIZE,
  });

  return (
    <div className="flex flex-col gap-4">
      <BookFilters
        activeFilter={activeFilter}
        viewMode={viewMode}
        totalCount={totalBooks}
      />
      <BookGrid books={books} viewMode={viewMode} />
      <BookPagination
        currentPage={apiPage}
        totalPages={totalPages}
        totalBooks={totalBooks}
      />
    </div>
  );
}
