'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCharacterStore } from '@/stores/character-store';
import { CharacterProfileForm } from './character-profile-form';
import { ChevronDown, Plus, User, Edit, Trash2 } from 'lucide-react';
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
            <CharacterProfileForm onClose={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between min-w-[200px]">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="truncate">
                  {activeCharacter ? activeCharacter.name : 'Select Character'}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[300px]">
            <DropdownMenuLabel>Characters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {characters.map((character) => (
              <div key={character.id} className="flex items-center">
                <DropdownMenuItem
                  className="flex-1 cursor-pointer"
                  onClick={() => setActiveCharacter(character.id)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{character.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Level {character.level} {character.race} {character.class}
                    </span>
                  </div>
                </DropdownMenuItem>
              </div>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Character
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {activeCharacter && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsEditDialogOpen(true)}
              title="Edit Character"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDeleteCharacter(activeCharacter.id, activeCharacter.name)}
              title="Delete Character"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Character</DialogTitle>
          </DialogHeader>
          <CharacterProfileForm onClose={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Character</DialogTitle>
          </DialogHeader>
          {activeCharacter && (
            <CharacterProfileForm
              characterId={activeCharacter.id}
              onClose={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};