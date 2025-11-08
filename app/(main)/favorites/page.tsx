"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useCharacterStore } from "@/stores/character-store";
import { NoCharacterState } from "../generate/components/no-character-state";
import { FavoriteItem } from "./components/favorite-item";
import { EmptyFavorites } from "./components/empty-favorites";
import type { GenerationType } from "@/lib/types";
import { toast } from "sonner";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const { getActiveCharacter, removeFavorite } = useCharacterStore();
  const activeCharacter = getActiveCharacter();
  const [filterType, setFilterType] = useState<GenerationType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleRemove = (favoriteId: string) => {
    if (!activeCharacter) return;
    if (confirm("Remove this from favorites?")) {
      removeFavorite(activeCharacter.id, favoriteId);
      toast.success("Removed from favorites");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (!activeCharacter) {
    return <NoCharacterState />;
  }

  const favorites = activeCharacter.favorites;

  // Filter by type first
  const typeFilteredFavorites =
    filterType === "all" ? favorites : favorites.filter((f) => f.type === filterType);

  // Then filter by search query
  const filteredFavorites = searchQuery.trim()
    ? typeFilteredFavorites.filter((f) => {
        const query = searchQuery.toLowerCase();
        const textMatch = f.text.toLowerCase().includes(query);
        const contextMatch = f.context?.toLowerCase().includes(query);
        return textMatch || contextMatch;
      })
    : typeFilteredFavorites;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Favorites</h2>
              <p className="text-sm text-muted-foreground">
                Saved flavor text for {activeCharacter.name}
              </p>
            </div>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {filteredFavorites.length} {filterType === "all" ? "total" : filterType}
            </Badge>
          </div>

          <Tabs
            value={filterType}
            onValueChange={(v) => setFilterType(v as GenerationType | "all")}>
            <div className="flex items-center gap-4">
              <TabsList className="grid grid-cols-3 w-auto">
                <TabsTrigger value="all">All ({favorites.length})</TabsTrigger>
                <TabsTrigger value="mockery">
                  Quips ({favorites.filter((f) => f.type === "mockery").length})
                </TabsTrigger>
                <TabsTrigger value="catchphrase">
                  Catchphrases ({favorites.filter((f) => f.type === "catchphrase").length})
                </TabsTrigger>
              </TabsList>

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <TabsContent value={filterType} className="mt-4">
              {filteredFavorites.length === 0 ? (
                searchQuery ? (
                  <div className="text-center py-12 px-4">
                    <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No results found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      No favorites match your search &quot;{searchQuery}&quot;
                    </p>
                    <Button variant="outline" onClick={handleClearSearch}>
                      Clear search
                    </Button>
                  </div>
                ) : (
                  <EmptyFavorites />
                )
              ) : (
                <ScrollArea className="h-[calc(100vh-20rem)] w-full rounded-md">
                  <div className="space-y-2 pr-4">
                    {filteredFavorites.map((favorite) => (
                      <FavoriteItem
                        key={favorite.id}
                        favorite={favorite}
                        onCopy={handleCopy}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
