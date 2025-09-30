'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCharacterStore } from '@/stores/character-store';
import { storage } from '@/lib/storage';
import { Upload, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface CharacterProfileFormProps {
  characterId?: string;
  onClose?: () => void;
}

export const CharacterProfileForm = ({ characterId, onClose }: CharacterProfileFormProps) => {
  const { characters, addCharacter, updateCharacter } = useCharacterStore();
  const existingCharacter = characterId ? characters.find((c) => c.id === characterId) : null;

  const [formData, setFormData] = useState({
    name: existingCharacter?.name || '',
    class: existingCharacter?.class || '',
    race: existingCharacter?.race || '',
    level: existingCharacter?.level || 1,
    backstory: existingCharacter?.backstory || '',
    appearance: existingCharacter?.appearance || '',
    worldSetting: existingCharacter?.worldSetting || '',
    characterSheet: existingCharacter?.characterSheet || '',
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const base64 = await storage.fileToBase64(file);
      setFormData((prev) => ({ ...prev, characterSheet: base64 }));
      toast.success('Character sheet uploaded');
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveSheet = () => {
    setFormData((prev) => ({ ...prev, characterSheet: '' }));
    toast.success('Character sheet removed');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Character name is required');
      return;
    }

    try {
      if (existingCharacter) {
        updateCharacter(existingCharacter.id, formData);
        toast.success('Character updated successfully');
      } else {
        addCharacter(formData);
        toast.success('Character created successfully');
      }
      onClose?.();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save character');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{existingCharacter ? 'Edit Character' : 'Create Character'}</CardTitle>
        <CardDescription>
          {existingCharacter
            ? 'Update your character profile'
            : 'Create a new D&D character profile for flavor text generation'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Character Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Gandalf the Grey"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="race">Race</Label>
              <Input
                id="race"
                value={formData.race}
                onChange={(e) => handleInputChange('race', e.target.value)}
                placeholder="Elf, Dwarf, Human..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Input
                id="class"
                value={formData.class}
                onChange={(e) => handleInputChange('class', e.target.value)}
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
                value={formData.level}
                onChange={(e) => handleInputChange('level', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="backstory">Backstory</Label>
            <Textarea
              id="backstory"
              value={formData.backstory}
              onChange={(e) => handleInputChange('backstory', e.target.value)}
              placeholder="Describe your character's history, motivations, and personality..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="appearance">Appearance</Label>
            <Textarea
              id="appearance"
              value={formData.appearance}
              onChange={(e) => handleInputChange('appearance', e.target.value)}
              placeholder="Describe how your character looks..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="worldSetting">World/Campaign Setting</Label>
            <Textarea
              id="worldSetting"
              value={formData.worldSetting}
              onChange={(e) => handleInputChange('worldSetting', e.target.value)}
              placeholder="Describe the world or campaign setting..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="characterSheet">Character Sheet (PDF, max 5MB)</Label>
            <div className="flex items-center gap-2">
              {formData.characterSheet ? (
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-muted-foreground">Character sheet attached</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveSheet}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    id="characterSheet"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="flex-1"
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {existingCharacter ? 'Update' : 'Create'} Character
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};