"use client";

import type { ModelOption } from "@/lib/model-catalog";
import { useModelComboboxForConnection } from "@/components/model-combobox/hooks/use-model-combobox-for-connection";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
export const ModelComboboxForConnection = (
  props: Parameters<typeof useModelComboboxForConnection>[0],
) => {
  const { provider, options, value, setStatus, onValueChange, apiKey, status, message } =
    useModelComboboxForConnection(props);
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
};
