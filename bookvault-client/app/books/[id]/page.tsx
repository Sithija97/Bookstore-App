import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { BookDetailsView } from "@/features/books/components/BookDetailsView";
import { MOCK_BOOKS } from "@/features/books/data/books.mock";

interface BookDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const { id } = await params;
  const book = MOCK_BOOKS.find((b) => b.id === id);

  if (!book) notFound();

  return (
    <AppShell>
      <BookDetailsView book={book} />
    </AppShell>
  );
}
