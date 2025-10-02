import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BasicInfoFieldsProps {
  name: string;
  race: string;
  class: string;
  level: number;
  onInputChange: (field: string, value: string | number) => void;
}

export const BasicInfoFields = ({
  name,
  race,
  class: characterClass,
  level,
  onInputChange,
}: BasicInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Character Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder="Gandalf the Grey"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="race">Race</Label>
        <Input
          id="race"
          value={race}
          onChange={(e) => onInputChange('race', e.target.value)}
          placeholder="Elf, Dwarf, Human..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="class">Class</Label>
        <Input
          id="class"
          value={characterClass}
          onChange={(e) => onInputChange('class', e.target.value)}
          placeholder="Wizard, Rogue, Paladin..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="level">Level</Label>
        <Input
          id="level"
          type="number"
          min="1"
          max="20"
          value={level}
          onChange={(e) => onInputChange('level', parseInt(e.target.value) || 1)}
        />
      </div>
    </div>
  );
};