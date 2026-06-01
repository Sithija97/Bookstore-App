"use client";

import { BookOpen, ShoppingCart, Tag } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BookActionsProps {
  isAvailable: boolean;
  hasRentalPrice: boolean;
}

export function BookActions({ isAvailable, hasRentalPrice }: BookActionsProps) {
  const handleBuy = () => {
    toast.info("Purchase flow coming soon");
  };

  const handleRent = () => {
    toast.info("Rental flow coming soon");
  };

  const handleWishlist = () => {
    toast.info("Wishlist coming soon");
  };

  return (
    <div className="flex flex-wrap gap-2.5">
      <button
        disabled={!isAvailable}
        onClick={handleBuy}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all",
          isAvailable
            ? "bg-zinc-900 text-white hover:bg-zinc-700 active:translate-y-px"
            : "cursor-not-allowed bg-zinc-100 text-zinc-400",
        )}
      >
        <ShoppingCart size={14} />
        Buy now
      </button>

      {hasRentalPrice && (
        <button
          disabled={!isAvailable}
          onClick={handleRent}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all",
            isAvailable
              ? "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 active:translate-y-px"
              : "cursor-not-allowed border-zinc-100 bg-zinc-50 text-zinc-400",
          )}
        >
          <BookOpen size={14} />
          Rent book
        </button>
      )}

      <button
        onClick={handleWishlist}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 active:translate-y-px"
      >
        <Tag size={14} />
        Wishlist
      </button>
    </div>
  );
}
