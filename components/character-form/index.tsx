'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BasicInfoFields } from './basic-info-fields';
import { DescriptionFields } from './description-fields';
import { CharacterSheetUpload } from './character-sheet-upload';
import { useCharacterForm } from './hooks/use-character-form';
import { Save } from 'lucide-react';

interface CharacterFormProps {
  characterId?: string;
  onClose?: () => void;
}

export const CharacterForm = ({ characterId, onClose }: CharacterFormProps) => {
  const {
    formData,
    isUploading,
    existingCharacter,
    handleInputChange,
    handleFileUpload,
    handleRemoveSheet,
    handleSubmit,
  } = useCharacterForm(characterId, onClose);

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
          <BasicInfoFields
            name={formData.name}
            race={formData.race}
            class={formData.class}
            level={formData.level}
            onInputChange={handleInputChange}
          />

          <DescriptionFields
            backstory={formData.backstory}
            appearance={formData.appearance}
            worldSetting={formData.worldSetting}
            onInputChange={handleInputChange}
          />

          <CharacterSheetUpload
            characterSheet={formData.characterSheet}
            isUploading={isUploading}
            onFileUpload={handleFileUpload}
            onRemoveSheet={handleRemoveSheet}
          />

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