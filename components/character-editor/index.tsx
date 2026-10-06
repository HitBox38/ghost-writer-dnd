"use client";

import Link from "next/link";
import { useCharacterStore } from "@/stores/character-store";
import { EditorForm } from "@/components/character-editor/components/editor-form";
export const CharacterEditor = ({ characterId }: { characterId?: string }) => {
  const { initialized, characters } = useCharacterStore();
  if (!initialized)
    return (
      <p className="loading-state" role="status">
        Opening character…
      </p>
    );
  const character = characters.find((item) => item.id === characterId);
  if (characterId && !character)
    return (
      <section className="onboarding">
        <h1>Character not found</h1>
        <p>This character may have been removed or belongs to another browser.</p>
        <Link href="/generate" className="primary-link">
          Back to workspace
        </Link>
      </section>
    );
  return <EditorForm key={characterId ?? "new"} character={character} />;
};
