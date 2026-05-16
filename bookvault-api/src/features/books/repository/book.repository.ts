import { FilterQuery, Types, isValidObjectId } from "mongoose";

import { BookModel } from "@/features/books/model/book.model";
import type {
  BookDocumentData,
  BookListQuery,
  CreateBookInput,
  PaginatedBooks,
  PublicBook,
  UpdateBookInput,
} from "@/features/books/types/book.types";

interface BookDbShape extends BookDocumentData {
  _id: Types.ObjectId;
}

export async function listBooks(query: BookListQuery): Promise<PaginatedBooks> {
  const filter: FilterQuery<BookDocumentData> = {};

  if (query.search) {
    const searchRegex = new RegExp(query.search, "i");
    filter.$or = [{ title: searchRegex }, { author: searchRegex }];
  }

  if (query.genre) {
    filter.genre = query.genre;
  }

  if (typeof query.available === "boolean") {
    filter.isAvailable = query.available;
  }

  const skip = (query.page - 1) * query.limit;

  const [books, totalBooks] = await Promise.all([
    BookModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    BookModel.countDocuments(filter),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalBooks / query.limit));

  return {
    books: (books as BookDbShape[]).map(toPublicBook),
    totalBooks,
    totalPages,
    currentPage: query.page,
  };
}

export async function findBookById(bookId: string): Promise<PublicBook | null> {
  if (!isValidObjectId(bookId)) {
    return null;
  }

  const book = await BookModel.findById(bookId).lean();
  return book ? toPublicBook(book as BookDbShape) : null;
}

export async function createBook(
  input: CreateBookInput & { createdBy: string },
): Promise<PublicBook> {
  const copies = input.totalCopies ?? 1;
  const created = await BookModel.create({
    ...input,
    totalCopies: copies,
    availableCopies: copies,
    isAvailable: copies > 0,
    createdBy: new Types.ObjectId(input.createdBy),
  });

  return toPublicBook(created.toObject() as BookDbShape);
}

export async function updateBookById(
  bookId: string,
  input: UpdateBookInput,
): Promise<PublicBook | null> {
  if (!isValidObjectId(bookId)) {
    return null;
  }

  const updated = await BookModel.findByIdAndUpdate(bookId, input, {
    new: true,
    runValidators: true,
  }).lean();

  return updated ? toPublicBook(updated as BookDbShape) : null;
}

export async function deleteBookById(bookId: string): Promise<boolean> {
  if (!isValidObjectId(bookId)) {
    return false;
  }

  const deleted = await BookModel.findByIdAndDelete(bookId);
  return Boolean(deleted);
}

export async function hasActiveRentals(bookId: string): Promise<boolean> {
  if (!isValidObjectId(bookId)) {
    return false;
  }

  const rentalsCollection = BookModel.db.collection("rentals");
  const objectId = new Types.ObjectId(bookId);

  const activeRentals = await rentalsCollection.countDocuments({
    $and: [
      {
        $or: [
          { book: objectId },
          { bookId: objectId },
          { book: bookId },
          { bookId: bookId },
        ],
      },
      {
        $or: [
          { status: { $in: ["active", "ongoing", "borrowed"] } },
          { returnedAt: { $exists: false } },
          { returnedAt: null },
        ],
      },
    ],
  });

  return activeRentals > 0;
}

function toPublicBook(book: BookDbShape): PublicBook {
  return {
    id: String(book._id),
    title: book.title,
    author: book.author,
    description: book.description,
    genre: book.genre,
    price: book.price,
    rentalPrice: book.rentalPrice,
    coverImage: book.coverImage,
    availableCopies: book.availableCopies,
    totalCopies: book.totalCopies,
    isAvailable: book.isAvailable,
    createdBy: String(book.createdBy),
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
  };
}
