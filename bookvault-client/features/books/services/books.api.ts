import { env } from "@/lib/env";
import type { Book, BookGenre, PaginatedBooks } from "../types/book.types";

interface BooksQuery {
  search?: string;
  genre?: BookGenre;
  available?: boolean;
  page?: number;
  limit?: number;
}

export async function fetchBooks(query: BooksQuery = {}): Promise<PaginatedBooks> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.genre) params.set("genre", query.genre);
  if (typeof query.available === "boolean") params.set("available", String(query.available));
  params.set("page", String(query.page ?? 1));
  if (query.limit) params.set("limit", String(query.limit));

  const res = await fetch(`${env.apiBaseUrl}/books?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch books (${res.status})`);
  }

  const json = await res.json();
  return json.data as PaginatedBooks;
}

export async function fetchBookById(id: string): Promise<Book | null> {
  const res = await fetch(`${env.apiBaseUrl}/books/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(`Failed to fetch book (${res.status})`);
  }

  const json = await res.json();
  return json.data.book as Book;
}
