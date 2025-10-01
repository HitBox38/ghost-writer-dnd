import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface GenerationSlidersProps {
  resultCount: number;
  onResultCountChange: (count: number) => void;
}

export const GenerationSliders = ({
  resultCount,
  onResultCountChange,
}: GenerationSlidersProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="resultCount">Number of Results: {resultCount}</Label>
      <Slider
        id="resultCount"
        min={1}
        max={25}
        step={1}
        value={[resultCount]}
        onValueChange={([v]) => onResultCountChange(v)}
      />
      <p className="text-xs text-muted-foreground">Generate between 1-25 results</p>
    </div>
  );
};