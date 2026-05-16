import { BlobServiceClient } from "@azure/storage-blob";

const BOOK_COVER_CONTAINER = "book-covers";

/**
 * Uploads a book cover image buffer to Azure Blob Storage.
 * Returns the public URL of the uploaded blob.
 *
 * Blob name is deterministic enough to be unique:
 * `<bookId>-<timestamp>-<sanitisedOriginalName>`
 */
export async function uploadBookCoverToAzure(
  bookId: string,
  file: Express.Multer.File,
): Promise<string> {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error(
      "Azure Storage is not configured (AZURE_STORAGE_CONNECTION_STRING missing)",
    );
  }

  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const containerClient =
    blobServiceClient.getContainerClient(BOOK_COVER_CONTAINER);

  // createIfNotExists is idempotent; safe to call on every upload.
  await containerClient.createIfNotExists({ access: "blob" });

  const safeOriginalName = file.originalname
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");

  const blobName = `${bookId}-${Date.now()}-${safeOriginalName || "cover"}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: { blobContentType: file.mimetype },
  });

  return blockBlobClient.url;
}
