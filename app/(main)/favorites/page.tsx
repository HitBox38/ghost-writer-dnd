'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCharacterStore } from '@/stores/character-store';
import { NoCharacterState } from '../generate/components/no-character-state';
import { FavoriteItem } from './components/favorite-item';
import { EmptyFavorites } from './components/empty-favorites';
import type { GenerationType } from '@/lib/types';
import { toast } from 'sonner';

export default function FavoritesPage() {
  const { getActiveCharacter, removeFavorite } = useCharacterStore();
  const activeCharacter = getActiveCharacter();
  const [filterType, setFilterType] = useState<GenerationType | 'all'>('all');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleRemove = (favoriteId: string) => {
    if (!activeCharacter) return;
    if (confirm('Remove this from favorites?')) {
      removeFavorite(activeCharacter.id, favoriteId);
      toast.success('Removed from favorites');
    }
  };

  if (!activeCharacter) {
    return <NoCharacterState />;
  }

  const favorites = activeCharacter.favorites;
  const filteredFavorites =
    filterType === 'all' ? favorites : favorites.filter((f) => f.type === filterType);

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
              {filteredFavorites.length} {filterType === 'all' ? 'total' : filterType}
            </Badge>
          </div>

          <Tabs value={filterType} onValueChange={(v) => setFilterType(v as GenerationType | 'all')}>
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="all">All ({favorites.length})</TabsTrigger>
              <TabsTrigger value="mockery">
                Quips ({favorites.filter((f) => f.type === 'mockery').length})
              </TabsTrigger>
              <TabsTrigger value="catchphrase">
                Catchphrases ({favorites.filter((f) => f.type === 'catchphrase').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={filterType} className="mt-4">
              {filteredFavorites.length === 0 ? (
                <EmptyFavorites />
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
