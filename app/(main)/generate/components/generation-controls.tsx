'use client';

import { Card, CardContent } from '@/components/ui/card';
import { GenerationTypeSelector } from './generation-type-selector';
import { AiSettingsSection } from './ai-settings-section';
import { GenerationSliders } from './generation-sliders';
import { ContextInput } from './context-input';
import { GenerateButton } from './generate-button';
import type { AIProvider, GenerationType } from '@/lib/types';

interface GenerationControlsProps {
  generationType: GenerationType;
  context: string;
  provider: AIProvider;
  model: string;
  temperature: number;
  resultCount: number;
  isGenerating: boolean;
  hasApiKey: boolean;
  onGenerationTypeChange: (type: GenerationType) => void;
  onContextChange: (context: string) => void;
  onProviderChange: (provider: AIProvider) => void;
  onModelChange: (model: string) => void;
  onTemperatureChange: (temperature: number) => void;
  onResultCountChange: (count: number) => void;
  onGenerate: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const GenerationControls = ({
  generationType,
  context,
  provider,
  model,
  temperature,
  resultCount,
  isGenerating,
  hasApiKey,
  onGenerationTypeChange,
  onContextChange,
  onProviderChange,
  onModelChange,
  onTemperatureChange,
  onResultCountChange,
  onGenerate,
  onKeyDown,
}: GenerationControlsProps) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <GenerationTypeSelector value={generationType} onChange={onGenerationTypeChange} />

        <AiSettingsSection
          provider={provider}
          model={model}
          temperature={temperature}
          onProviderChange={onProviderChange}
          onModelChange={onModelChange}
          onTemperatureChange={onTemperatureChange}
        />

        <GenerationSliders resultCount={resultCount} onResultCountChange={onResultCountChange} />

        <ContextInput
          value={context}
          generationType={generationType}
          onChange={onContextChange}
          onKeyDown={onKeyDown}
        />

        <GenerateButton isGenerating={isGenerating} hasApiKey={hasApiKey} onClick={onGenerate} />
      </CardContent>
    </Card>
  );
};