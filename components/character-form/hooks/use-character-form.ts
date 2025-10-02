import { useState } from 'react';
import { useCharacterStore } from '@/stores/character-store';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';

export const useCharacterForm = (characterId?: string, onClose?: () => void) => {
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

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

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

  return {
    formData,
    isUploading,
    existingCharacter,
    handleInputChange,
    handleFileUpload,
    handleRemoveSheet,
    handleSubmit,
  };
};