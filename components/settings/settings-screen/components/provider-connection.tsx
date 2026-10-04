"use client";

import { ProviderConnectionDetails } from "@/components/settings/settings-screen/components/provider-connection-details";
import { useProviderConnection } from "@/components/settings/settings-screen/hooks/use-provider-connection";
export const ProviderConnection = (props: Parameters<typeof useProviderConnection>[0]) => {
  const state = useProviderConnection(props);
  return <ProviderConnectionDetails state={state} />;
};
