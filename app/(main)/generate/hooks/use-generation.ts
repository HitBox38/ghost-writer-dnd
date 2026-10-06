import { useCharacterStore } from "@/stores/character-store";
import { useSettingsStore } from "@/stores/settings-store";
import { EMPTY_SESSION, useWorkspaceStore, type WritingSession } from "@/stores/workspace-store";
import { generateFlavorTextAction } from "@/app/(main)/generate/actions";
import { toast } from "sonner";
import { copyLine } from "@/lib/clipboard";
import type {
  AIProvider,
  GenerationResult,
  GenerationType,
  CharacterProfile,
  Settings,
} from "@/lib/types";
export const useGeneration = () => {
  const { characters, activeCharacterId, addFavorite, removeFavorite } = useCharacterStore();
  const { settings, updateSettings, setProvider } = useSettingsStore();
  const { sessions, updateSession } = useWorkspaceStore();
  const activeCharacter =
    characters.find((character) => character.id === activeCharacterId) ?? null;
  const session = (activeCharacterId && sessions[activeCharacterId]) || EMPTY_SESSION;
  const patch = (updates: Partial<typeof session>) => {
    if (activeCharacterId) updateSession(activeCharacterId, updates);
  };
  const findFavorite = (result: GenerationResult) =>
    activeCharacter?.favorites.find(
      (favorite) =>
        favorite.text === result.text &&
        favorite.type === session.resultType &&
        (favorite.context || "") === session.resultContext,
    );
  const favorites = new Set(
    session.results.filter((result) => findFavorite(result)).map((result) => result.id),
  );
  const handleGenerate = () => runGeneration(activeCharacter, session, settings);
  const handleToggleFavorite = (result: GenerationResult) => {
    if (!activeCharacter) return;
    try {
      const favorite = findFavorite(result);
      if (favorite) removeFavorite(activeCharacter.id, favorite.id);
      else addFavorite(activeCharacter.id, result.text, session.resultType, session.resultContext);
    } catch {
      toast.error("Couldn't update saved lines. Your browser storage may be full.");
    }
  };
  return {
    ...session,
    favorites,
    settings,
    activeCharacter,
    handleGenerate,
    handleToggleFavorite,
    handleCopy: copyLine,
    handleProviderChange: (provider: AIProvider) => setProvider(provider),
    handleKeyDown: (event: React.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        void handleGenerate();
      }
    },
    setGenerationType: (generationType: GenerationType) =>
      patch({
        generationType,
      }),
    setContext: (context: string) =>
      patch({
        context,
      }),
    setResultCount: (resultCount: number) =>
      patch({
        resultCount,
      }),
    updateSettings,
  };
};
const runGeneration = async (
  activeCharacter: CharacterProfile | null,
  session: WritingSession,
  settings: Settings,
) => {
  const { updateSession } = useWorkspaceStore.getState();
  if (
    !activeCharacter ||
    !settings.apiKey ||
    !settings.model ||
    session.isGenerating ||
    useWorkspaceStore.getState().sessions[activeCharacter.id]?.isGenerating ||
    !Number.isInteger(session.resultCount) ||
    session.resultCount < 1 ||
    session.resultCount > 25
  )
    return;
  const id = activeCharacter.id;
  const { generationType, context, resultCount } = session;
  const requestId = crypto.randomUUID();
  const isCurrent = () =>
    useWorkspaceStore.getState().sessions[id]?.requestId === requestId &&
    useCharacterStore.getState().characters.some((character) => character.id === id);
  updateSession(id, {
    isGenerating: true,
    error: null,
    requestId,
  });
  try {
    const results = await generateFlavorTextAction(
      activeCharacter,
      generationType,
      settings.provider,
      settings.model,
      settings.apiKey,
      settings.temperature,
      context,
      resultCount,
      settings.reasoningEffort ?? "provider-default",
    );
    // Resetting or replacing local data invalidates pending provider responses.
    if (isCurrent()) {
      updateSession(id, {
        results,
        resultType: generationType,
        resultContext: context,
      });
      toast.success(`Generated ${results.length} lines for ${activeCharacter.name}`);
    }
  } catch (error) {
    if (isCurrent()) {
      const message =
        error instanceof Error ? error.message : "Couldn't generate lines. Please try again.";
      updateSession(id, {
        error: message,
      });
      toast.error(message);
    }
  } finally {
    if (isCurrent())
      updateSession(id, {
        isGenerating: false,
        requestId: null,
      });
  }
};
