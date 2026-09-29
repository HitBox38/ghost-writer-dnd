"use client";

import { useEffect, useEffectEvent, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { getProviderModelsAction } from "@/app/(main)/generate/model-actions";
import type { ModelOption } from "@/lib/model-catalog";
import type { AIProvider } from "@/lib/types";

export function ModelCombobox({
  provider,
  apiKey,
  value,
  onValueChange,
  requiresPdf = false,
}: {
  provider: AIProvider;
  apiKey: string;
  value: string;
  onValueChange: (value: string) => void;
  requiresPdf?: boolean;
}) {
  return (
    <ModelComboboxForConnection
      key={`${provider}:${apiKey}:${requiresPdf}`}
      provider={provider}
      apiKey={apiKey}
      value={value}
      onValueChange={onValueChange}
      requiresPdf={requiresPdf}
    />
  );
}

function ModelComboboxForConnection({
  provider,
  apiKey,
  value,
  onValueChange,
  requiresPdf,
}: {
  provider: AIProvider;
  apiKey: string;
  value: string;
  onValueChange: (value: string) => void;
  requiresPdf: boolean;
}) {
  const [models, setModels] = useState<ModelOption[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "missing" | "error">(
    apiKey ? "loading" : "idle",
  );
  const acceptModels = useEffectEvent((options: ModelOption[]) => {
    setModels(options);
    if (value && !options.some((option) => option.value === value)) {
      setStatus("missing");
      onValueChange("");
    } else {
      setStatus("ready");
    }
  });

  useEffect(() => {
    let cancelled = false;
    if (!apiKey) return;
    getProviderModelsAction(provider, apiKey, requiresPdf).then(
      (options) => {
        if (cancelled) return;
        acceptModels(options);
      },
      () => {
        if (cancelled) return;
        setModels([]);
        setStatus("error");
      },
    );
    return () => {
      cancelled = true;
    };
  }, [provider, apiKey, requiresPdf]);

  const current = models.find((model) => model.value === value);
  const options = value && !current ? [{ value, label: value }, ...models] : models;
  const message = !apiKey
    ? "Connect this provider to browse models."
    : status === "loading" || status === "idle"
      ? "Loading models…"
      : status === "error"
        ? "Couldn't load models. Your saved model is still selected."
        : status === "missing"
          ? requiresPdf
            ? "Saved model can't read the attached PDF. Choose a compatible model."
            : "Saved model is no longer in the catalog. Choose an available model."
          : models.length === 0
            ? requiresPdf
              ? "No text models with inline PDF support are available for this key."
              : "No text models are available for this key."
            : requiresPdf
              ? "Showing text models that accept PDFs."
              : "";

  return (
    <>
      <Combobox
        key={provider}
        items={options}
        filter={(model: ModelOption, query) =>
          `${model.label} ${model.value}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())
        }
        value={options.find((model) => model.value === value) ?? null}
        onValueChange={(model) => {
          setStatus("ready");
          onValueChange(model?.value ?? "");
        }}
      >
        <ComboboxInput
          id="ai-model"
          aria-label="Model"
          aria-describedby="model-status"
          className="folio-model-input"
          placeholder={apiKey ? "Search models…" : "Connect a provider first"}
          disabled={!apiKey || status === "loading" || status === "idle"}
        />
        <ComboboxContent className="folio-model-menu">
          <ComboboxEmpty>No matching models</ComboboxEmpty>
          <ComboboxList>
            {(model: ModelOption) => (
              <ComboboxItem key={model.value} value={model}>
                <span className="model-option-label">{model.label}</span>
                {model.label !== model.value && (
                  <span className="model-option-id">{model.value}</span>
                )}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <p id="model-status" className="field-help" role="status">
        {message}
      </p>
    </>
  );
}
