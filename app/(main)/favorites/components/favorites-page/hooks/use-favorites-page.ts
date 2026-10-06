"use client";

import { useRef, useState } from "react";
import { useCharacterStore } from "@/stores/character-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { copyLine } from "@/lib/clipboard";
import type { FavoriteText, GenerationType } from "@/lib/types";
import { toast } from "sonner";
import { pickRandomLine } from "../helpers";
export const useFavoritesPage = () => {
  const { characters, activeCharacterId, initialized, removeFavorite } = useCharacterStore();
  const layout = useWorkspaceStore((state) => state.layout);
  const character = characters.find((item) => item.id === activeCharacterId);
  const [filter, setFilter] = useState<GenerationType | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const entries = useRef<Map<string, HTMLElement>>(new Map());
  const search = query.trim().toLowerCase();
  const favorites = (character?.favorites ?? []).filter(
    (line) =>
      (filter === "all" || line.type === filter) &&
      (!search ||
        line.text.toLowerCase().includes(search) ||
        line.context?.toLowerCase().includes(search)),
  );
  const remove = (favorite: FavoriteText) => {
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
  };
  const random = async () => {
    if (!favorites.length) return;
    const favorite = pickRandomLine(favorites);
    setSelected(favorite.id);
    const entry = entries.current.get(favorite.id);
    entry?.scrollIntoView({
      block: "center",
      behavior: "instant",
    });
    entry?.focus({
      preventScroll: true,
    });
    await copyLine(favorite.text);
  };
  return {
    initialized,
    character,
    favorites,
    filter,
    setFilter,
    query,
    setQuery,
    random,
    layout,
    entries,
    selected,
    remove,
  };
};
