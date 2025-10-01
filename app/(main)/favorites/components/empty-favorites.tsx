import { Heart } from 'lucide-react';

export const EmptyFavorites = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Heart className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-lg font-medium mb-2">No Favorites Yet</p>
      <p className="text-sm text-muted-foreground max-w-md">
        Generate some flavor text and click the heart icon to save your favorites!
      </p>
    </div>
  );
};