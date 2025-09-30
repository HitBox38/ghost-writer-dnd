"use client"

import React from 'react';
import { useCharacterStore } from '@/stores/character-store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProfileSelectorProps {
  onCreateNew?: () => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ onCreateNew }) => {
  const { profiles, activeProfileId, setActiveProfile } = useCharacterStore();

  return (
    <div className="flex items-center gap-2">
      <Select value={activeProfileId || ''} onValueChange={setActiveProfile}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Select a character">
            {activeProfileId && profiles.find(p => p.id === activeProfileId) && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{profiles.find(p => p.id === activeProfileId)?.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {profiles.map((profile) => (
            <SelectItem key={profile.id} value={profile.id}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{profile.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    Lvl {profile.level}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {profile.race} {profile.class}
                </span>
              </div>
            </SelectItem>
          ))}
          {profiles.length === 0 && (
            <div className="p-2 text-center text-sm text-muted-foreground">
              No characters yet
            </div>
          )}
        </SelectContent>
      </Select>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onCreateNew}
        title="Create new character"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};