import type { Request, Response } from "express";

import { AppError } from "@/common/errors/AppError";
import {
  type CreateBookDto,
  type UpdateBookDto,
  bookListQuerySchema,
} from "@/features/books/schemas/book.schema";
import {
  createBookRecord,
  deleteBookRecord,
  findBookById,
  listBooks,
  updateBookRecord,
  uploadBookCover,
} from "@/features/books/service/book.service";

export async function getBooksController(
  req: Request,
  res: Response,
): Promise<void> {
  // Query params are strings; bookListQuerySchema coerces/normalises them.
  const query = bookListQuerySchema.parse(req.query);
  const result = await listBooks(query);

  res.status(200).json({ success: true, data: result });
}

export async function getBookByIdController(
  req: Request,
  res: Response,
): Promise<void> {
  const book = await findBookById(String(req.params.id));

  if (!book) {
    throw new AppError(404, "Book not found", "BOOK_NOT_FOUND");
  }

  res.status(200).json({ success: true, data: { book } });
}

export async function createBookController(
  req: Request,
  res: Response,
): Promise<void> {
  // req.validatedBody is guaranteed by validateBody(createBookSchema) in the router.
  const body = req.validatedBody as CreateBookDto;

  // req.authUser is guaranteed by authGuard in the router.
  const created = await createBookRecord(body, req.authUser!.id);

  res.status(201).json({ success: true, data: { book: created } });
}

export async function updateBookController(
  req: Request,
  res: Response,
): Promise<void> {
  // req.validatedBody is guaranteed by validateBody(updateBookSchema) in the router.
  // updateBookSchema does not include coverImage, so it can never arrive here.
  const body = req.validatedBody as UpdateBookDto;

  const updated = await updateBookRecord(String(req.params.id), body);

  res.status(200).json({ success: true, data: { book: updated } });
}

export async function deleteBookController(
  req: Request,
  res: Response,
): Promise<void> {
  await deleteBookRecord(String(req.params.id));

  res.status(200).json({ success: true, message: "Book deleted" });
}

export async function uploadBookCoverController(
  req: Request,
  res: Response,
): Promise<void> {
  // File presence and mimetype are validated by multer fileFilter in the router.
  const file = req.file;

  if (!file) {
    throw new AppError(400, "Cover image is required", "MISSING_FILE");
  }

  const updated = await uploadBookCover(String(req.params.id), file);

  res.status(200).json({ success: true, data: { book: updated } });
}
