"use client";

import { AI_PROVIDERS } from "@/lib/types";
import { useState } from "react";
import { useSettingsStore } from "@/stores/settings-store";
import { testProviderAction } from "@/components/settings/settings-screen/api";
import { toast } from "sonner";
export const useProviderConnection = ({
  provider,
}: {
  provider: (typeof AI_PROVIDERS)[number];
}) => {
  const { settings, updateSettings, setProvider } = useSettingsStore();
  const savedKey = settings.apiKeys[provider.id] || "";
  const [draft, setDraft] = useState(savedKey);
  const [visible, setVisible] = useState(false);
  const [testing, setTesting] = useState(false);
  const [verifiedKey, setVerifiedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const active = settings.provider === provider.id;
  const dirty = draft.trim() !== savedKey;
  const save = () => {
    try {
      const key = draft.trim();
      updateSettings({
        apiKeys: {
          ...settings.apiKeys,
          [provider.id]: key,
        },
        ...(active
          ? {
              apiKey: key,
            }
          : {}),
      });
      setDraft(key);
      setError(null);
      setVerifiedKey(null);
      toast.success(key ? `${provider.name} key saved` : `${provider.name} key removed`);
    } catch {
      setError("Couldn't save the key. Check that browser storage is available.");
    }
  };
  const test = async () => {
    setTesting(true);
    setError(null);
    try {
      const success = await testProviderAction(provider.id, savedKey);
      if (success) {
        setVerifiedKey(savedKey);
        toast.success(`${provider.name} connection verified`);
      } else {
        setVerifiedKey(null);
        const message =
          "Connection failed. Check the key, provider access, and available credits, then try again.";
        setError(message);
        toast.error(message);
      }
    } catch {
      const message = "Couldn't reach the provider. Try again in a moment.";
      setError(message);
      toast.error(message);
    }
    setTesting(false);
  };
  return {
    active,
    provider,
    savedKey,
    verifiedKey,
    visible,
    draft,
    setDraft,
    setVisible,
    save,
    dirty,
    test,
    testing,
    setProvider,
    setError,
    error,
  };
};
