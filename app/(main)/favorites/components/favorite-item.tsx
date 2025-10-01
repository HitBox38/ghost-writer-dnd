import { Badge } from '@/components/ui/badge';
import { ActionButtons } from '@/components/shared/action-buttons';
import type { FavoriteText } from '@/lib/types';

interface FavoriteItemProps {
  favorite: FavoriteText;
  onCopy: (text: string) => void;
  onRemove: (id: string) => void;
}

export const FavoriteItem = ({ favorite, onCopy, onRemove }: FavoriteItemProps) => {
  return (
    <div className="group p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <p className="flex-1 text-sm leading-relaxed">{favorite.text}</p>
          <ActionButtons
            onCopy={() => onCopy(favorite.text)}
            onDelete={() => onRemove(favorite.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <Badge variant="outline" className="text-xs">
            {favorite.type === 'mockery' ? 'Combat Quip' : 'Catchphrase'}
          </Badge>
          {favorite.context && <span className="truncate">Context: {favorite.context}</span>}
          <span className="ml-auto">{new Date(favorite.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};