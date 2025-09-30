"use client"

import React, { useState } from 'react';
import { useCharacterStore } from '@/stores/character-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Heart, Copy, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

export const FavoritesList: React.FC = () => {
  const { getActiveProfile, removeFavorite } = useCharacterStore();
  const [searchTerm, setSearchTerm] = useState('');
  const activeProfile = getActiveProfile();

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const handleRemoveFavorite = (favoriteId: string) => {
    if (!activeProfile) return;
    removeFavorite(activeProfile.id, favoriteId);
    toast.success('Removed from favorites');
  };

  if (!activeProfile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No character selected. Select a character to view favorites.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredFavorites = activeProfile.favorites.filter(favorite =>
    favorite.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Favorites
        </CardTitle>
        <CardDescription>
          Your saved flavor text for {activeProfile.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activeProfile.favorites.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">No favorites yet</p>
            <p className="text-sm text-muted-foreground">
              Generate some flavor text and click the heart icon to save your favorites!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search favorites..."
                className="pl-10"
              />
            </div>
            
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {filteredFavorites.map((favorite) => (
                  <Card key={favorite.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={favorite.type === 'mockery' ? 'default' : 'secondary'}>
                              {favorite.type === 'mockery' ? 'Mockery' : 'Catchphrase'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(favorite.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{favorite.text}</p>
                          {favorite.context && (
                            <p className="text-xs text-muted-foreground">
                              Context: {favorite.context}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleCopyToClipboard(favorite.text)}
                            title="Copy to clipboard"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveFavorite(favorite.id)}
                            title="Remove from favorites"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {filteredFavorites.length === 0 && searchTerm && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No favorites match your search
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};