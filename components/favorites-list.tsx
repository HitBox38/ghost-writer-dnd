'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCharacterStore } from '@/stores/character-store';
import type { GenerationType } from '@/lib/types';
import { Heart, Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const FavoritesList = () => {
  const { getActiveCharacter, removeFavorite } = useCharacterStore();
  const activeCharacter = getActiveCharacter();
  const [filterType, setFilterType] = useState<GenerationType | 'all'>('all');

  if (!activeCharacter) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Heart className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">No Character Selected</p>
          <p className="text-sm text-muted-foreground text-center">
            Select a character to view their favorites
          </p>
        </CardContent>
      </Card>
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Favorites</CardTitle>
            <CardDescription>
              Saved flavor text for {activeCharacter.name}
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {filteredFavorites.length} {filterType === 'all' ? 'total' : filterType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={filterType} onValueChange={(v) => setFilterType(v as GenerationType | 'all')}>
          <TabsList className="grid w-full grid-cols-3">
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

          <TabsContent value={filterType} className="space-y-2 mt-4">
            {filteredFavorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Heart className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No favorites yet. Generate some flavor text and click the heart icon to save your
                  favorites!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFavorites.map((favorite) => (
                  <Card key={favorite.id} className="group">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <p className="flex-1 text-sm">{favorite.text}</p>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleCopy(favorite.text)}
                              title="Copy to clipboard"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemove(favorite.id)}
                              title="Remove from favorites"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};