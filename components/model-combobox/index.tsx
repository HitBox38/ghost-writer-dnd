"use client";

import type { AIProvider } from "@/lib/types";
import { ModelComboboxForConnection } from "@/components/model-combobox/components/model-combobox-for-connection";
export const ModelCombobox = ({
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
}) => {
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
};
