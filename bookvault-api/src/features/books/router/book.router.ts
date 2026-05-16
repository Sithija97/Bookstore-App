import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import multer from "multer";

import { asyncHandler } from "@/common/errors/asyncHandler";
import { adminGuard, authGuard, validateBody } from "@/common/middleware";
import {
  createBookController,
  deleteBookController,
  getBookByIdController,
  getBooksController,
  updateBookController,
  uploadBookCoverController,
} from "@/features/books/controller/book.controller";
import {
  createBookSchema,
  updateBookSchema,
} from "@/features/books/schemas/book.schema";

const booksRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, callback) {
    if (!file.mimetype.startsWith("image/")) {
      callback(new Error("File must be an image"));
      return;
    }
    callback(null, true);
  },
});

function uploadCoverMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  upload.single("cover")(req, res, (error: unknown) => {
    if (
      error instanceof multer.MulterError &&
      error.code === "LIMIT_FILE_SIZE"
    ) {
      res
        .status(400)
        .json({ success: false, message: "Image size must be 5MB or less" });
      return;
    }

    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    next();
  });
}

booksRouter.get("/", asyncHandler(getBooksController));
booksRouter.get("/:id", asyncHandler(getBookByIdController));

booksRouter.post(
  "/",
  authGuard,
  adminGuard,
  validateBody(createBookSchema),
  asyncHandler(createBookController),
);
booksRouter.put(
  "/:id",
  authGuard,
  adminGuard,
  validateBody(updateBookSchema),
  asyncHandler(updateBookController),
);
booksRouter.delete(
  "/:id",
  authGuard,
  adminGuard,
  asyncHandler(deleteBookController),
);
booksRouter.post(
  "/:id/cover",
  authGuard,
  adminGuard,
  uploadCoverMiddleware,
  asyncHandler(uploadBookCoverController),
);

export { booksRouter };
