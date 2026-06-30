import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { toast } from "sonner";
import type { FavoriteText } from "@/lib/types";

interface RandomButtonProps {
  filteredFavorites: FavoriteText[];
  setSelectedFavoriteId: (id: string) => void;
  handleCopy: (text: string) => void;
}

export const RandomButton = ({
  filteredFavorites,
  setSelectedFavoriteId,
  handleCopy,
}: RandomButtonProps) => {
  const handleRandomFavorite = () => {
    if (filteredFavorites.length === 0) {
      toast.error("No favorites to select from");
      return;
    }
    const randomIndex = Math.floor(Math.random() * filteredFavorites.length);
    const randomFavorite = filteredFavorites[randomIndex];
    setSelectedFavoriteId(randomFavorite.id);
    handleCopy(randomFavorite.text);
    toast.success(`Random ${randomFavorite.type} copied!`);
  };
  return (
    <Button variant="outline" size="icon" onClick={handleRandomFavorite} aria-label="Random">
      <Shuffle />
    </Button>
  );
};
