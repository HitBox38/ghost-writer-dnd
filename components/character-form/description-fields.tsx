import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface DescriptionFieldsProps {
  backstory: string;
  appearance: string;
  worldSetting: string;
  onInputChange: (field: string, value: string) => void;
}

export const DescriptionFields = ({
  backstory,
  appearance,
  worldSetting,
  onInputChange,
}: DescriptionFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="backstory">Backstory</Label>
        <Textarea
          id="backstory"
          value={backstory}
          onChange={(e) => onInputChange('backstory', e.target.value)}
          placeholder="Describe your character's history, motivations, and personality..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="appearance">Appearance</Label>
        <Textarea
          id="appearance"
          value={appearance}
          onChange={(e) => onInputChange('appearance', e.target.value)}
          placeholder="Describe how your character looks..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="worldSetting">World/Campaign Setting</Label>
        <Textarea
          id="worldSetting"
          value={worldSetting}
          onChange={(e) => onInputChange('worldSetting', e.target.value)}
          placeholder="Describe the world or campaign setting..."
          rows={3}
        />
      </div>
    </>
  );
};