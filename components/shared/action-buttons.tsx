import { Button } from '@/components/ui/button';
import { Heart, Copy, Trash2 } from 'lucide-react';

interface ActionButtonsProps {
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  onCopy: () => void;
  onDelete?: () => void;
  className?: string;
}

export const ActionButtons = ({
  isFavorited,
  onToggleFavorite,
  onCopy,
  onDelete,
  className = '',
}: ActionButtonsProps) => {
  return (
    <div className={`flex gap-1 ${className}`}>
      {onToggleFavorite && (
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 shrink-0"
          onClick={onToggleFavorite}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`h-3.5 w-3.5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
          />
        </Button>
      )}
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 shrink-0"
        onClick={onCopy}
        title="Copy to clipboard"
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>
      {onDelete && (
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 shrink-0"
          onClick={onDelete}
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};