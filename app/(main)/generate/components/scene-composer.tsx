import type { Ref } from "react";
import Link from "next/link";
import {
  PanelLeftClose,
  ArrowRight,
  ChevronDown,
  LoaderCircle,
  SlidersHorizontal,
  FileText,
  UserRound,
} from "lucide-react";
import { SidebarHeader, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { FolioSelect } from "@/components/folio-select";
import { ModelCombobox } from "@/components/model-combobox";
import { Button } from "@/components/ui/button";
import { PdfViewer } from "@/components/pdf-viewer";
import { AI_PROVIDERS, isAIProvider, isReasoningEffort, type GenerationType } from "@/lib/types";
import type { useGeneration } from "../hooks/use-generation";
export function SceneComposer({
  generation,
  onHide,
  onGenerate,
  hideRef,
  showHideButton = true,
  contextRef,
}: {
  generation: ReturnType<typeof useGeneration>;
  onHide: () => void;
  onGenerate?: () => Promise<void>;
  hideRef: Ref<HTMLButtonElement>;
  showHideButton?: boolean;
  contextRef?: Ref<HTMLTextAreaElement>;
}) {
  const { settings, generationType, context, resultCount, isGenerating, error } = generation;
  const providerName = AI_PROVIDERS.find(({ id }) => id === settings.provider)?.name ?? "Provider";
  const reasoningEffort =
    settings.provider === "cohere" ||
    (settings.provider === "mistral" && settings.reasoningEffort !== "high")
      ? "provider-default"
      : (settings.reasoningEffort ?? "provider-default");
  const reasoningOptions =
    settings.provider === "mistral"
      ? [
          { value: "provider-default", label: "Default" },
          { value: "high", label: "High" },
        ]
      : [
          { value: "provider-default", label: "Default" },
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
        ];
  return (
    <aside id="scene-panel" className="scene-panel" aria-labelledby="scene-heading">
      <SidebarHeader className="section-heading">
        <h2 id="scene-heading">Set the scene</h2>
        {showHideButton && (
          <Button
            ref={hideRef}
            className="compact-icon mobile-scene-toggle"
            aria-label="Hide scene"
            title="Hide scene"
            variant="ghost"
            onClick={() => onHide()}
            aria-expanded={true}
            aria-controls="scene-panel"
          >
            <PanelLeftClose size={16} />
          </Button>
        )}
      </SidebarHeader>
      <form
        className="scene-form"
        aria-label="Scene form"
        onSubmit={(event) => {
          event.preventDefault();
          void (onGenerate ?? generation.handleGenerate)();
        }}
        onKeyDown={(event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            event.preventDefault();
            event.currentTarget.requestSubmit();
          }
        }}
      >
        <SidebarContent
          className="scene-fields"
          role="region"
          aria-label="Scene fields"
          tabIndex={0}
        >
          <fieldset>
            <legend>What are we writing?</legend>
            <div className="segmented-control">
              {(
                [
                  ["mockery", "Combat quips"],
                  ["catchphrase", "Catchphrases"],
                ] as const
              ).map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  aria-pressed={generationType === value}
                  onClick={() => generation.setGenerationType(value as GenerationType)}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="field">
            <label htmlFor="scene-context">What&apos;s happening?</label>
            <div className="scene-prompt">
              <textarea
                ref={contextRef}
                id="scene-context"
                rows={5}
                value={context}
                onChange={(event) => generation.setContext(event.target.value)}
                placeholder="A pompous knight challenges you to a duel. Your party is watching."
              />
              <div className="scene-context-sources" aria-label="Context included">
                <span className="context-chip">
                  <UserRound size={13} aria-hidden="true" />
                  {generation.activeCharacter?.name}
                </span>
                {generation.activeCharacter?.characterSheet && (
                  <PdfViewer
                    sheet={generation.activeCharacter.characterSheet}
                    fileName={generation.activeCharacter.characterSheetMetadata?.name}
                    trigger={
                      <button
                        type="button"
                        className="context-chip attachment-chip"
                        title="View character sheet"
                      >
                        <FileText size={13} aria-hidden="true" />
                        <span>
                          {generation.activeCharacter.characterSheetMetadata?.name ||
                            "Character sheet.pdf"}
                        </span>
                        <span className="attachment-chip-type">PDF</span>
                      </button>
                    }
                  />
                )}
              </div>
            </div>
            <p className="field-help">Add a moment, or leave blank to draw from your character.</p>
          </div>
          <div className="count-row">
            <label htmlFor="result-count">Number of lines</label>
            <input
              id="result-count"
              type="number"
              min={1}
              max={25}
              required
              value={Number.isNaN(resultCount) ? "" : resultCount}
              onChange={(event) => generation.setResultCount(event.target.valueAsNumber)}
            />
          </div>
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
              <div className="ai-engine">
                <div className="ai-engine-head">
                  <span className="ai-engine-mark" aria-hidden="true">
                    {providerName.slice(0, 1)}
                  </span>
                  <div>
                    <span className="ai-eyebrow">Writing engine · {providerName}</span>
                    <strong title={settings.model || undefined}>
                      {settings.model || "Choose a model"}
                    </strong>
                  </div>
                  {generation.activeCharacter?.characterSheet && (
                    <span className="ai-engine-badge">PDF</span>
                  )}
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
                    options={AI_PROVIDERS.map(({ id, name }) => ({ value: id, label: name }))}
                  />
                </div>
                <div className="field ai-model-field">
                  <label htmlFor="ai-model">Model</label>
                  <ModelCombobox
                    provider={settings.provider}
                    apiKey={settings.apiKey}
                    value={settings.model}
                    onValueChange={(model) => generation.updateSettings({ model })}
                    requiresPdf={Boolean(generation.activeCharacter?.characterSheet)}
                  />
                </div>
              </div>
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
                          generation.updateSettings({ reasoningEffort: value });
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
                    generation.updateSettings({ temperature: event.target.valueAsNumber })
                  }
                />
                <div className="ai-creativity-scale" aria-hidden="true">
                  <span>Consistent</span>
                  <span>Surprising</span>
                </div>
              </div>
            </div>
          </details>
        </SidebarContent>
        <SidebarFooter className="scene-footer">
          {!settings.apiKey && (
            <p className="inline-notice">
              Connect a provider to start writing.{" "}
              <Link href="/settings/connections">
                Configure provider <ArrowRight size={14} />
              </Link>
            </p>
          )}
          {error && (
            <p className="inline-error" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="generate-action"
            disabled={
              isGenerating ||
              !settings.apiKey ||
              !settings.model ||
              !Number.isInteger(resultCount) ||
              resultCount < 1 ||
              resultCount > 25
            }
          >
            {isGenerating ? (
              <>
                <LoaderCircle className="loading-icon" size={17} />
                Writing lines…
              </>
            ) : (
              <>
                Generate lines
                <ArrowRight size={17} />
              </>
            )}
          </Button>
          <p className="keyboard-hint">Ctrl / ⌘ + Enter to generate</p>
        </SidebarFooter>
      </form>
    </aside>
  );
}
