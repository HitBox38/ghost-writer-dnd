"use client";

import { FolioSelect } from "@/components/folio-select";
import { ModelCombobox } from "@/components/model-combobox";
import { AI_PROVIDERS, isAIProvider } from "@/lib/types";
import type { useSceneComposer } from "@/app/(main)/generate/components/scene-composer/hooks/use-scene-composer";
export const AiEngine = ({ state }: { state: ReturnType<typeof useSceneComposer> }) => {
  const { providerName, settings, generation } = state;
  return (
    <div className="ai-engine">
      <div className="ai-engine-head">
        <span className="ai-engine-mark" aria-hidden="true">
          {providerName.slice(0, 1)}
        </span>
        <div>
          <span className="ai-eyebrow">Writing engine · {providerName}</span>
          <strong title={settings.model || undefined}>{settings.model || "Choose a model"}</strong>
        </div>
        {generation.activeCharacter?.characterSheet && <span className="ai-engine-badge">PDF</span>}
      </div>
      <div className="field ai-provider-field">
        <label htmlFor="ai-provider">Provider</label>
        <FolioSelect
          id="ai-provider"
          label="Provider"
          value={settings.provider}
          onValueChange={(value) => {
            if (isAIProvider(value)) generation.handleProviderChange(value);
          }}
          options={AI_PROVIDERS.map(({ id, name }) => ({
            value: id,
            label: name,
          }))}
        />
      </div>
      <div className="field ai-model-field">
        <label htmlFor="ai-model">Model</label>
        <ModelCombobox
          provider={settings.provider}
          apiKey={settings.apiKey}
          value={settings.model}
          onValueChange={(model) =>
            generation.updateSettings({
              model,
            })
          }
          requiresPdf={Boolean(generation.activeCharacter?.characterSheet)}
        />
      </div>
    </div>
  );
};
