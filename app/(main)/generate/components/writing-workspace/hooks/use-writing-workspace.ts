"use client";

import { useRef, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { useGeneration } from "@/app/(main)/generate/hooks/use-generation";
export const useWritingWorkspace = ({
  generation,
}: {
  generation: ReturnType<typeof useGeneration>;
}) => {
  const { isMobile, open, setOpen, openMobile, setOpenMobile } = useSidebar();
  const showRef = useRef<HTMLButtonElement>(null);
  const hideRef = useRef<HTMLButtonElement>(null);
  const contextRef = useRef<HTMLTextAreaElement>(null);
  const [focusSceneDraft, setFocusSceneDraft] = useState(false);
  const { results, isGenerating } = generation;
  const sceneVisible = isMobile ? openMobile : open;
  const toggleScene = (next: boolean) => {
    setFocusSceneDraft(false);
    if (isMobile) setOpenMobile(next);
    else {
      setOpen(next);
      showRef.current?.focus();
    }
  };
  const generate = async () => {
    await generation.handleGenerate();
    const id = generation.activeCharacter?.id;
    const current = id ? useWorkspaceStore.getState().sessions[id] : undefined;
    if (isMobile && current && current.results !== results && !current.error) setOpenMobile(false);
  };
  return {
    showRef,
    sceneVisible,
    toggleScene,
    isMobile,
    open,
    focusSceneDraft,
    contextRef,
    hideRef,
    generation,
    generate,
    isGenerating,
    results,
    setFocusSceneDraft,
    setOpenMobile,
    setOpen,
  };
};
