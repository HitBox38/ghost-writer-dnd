import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus } from "lucide-react";
import Image from "next/image";
import type { CharacterProfile } from "@/lib/types";

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
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="character-picker" aria-label="Choose character" />
        }
      >
        <div className="flex items-center gap-2">
          {activeCharacter?.portrait && (
            <Image
              src={activeCharacter.portrait}
              alt=""
              width={28}
              height={28}
              unoptimized
              className="character-avatar"
            />
          )}
          <span className="truncate">
            {activeCharacter ? activeCharacter.name : "Select Character"}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 ml-2" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[300px]">
        <DropdownMenuGroup>
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
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Character
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
