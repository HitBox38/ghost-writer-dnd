import { useState } from 'react';
import { useCharacterStore } from '@/stores/character-store';
import { useSettingsStore } from '@/stores/settings-store';
import { useResultsStore } from '@/stores/results-store';
import { generateFlavorText } from '@/lib/ai-generator';
import { toast } from 'sonner';
import type { AIProvider } from '@/lib/types';

export const useGeneration = () => {
  const { getActiveCharacter, addFavorite } = useCharacterStore();
  const { settings, updateSettings } = useSettingsStore();
  const {
    results,
    generationType,
    context,
    favorites,
    setResults,
    toggleFavorite,
    setGenerationType,
    setContext,
  } = useResultsStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [resultCount, setResultCount] = useState(5);

  const activeCharacter = getActiveCharacter();

  const handleGenerate = async () => {
    if (!activeCharacter) {
      toast.error('Please select or create a character first');
      return;
    }

    if (!settings.apiKey) {
      toast.error('Please configure your API key in settings');
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await generateFlavorText(
        activeCharacter,
        generationType,
        settings.provider,
        settings.model,
        settings.apiKey,
        settings.temperature,
        context,
        resultCount
      );

      setResults(generated, generationType, context);
      toast.success(
        `Generated ${generated.length} ${
          generationType === 'mockery' ? 'combat quips' : 'catchphrases'
        }`
      );
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate text');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleFavorite = (result: { id: string; text: string }) => {
    if (!activeCharacter) return;

    if (favorites.has(result.id)) {
      toggleFavorite(result.id);
    } else {
      addFavorite(activeCharacter.id, result.text, generationType, context);
      toggleFavorite(result.id);
      toast.success('Added to favorites');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleProviderChange = (provider: AIProvider) => {
    updateSettings({
      provider,
      model: MODEL_OPTIONS[provider][0].value,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleGenerate();
    }
  };

  return {
    // State
    results,
    generationType,
    context,
    favorites,
    isGenerating,
    resultCount,
    settings,
    activeCharacter,
    // Handlers
    handleGenerate,
    handleToggleFavorite,
    handleCopy,
    handleProviderChange,
    handleKeyDown,
    setGenerationType,
    setContext,
    setResultCount,
    updateSettings,
  };
};

// Re-export for convenience
import { MODEL_OPTIONS } from '@/lib/types';