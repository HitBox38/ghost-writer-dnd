"use client";

import { ProviderFields } from "@/components/settings/settings-screen/components/provider-fields";
import { useProviderConnection } from "@/components/settings/settings-screen/hooks/use-provider-connection";
import { Check } from "lucide-react";
export const ProviderConnectionDetails = ({
  state,
}: {
  state: ReturnType<typeof useProviderConnection>;
}) => {
  const { active, provider, savedKey, verifiedKey } = state;
  return (
    <details className="provider-row" open={active || undefined}>
      <summary>
        <strong className="provider-name">{provider.name}</strong>
        <span>
          {active ? "In use · " : ""}
          {savedKey ? (
            verifiedKey === savedKey ? (
              <span className="verified-status">
                <Check className="verified-mark" size={14} aria-hidden="true" />
                Connection verified
              </span>
            ) : (
              "Key saved"
            )
          ) : (
            "Not configured"
          )}
        </span>
      </summary>
      <ProviderFields state={state} />
    </details>
  );
};
