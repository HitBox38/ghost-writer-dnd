'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCharacterStore } from '@/stores/character-store';
import type { GenerationType } from '@/lib/types';
import { Heart, Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function FavoritesPage() {
  const { getActiveCharacter, removeFavorite } = useCharacterStore();
  const activeCharacter = getActiveCharacter();
  const [filterType, setFilterType] = useState<GenerationType | 'all'>('all');

  if (!activeCharacter) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No Character Selected</p>
            <p className="text-sm text-muted-foreground text-center">
              Select a character to view their favorites
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const favorites = activeCharacter.favorites;
  const filteredFavorites =
    filterType === 'all' ? favorites : favorites.filter((f) => f.type === filterType);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleRemove = (favoriteId: string) => {
    if (confirm('Remove this from favorites?')) {
      removeFavorite(activeCharacter.id, favoriteId);
      toast.success('Removed from favorites');
    }
  };

  return (
    <Card className="h-fit max-h-[calc(100vh-12rem)]">
      <CardContent className="pt-6 h-full flex flex-col">
        <div className="flex flex-col min-h-0 flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Favorites</h2>
              <p className="text-sm text-muted-foreground">
                Saved flavor text for {activeCharacter.name}
              </p>
            </div>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {filteredFavorites.length} {filterType === 'all' ? 'total' : filterType}
            </Badge>
          </div>

          <Tabs value={filterType} onValueChange={(v) => setFilterType(v as GenerationType | 'all')}>
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="all">
                All ({favorites.length})
              </TabsTrigger>
              <TabsTrigger value="mockery">
                Quips ({favorites.filter((f) => f.type === 'mockery').length})
              </TabsTrigger>
              <TabsTrigger value="catchphrase">
                Catchphrases ({favorites.filter((f) => f.type === 'catchphrase').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={filterType} className="mt-4">
              {filteredFavorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No Favorites Yet</p>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Generate some flavor text and click the heart icon to save your favorites!
                  </p>
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto pr-2 flex-1 min-h-0">
                  {filteredFavorites.map((favorite) => (
                    <div
                      key={favorite.id}
                      className="group p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <p className="flex-1 text-sm leading-relaxed">{favorite.text}</p>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleCopy(favorite.text)}
                              title="Copy to clipboard"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemove(favorite.id)}
                              title="Remove from favorites"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {favorite.type === 'mockery' ? 'Combat Quip' : 'Catchphrase'}
                          </Badge>
                          {favorite.context && (
                            <span className="truncate">Context: {favorite.context}</span>
                          )}
                          <span className="ml-auto">
                            {new Date(favorite.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}