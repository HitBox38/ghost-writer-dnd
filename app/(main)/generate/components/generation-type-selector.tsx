import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { GenerationType } from '@/lib/types';

interface GenerationTypeSelectorProps {
  value: GenerationType;
  onChange: (type: GenerationType) => void;
}

export const GenerationTypeSelector = ({ value, onChange }: GenerationTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Generation Type</Label>
      <Tabs value={value} onValueChange={(v) => onChange(v as GenerationType)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mockery">Combat Quips</TabsTrigger>
          <TabsTrigger value="catchphrase">Catchphrases</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};