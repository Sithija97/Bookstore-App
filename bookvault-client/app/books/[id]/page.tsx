import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { BookDetailsView } from "@/features/books/components/BookDetailsView";
import { fetchBookById } from "@/features/books/services/books.api";

interface BookDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const { id } = await params;
  const book = await fetchBookById(id);

  if (!book) notFound();

  return (
    <AppShell>
      <BookDetailsView book={book} />
    </AppShell>
  );
}
