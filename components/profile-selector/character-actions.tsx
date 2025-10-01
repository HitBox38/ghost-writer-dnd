import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface CharacterActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const CharacterActions = ({ onEdit, onDelete }: CharacterActionsProps) => {
  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" size="icon" onClick={onEdit} title="Edit Character">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onDelete} title="Delete Character">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};