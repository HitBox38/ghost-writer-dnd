"use client"

import React, { useState, useEffect } from 'react';
import { useCharacterStore } from '@/stores/character-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CharacterProfile } from '@/lib/types';
import { Upload, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CharacterProfileFormProps {
  profileId?: string;
  onSave?: () => void;
}

export const CharacterProfileForm: React.FC<CharacterProfileFormProps> = ({ profileId, onSave }) => {
  const { profiles, createProfile, updateProfile, deleteProfile } = useCharacterStore();
  const existingProfile = profileId ? profiles.find(p => p.id === profileId) : null;
  
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    race: '',
    level: 1,
    backstory: '',
    appearance: '',
    worldSetting: '',
    characterSheet: '',
  });

  useEffect(() => {
    if (existingProfile) {
      setFormData({
        name: existingProfile.name,
        class: existingProfile.class,
        race: existingProfile.race,
        level: existingProfile.level,
        backstory: existingProfile.backstory,
        appearance: existingProfile.appearance,
        worldSetting: existingProfile.worldSetting,
        characterSheet: existingProfile.characterSheet || '',
      });
    }
  }, [existingProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.class || !formData.race) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (profileId) {
      updateProfile(profileId, formData);
      toast.success('Character profile updated!');
    } else {
      createProfile(formData);
      toast.success('Character profile created!');
    }
    
    if (onSave) {
      onSave();
    }
  };

  const handleDelete = () => {
    if (profileId && confirm('Are you sure you want to delete this character?')) {
      deleteProfile(profileId);
      toast.success('Character deleted');
      if (onSave) {
        onSave();
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are supported');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, characterSheet: reader.result as string }));
      toast.success('Character sheet uploaded!');
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{profileId ? 'Edit' : 'Create'} Character Profile</CardTitle>
        <CardDescription>
          Build your character's identity and backstory
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
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Thorin Ironforge"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="race">Race *</Label>
              <Input
                id="race"
                value={formData.race}
                onChange={(e) => setFormData(prev => ({ ...prev, race: e.target.value }))}
                placeholder="Dwarf"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="class">Class *</Label>
              <Input
                id="class"
                value={formData.class}
                onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                placeholder="Fighter"
                required
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
                onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="backstory">Backstory</Label>
            <Textarea
              id="backstory"
              value={formData.backstory}
              onChange={(e) => setFormData(prev => ({ ...prev, backstory: e.target.value }))}
              placeholder="Tell your character's story..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="appearance">Appearance</Label>
            <Textarea
              id="appearance"
              value={formData.appearance}
              onChange={(e) => setFormData(prev => ({ ...prev, appearance: e.target.value }))}
              placeholder="Describe how your character looks..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="worldSetting">World/Campaign Setting</Label>
            <Textarea
              id="worldSetting"
              value={formData.worldSetting}
              onChange={(e) => setFormData(prev => ({ ...prev, worldSetting: e.target.value }))}
              placeholder="Describe the world or campaign setting..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="characterSheet">Character Sheet (PDF)</Label>
            <div className="flex gap-2">
              <Input
                id="characterSheet"
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="flex-1"
              />
              {formData.characterSheet && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setFormData(prev => ({ ...prev, characterSheet: '' }))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {formData.characterSheet && (
              <p className="text-sm text-muted-foreground">Character sheet uploaded</p>
            )}
          </div>

          <div className="flex justify-between">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {profileId ? 'Update' : 'Create'} Character
            </Button>
            
            {profileId && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Character
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};