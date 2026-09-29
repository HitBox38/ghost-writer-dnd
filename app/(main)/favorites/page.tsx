"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Shuffle, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message, MessageContent, MessageToolbar } from "@/components/ai-elements/message";
import { LineActions, LineResponse } from "@/components/line-message";
import { useCharacterStore } from "@/stores/character-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { copyLine } from "@/lib/clipboard";
import { NoCharacterState } from "../generate/components/no-character-state";
import type { FavoriteText, GenerationType } from "@/lib/types";
import { toast } from "sonner";

function pickRandomLine(lines: FavoriteText[]) {
  return lines[Math.floor(Math.random() * lines.length)];
}

export default function FavoritesPage() {
  const { characters, activeCharacterId, initialized, removeFavorite } = useCharacterStore();
  const layout = useWorkspaceStore((state) => state.layout);
  const character = characters.find((item) => item.id === activeCharacterId);
  const [filter, setFilter] = useState<GenerationType | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const entries = useRef<Map<string, HTMLElement>>(new Map());
  if (!initialized)
    return (
      <p className="loading-state" role="status">
        Opening saved lines…
      </p>
    );
  if (!character) return <NoCharacterState />;
  const search = query.trim().toLowerCase();
  const favorites = character.favorites.filter(
    (line) =>
      (filter === "all" || line.type === filter) &&
      (!search ||
        line.text.toLowerCase().includes(search) ||
        line.context?.toLowerCase().includes(search)),
  );
  function remove(favorite: FavoriteText) {
    if (!character) return;
    try {
      removeFavorite(character.id, favorite.id);
      const characterId = character.id;
      toast("Line removed", {
        action: {
          label: "Undo",
          onClick: () => {
            const current = useCharacterStore
              .getState()
              .characters.find((item) => item.id === characterId);
            if (current && !current.favorites.some((item) => item.id === favorite.id)) {
              try {
                useCharacterStore.getState().updateCharacter(characterId, {
                  favorites: [...current.favorites, favorite].toSorted(
                    (a, b) => a.createdAt - b.createdAt,
                  ),
                });
              } catch {
                toast.error("Couldn't restore the line. Browser storage may be full.");
              }
            }
          },
        },
      });
    } catch {
      toast.error("Couldn't remove the line. Please try again.");
    }
  }
  async function random() {
    if (!favorites.length) return;
    const favorite = pickRandomLine(favorites);
    setSelected(favorite.id);
    const entry = entries.current.get(favorite.id);
    entry?.scrollIntoView({ block: "center", behavior: "instant" });
    entry?.focus({ preventScroll: true });
    await copyLine(favorite.text);
  }
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
            <article
              key={favorite.id}
              tabIndex={-1}
              ref={(element) => {
                if (element) entries.current.set(favorite.id, element);
                else entries.current.delete(favorite.id);
              }}
              className={`line-entry ${selected === favorite.id ? "highlighted-line" : ""}`}
            >
              <Message from="assistant" className="line-message">
                <div className="saved-line-heading">
                  <span className="line-kind">
                    {favorite.type === "mockery" ? "Combat quip" : "Catchphrase"}
                  </span>
                  <span>
                    {new Date(favorite.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <MessageContent className="line-message-content">
                  <LineResponse text={favorite.text} />
                </MessageContent>
                {favorite.context && (
                  <details className="saved-scene">
                    <summary>
                      <MessageSquare size={13} aria-hidden="true" />
                      Original scene
                    </summary>
                    <p>{favorite.context}</p>
                  </details>
                )}
                <MessageToolbar className="line-message-toolbar">
                  <LineActions
                    text={favorite.text}
                    saved
                    savedLabel="Unsave line"
                    onSave={() => remove(favorite)}
                    onCopy={copyLine}
                  />
                </MessageToolbar>
              </Message>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
