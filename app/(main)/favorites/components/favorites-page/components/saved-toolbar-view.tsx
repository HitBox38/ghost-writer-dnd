"use client";

import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { useFavoritesPage } from "@/app/(main)/favorites/components/favorites-page/hooks/use-favorites-page";
export const SavedToolbarView = ({
  filter,
  setFilter,
  query,
  setQuery,
  favorites,
  random,
}: Pick<
  ReturnType<typeof useFavoritesPage>,
  "filter" | "setFilter" | "query" | "setQuery" | "favorites" | "random"
>) => (
  <div className="saved-toolbar">
    <div className="segmented-control" aria-label="Filter saved lines">
      {(
        [
          ["all", "All"],
          ["mockery", "Combat quips"],
          ["catchphrase", "Catchphrases"],
        ] as const
      ).map(([value, label]) => (
        <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>
          {label}
        </button>
      ))}
    </div>
    <div className="field search-field">
      <label htmlFor="saved-search" className="sr-only">
        Search saved lines
      </label>
      <input
        id="saved-search"
        type="search"
        placeholder="Search lines or scenes…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
    </div>
    <Button variant="outline" disabled={!favorites.length} onClick={() => void random()}>
      <Shuffle size={16} />
      Pick & copy
    </Button>
  </div>
);
