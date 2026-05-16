import { Schema, model } from "mongoose";

import {
  BOOK_GENRES,
  type BookDocumentData,
} from "@/features/books/types/book.types";

const bookSchema = new Schema<BookDocumentData>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    genre: {
      type: String,
      enum: BOOK_GENRES,
      default: "other",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    rentalPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    coverImage: {
      type: String,
      default: "",
    },
    availableCopies: {
      type: Number,
      default: 1,
      min: 0,
    },
    totalCopies: {
      type: Number,
      default: 1,
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

bookSchema.index({ title: "text", author: "text" });
bookSchema.index({ genre: 1, isAvailable: 1 });

export const BookModel = model<BookDocumentData>("Book", bookSchema);
