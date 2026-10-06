"use client";

import type { Ref } from "react";
import { AI_PROVIDERS } from "@/lib/types";
import type { useGeneration } from "@/app/(main)/generate/hooks/use-generation";
export const useSceneComposer = ({
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
}) => {
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
          {
            value: "provider-default",
            label: "Default",
          },
          {
            value: "high",
            label: "High",
          },
        ]
      : [
          {
            value: "provider-default",
            label: "Default",
          },
          {
            value: "low",
            label: "Low",
          },
          {
            value: "medium",
            label: "Medium",
          },
          {
            value: "high",
            label: "High",
          },
        ];
  return {
    showHideButton,
    hideRef,
    onHide,
    onGenerate,
    generation,
    generationType,
    contextRef,
    context,
    resultCount,
    providerName,
    settings,
    reasoningOptions,
    reasoningEffort,
    error,
    isGenerating,
  };
};
