import { AppError } from "@/common/errors/AppError";
import {
  createBook,
  deleteBookById,
  findBookById,
  hasActiveRentals,
  listBooks,
  updateBookById,
} from "@/features/books/repository/book.repository";
import { uploadBookCoverToAzure } from "@/features/books/storage/azure-book-storage";
import type {
  BookListQuery,
  CreateBookInput,
  PublicBook,
  UpdateBookInput,
} from "@/features/books/types/book.types";

export { listBooks, findBookById };

export async function createBookRecord(
  input: CreateBookInput,
  createdBy: string,
): Promise<PublicBook> {
  return createBook({ ...input, createdBy });
}

export async function updateBookRecord(
  bookId: string,
  input: UpdateBookInput,
): Promise<PublicBook> {
  const sanitized: UpdateBookInput = { ...input };

  // Derive availableCopies / isAvailable from totalCopies when not supplied.
  if (
    typeof sanitized.totalCopies === "number" &&
    typeof sanitized.availableCopies !== "number"
  ) {
    sanitized.availableCopies = sanitized.totalCopies;
  }

  if (typeof sanitized.availableCopies === "number") {
    sanitized.isAvailable = sanitized.availableCopies > 0;
  }

  const updated = await updateBookById(bookId, sanitized);
  if (!updated) {
    throw new AppError(404, "Book not found", "BOOK_NOT_FOUND");
  }

  return updated;
}

export async function deleteBookRecord(bookId: string): Promise<void> {
  const rentalsExist = await hasActiveRentals(bookId);
  if (rentalsExist) {
    throw new AppError(
      400,
      "Cannot delete book with active rentals",
      "BOOK_HAS_ACTIVE_RENTALS",
    );
  }

  const deleted = await deleteBookById(bookId);
  if (!deleted) {
    throw new AppError(404, "Book not found", "BOOK_NOT_FOUND");
  }
}

export async function uploadBookCover(
  bookId: string,
  file: Express.Multer.File,
): Promise<PublicBook> {
  // Verify book exists before touching Azure to avoid orphaned blobs.
  const exists = await findBookById(bookId);
  if (!exists) {
    throw new AppError(404, "Book not found", "BOOK_NOT_FOUND");
  }

  const coverUrl = await uploadBookCoverToAzure(bookId, file);

  const updated = await updateBookById(bookId, { coverImage: coverUrl });
  if (!updated) {
    throw new AppError(404, "Book not found", "BOOK_NOT_FOUND");
  }

  return updated;
}

// Re-export the query type so the controller can type its parsed result.
export type { BookListQuery };
