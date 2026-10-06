import { CharacterEditor } from "@/components/character-editor";
const EditCharacterPage = async ({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await params;
  return <CharacterEditor characterId={id} />;
};
export default EditCharacterPage;
