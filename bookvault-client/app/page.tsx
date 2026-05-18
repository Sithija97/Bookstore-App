import { AppShell } from "@/components/layout/AppShell";
import { CatalogView } from "@/features/books/components/CatalogView";

interface HomePageProps {
  searchParams: Promise<{ filter?: string; view?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { filter = "all", view = "grid" } = await searchParams;

  return (
    <AppShell>
      <div className="px-6 py-5">
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-zinc-900">Books</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Discover, browse, and borrow from our collection
          </p>
        </div>
        <CatalogView filter={filter} view={view} />
      </div>
    </AppShell>
  );
}
