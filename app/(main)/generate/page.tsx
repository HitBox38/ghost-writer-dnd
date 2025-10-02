'use client';

import { GenerationControls } from './components/generation-controls';
import { ResultsDisplay } from './components/results-display';
import { NoCharacterState } from './components/no-character-state';
import { useGeneration } from './hooks/use-generation';

export default function GeneratePage() {
  const {
    results,
    generationType,
    context,
    favorites,
    isGenerating,
    resultCount,
    settings,
    activeCharacter,
    handleGenerate,
    handleToggleFavorite,
    handleCopy,
    handleProviderChange,
    handleKeyDown,
    setGenerationType,
    setContext,
    setResultCount,
    updateSettings,
  } = useGeneration();

  if (!activeCharacter) {
    return <NoCharacterState />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2">
        <GenerationControls
          generationType={generationType}
          context={context}
          provider={settings.provider}
          model={settings.model}
          temperature={settings.temperature}
          resultCount={resultCount}
          isGenerating={isGenerating}
          hasApiKey={!!settings.apiKey}
          onGenerationTypeChange={setGenerationType}
          onContextChange={setContext}
          onProviderChange={handleProviderChange}
          onModelChange={(model) => updateSettings({ model })}
          onTemperatureChange={(temperature) => updateSettings({ temperature })}
          onResultCountChange={setResultCount}
          onGenerate={handleGenerate}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="lg:col-span-3">
        <ResultsDisplay
          results={results}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onCopy={handleCopy}
        />
      </div>
    </div>
  );
}
