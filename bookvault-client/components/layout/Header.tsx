import { Bell, Search } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-100 bg-white px-6 py-3.5">
      {/* Search */}
      <div className="relative">
        <Search
          size={13}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="text"
          placeholder="Search books..."
          className="h-8 w-[600px] rounded-lg border border-zinc-200 bg-zinc-50 pl-8 pr-3 text-xs text-zinc-700 placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          aria-label="Notifications"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-50"
        >
          <Bell size={14} />
        </button>
        <button
          aria-label="Account"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white"
        >
          U
        </button>
      </div>
    </header>
  );
}
