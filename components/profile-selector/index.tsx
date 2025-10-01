'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCharacterStore } from '@/stores/character-store';
import { CharacterForm } from '@/components/character-form';
import { CharacterDropdown } from './character-dropdown';
import { CharacterActions } from './character-actions';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export const ProfileSelector = () => {
  const { characters, setActiveCharacter, deleteCharacter, getActiveCharacter } =
    useCharacterStore();
  const activeCharacter = getActiveCharacter();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDeleteCharacter = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) {
      deleteCharacter(id);
      toast.success(`${name} deleted`);
    }
  };

  if (characters.length === 0) {
    return (
      <>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create First Character
        </Button>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Character</DialogTitle>
            </DialogHeader>
            <CharacterForm onClose={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <CharacterDropdown
          characters={characters}
          activeCharacter={activeCharacter}
          onSelectCharacter={setActiveCharacter}
          onCreateNew={() => setIsCreateDialogOpen(true)}
        />

        {activeCharacter && (
          <CharacterActions
            onEdit={() => setIsEditDialogOpen(true)}
            onDelete={() => handleDeleteCharacter(activeCharacter.id, activeCharacter.name)}
          />
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Character</DialogTitle>
          </DialogHeader>
          <CharacterForm onClose={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Character</DialogTitle>
          </DialogHeader>
          {activeCharacter && (
            <CharacterForm
              characterId={activeCharacter.id}
              onClose={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};