import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';

interface CharacterSheetUploadProps {
  characterSheet: string;
  isUploading: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveSheet: () => void;
}

export const CharacterSheetUpload = ({
  characterSheet,
  isUploading,
  onFileUpload,
  onRemoveSheet,
}: CharacterSheetUploadProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="characterSheet">Character Sheet (PDF, max 5MB)</Label>
      <div className="flex items-center gap-2">
        {characterSheet ? (
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm text-muted-foreground">Character sheet attached</span>
            <Button type="button" variant="outline" size="sm" onClick={onRemoveSheet}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1">
            <Input
              id="characterSheet"
              type="file"
              accept=".pdf"
              onChange={onFileUpload}
              disabled={isUploading}
              className="flex-1"
            />
            <Upload className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
};