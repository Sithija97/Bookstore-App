import { z } from "zod";

import { BOOK_GENRES } from "@/features/books/types/book.types";

const trimmedString = z.string().trim().min(1);

export const createBookSchema = z.object({
  title: trimmedString.max(200),
  author: trimmedString.max(200),
  description: z.string().trim().max(2000).optional(),
  genre: z.enum(BOOK_GENRES).optional(),
  price: z.number({ required_error: "price is required" }).min(0),
  rentalPrice: z.number().min(0).optional(),
  totalCopies: z.number().int().min(0).default(1),
});

export const updateBookSchema = z.object({
  title: trimmedString.max(200).optional(),
  author: trimmedString.max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  genre: z.enum(BOOK_GENRES).optional(),
  price: z.number().min(0).optional(),
  rentalPrice: z.number().min(0).optional(),
  availableCopies: z.number().int().min(0).optional(),
  totalCopies: z.number().int().min(0).optional(),
  isAvailable: z.boolean().optional(),
});

// Query params arrive as strings — coerce and preprocess them.
export const bookListQuerySchema = z.object({
  search: z.string().trim().optional(),
  genre: z.enum(BOOK_GENRES).optional(),
  // Express passes booleans as strings; normalise before validating.
  available: z
    .preprocess((val) => {
      if (val === "true" || val === "1") return true;
      if (val === "false" || val === "0") return false;
      return undefined;
    }, z.boolean().optional())
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateBookDto = z.infer<typeof createBookSchema>;
export type UpdateBookDto = z.infer<typeof updateBookSchema>;
export type BookListQueryDto = z.infer<typeof bookListQuerySchema>;
