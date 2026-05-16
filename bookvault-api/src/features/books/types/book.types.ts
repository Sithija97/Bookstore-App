import type { Types } from "mongoose";

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

export interface BookDocumentData {
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
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookInput {
  title: string;
  author: string;
  description?: string;
  genre?: BookGenre;
  price: number;
  rentalPrice?: number;
  totalCopies?: number;
}

export interface UpdateBookInput {
  title?: string;
  author?: string;
  description?: string;
  genre?: BookGenre;
  price?: number;
  rentalPrice?: number;
  /** Only set internally by the cover-upload service — never from request bodies. */
  coverImage?: string;
  availableCopies?: number;
  totalCopies?: number;
  isAvailable?: boolean;
}

export interface BookListQuery {
  search?: string;
  genre?: BookGenre;
  available?: boolean;
  page: number;
  limit: number;
}

export interface PublicBook {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedBooks {
  books: PublicBook[];
  totalPages: number;
  currentPage: number;
  totalBooks: number;
}
