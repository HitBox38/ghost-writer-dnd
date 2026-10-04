"use client";

import { SavedToolbarView } from "@/app/(main)/favorites/components/favorites-page/components/saved-toolbar-view";
import { SavedLine } from "./components/saved-line";
import { NoCharacterState } from "@/app/(main)/generate/components/no-character-state";
import { useFavoritesPage } from "@/app/(main)/favorites/components/favorites-page/hooks/use-favorites-page";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
export const FavoritesPage = () => {
  const state = useFavoritesPage();
  const { initialized, character, favorites, filter, setFilter, query, setQuery, random, layout } =
    state;
  if (!initialized)
    return (
      <p className="loading-state" role="status">
        Opening saved lines…
      </p>
    );
  if (!character) return <NoCharacterState />;
  return (
    <div className="favorites-page">
      <div className="page-heading">
        <div>
          <h1>Saved lines</h1>
          <p>Ready when {character.name} needs the last word.</p>
        </div>
        <span className="result-count">
          {favorites.length} {favorites.length === 1 ? "line" : "lines"}
        </span>
      </div>
      <SavedToolbarView
        filter={filter}
        setFilter={setFilter}
        query={query}
        setQuery={setQuery}
        favorites={favorites}
        random={random}
      />
      {!favorites.length ? (
        <div className="empty-results">
          <h2>{query || filter !== "all" ? "No matching lines" : "Keep the good ones."}</h2>
          <p className="mt-4">
            {query || filter !== "all"
              ? "Try a different search or show all your saved lines."
              : "Save lines from the writing workspace to build a collection for your next session."}
          </p>
          {query || filter !== "all" ? (
            <Button
              variant="outline"
              className="mt-5"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              <Search size={16} />
              Clear filters
            </Button>
          ) : (
            <Link href="/generate" className="primary-link mt-5">
              Write some lines
            </Link>
          )}
        </div>
      ) : (
        <div className={`line-collection ${layout === "list" ? "list-layout" : ""}`}>
          {favorites.map((favorite) => (
            <SavedLine key={favorite.id} favorite={favorite} state={state} />
          ))}
        </div>
      )}
    </div>
  );
};
export default FavoritesPage;
