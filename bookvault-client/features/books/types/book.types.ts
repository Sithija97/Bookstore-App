export const BOOK_GENRES = [
  "fiction",
  "non-fiction",
  "science",
  "history",
  "biography",
  "technology",
  "other",
] as const;

export type BookGenre = (typeof BOOK_GENRES)[number];

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  genre?: BookGenre;
  price: number;
  rentalPrice?: number;
  coverImage?: string;
  availableCopies: number;
  totalCopies: number;
  isAvailable: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBooks {
  books: Book[];
  totalPages: number;
  currentPage: number;
  totalBooks: number;
}

export type BookFilterValue = "all" | "available" | BookGenre;

export type ViewMode = "grid" | "list";
