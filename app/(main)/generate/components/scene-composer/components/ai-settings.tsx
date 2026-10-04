"use client";

import { AiEngine } from "@/app/(main)/generate/components/scene-composer/components/ai-engine";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { isReasoningEffort } from "@/lib/types";
import type { useSceneComposer } from "@/app/(main)/generate/components/scene-composer/hooks/use-scene-composer";
export const AiSettings = ({ state }: { state: ReturnType<typeof useSceneComposer> }) => {
  const { providerName, settings, generation, reasoningOptions, reasoningEffort } = state;
  return (
    <details className="ai-settings">
      <summary>
        <span className="ai-settings-title">
          <SlidersHorizontal size={15} aria-hidden="true" />
          AI settings
        </span>
        <span className="ai-settings-current">{providerName}</span>
        <ChevronDown className="ai-settings-chevron" size={15} aria-hidden="true" />
      </summary>
      <div className="ai-settings-body">
        <AiEngine state={state} />
        <fieldset className="ai-reasoning">
          <legend>Reasoning</legend>
          <div className="ai-effort-options" role="group" aria-label="Reasoning effort">
            {reasoningOptions.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                aria-pressed={reasoningEffort === value}
                disabled={settings.provider === "cohere"}
                onClick={() => {
                  if (isReasoningEffort(value))
                    generation.updateSettings({
                      reasoningEffort: value,
                    });
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="field-help">
            {settings.provider === "cohere"
              ? "Reasoning control is unavailable for Cohere."
              : settings.provider === "mistral"
                ? "High is available on supported Mistral models."
                : "Available on models with adjustable reasoning. Higher effort may take longer."}
          </p>
        </fieldset>
        <div className="ai-creativity">
          <div className="ai-creativity-heading">
            <label htmlFor="temperature">Creativity</label>
            <output htmlFor="temperature">{settings.temperature.toFixed(1)}</output>
          </div>
          <input
            type="range"
            id="temperature"
            min={0}
            max={2}
            step={0.1}
            value={settings.temperature}
            onChange={(event) =>
              generation.updateSettings({
                temperature: event.target.valueAsNumber,
              })
            }
          />
          <div className="ai-creativity-scale" aria-hidden="true">
            <span>Consistent</span>
            <span>Surprising</span>
          </div>
        </div>
      </div>
    </details>
  );
};
