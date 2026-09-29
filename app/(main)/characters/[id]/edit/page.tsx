import { CharacterEditor } from "@/components/character-editor";
export default async function EditCharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CharacterEditor characterId={id} />;
}
