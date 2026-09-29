"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useCharacterStore } from "@/stores/character-store";
import { CharacterDropdown } from "./character-dropdown";

export function ProfileSelector() {
  const router = useRouter();
  const { characters, activeCharacterId, setActiveCharacter, initialized } = useCharacterStore();
  const character = characters.find((item) => item.id === activeCharacterId) ?? null;
  if (!initialized)
    return (
      <div className="profile-selector">
        <span className="text-action" role="status">
          Loading characters…
        </span>
      </div>
    );
  if (!characters.length)
    return (
      <div className="profile-selector">
        <Link href="/characters/new" className="text-action">
          <Plus size={16} />
          Create character
        </Link>
      </div>
    );
  return (
    <div className="profile-selector">
      <CharacterDropdown
        characters={characters}
        activeCharacter={character}
        onSelectCharacter={setActiveCharacter}
        onCreateNew={() => router.push("/characters/new")}
      />
      {character && (
        <>
          <span className="character-detail">
            {[character.race, character.class, `Level ${character.level}`]
              .filter(Boolean)
              .join(" · ")}
          </span>
          <Link
            href={`/characters/${character.id}/edit`}
            className="text-action"
            aria-label={`Edit ${character.name}`}
          >
            Edit
          </Link>
        </>
      )}
    </div>
  );
}
