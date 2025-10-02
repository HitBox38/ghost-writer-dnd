import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, User, Plus } from 'lucide-react';
import type { CharacterProfile } from '@/lib/types';

interface CharacterDropdownProps {
  characters: CharacterProfile[];
  activeCharacter: CharacterProfile | null;
  onSelectCharacter: (id: string) => void;
  onCreateNew: () => void;
}

export const CharacterDropdown = ({
  characters,
  activeCharacter,
  onSelectCharacter,
  onCreateNew,
}: CharacterDropdownProps) => {
  return (
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
          <DropdownMenuItem
            key={character.id}
            className="cursor-pointer"
            onClick={() => onSelectCharacter(character.id)}
          >
            <div className="flex flex-col">
              <span className="font-medium">{character.name}</span>
              <span className="text-xs text-muted-foreground">
                Level {character.level} {character.race} {character.class}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Character
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};