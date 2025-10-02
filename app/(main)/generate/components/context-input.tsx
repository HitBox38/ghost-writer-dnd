import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { GenerationType } from '@/lib/types';

interface ContextInputProps {
  value: string;
  generationType: GenerationType;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const ContextInput = ({
  value,
  generationType,
  onChange,
  onKeyDown,
}: ContextInputProps) => {
  const placeholder =
    generationType === 'mockery'
      ? "e.g., 'against a pompous noble' or 'targeting their armor'"
      : "e.g., 'when entering combat' or 'when celebrating victory'";

  return (
    <div className="space-y-2">
      <Label htmlFor="context">Additional Context (Optional)</Label>
      <Textarea
        id="context"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        rows={3}
      />
      <p className="text-xs text-muted-foreground">Press Ctrl+Enter to generate</p>
    </div>
  );
};