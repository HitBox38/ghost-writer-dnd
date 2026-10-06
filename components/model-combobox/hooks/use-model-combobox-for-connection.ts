"use client";

import type { AIProvider } from "@/lib/types";
import { useEffect, useEffectEvent, useState } from "react";
import { getProviderModelsAction } from "@/components/model-combobox/api";
import type { ModelOption } from "@/lib/model-catalog";
import { getModelCatalogMessage } from "../helpers";
import type { ModelCatalogStatus } from "../types";
export const useModelComboboxForConnection = ({
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
}) => {
  const [models, setModels] = useState<ModelOption[]>([]);
  const [status, setStatus] = useState<ModelCatalogStatus>(apiKey ? "loading" : "idle");
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
  const options =
    value && !current
      ? [
          {
            value,
            label: value,
          },
          ...models,
        ]
      : models;
  const message = getModelCatalogMessage({
    hasApiKey: Boolean(apiKey),
    status,
    requiresPdf,
    modelCount: models.length,
  });
  return {
    provider,
    options,
    value,
    setStatus,
    onValueChange,
    apiKey,
    status,
    message,
  };
};
