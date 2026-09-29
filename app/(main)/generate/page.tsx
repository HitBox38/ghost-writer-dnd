"use client";

import { useRef, useState } from "react";

import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { Sidebar, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { SceneComposer } from "./components/scene-composer";
import { useCharacterStore } from "@/stores/character-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { ResultsDisplay } from "./components/results-display";
import { NoCharacterState } from "./components/no-character-state";
import { useGeneration } from "./hooks/use-generation";

export default function GeneratePage() {
  const generation = useGeneration();
  const [animateScene, setAnimateScene] = useState(true);
  const { sceneOpen, setSceneOpen } = useWorkspaceStore();
  const initialized = useCharacterStore((state) => state.initialized);
  const { activeCharacter } = generation;
  if (!initialized)
    return (
      <p className="loading-state" role="status">
        Opening your workspace…
      </p>
    );
  if (!activeCharacter) return <NoCharacterState />;
  return (
    <SidebarProvider
      className="writing-workspace"
      open={sceneOpen}
      onOpenChange={setSceneOpen}
      data-scene-motion={animateScene ? "animated" : "instant"}
      onPointerDownCapture={() => setAnimateScene(true)}
      onKeyDownCapture={() => setAnimateScene(false)}
    >
      <WritingWorkspace generation={generation} />
    </SidebarProvider>
  );
}

function WritingWorkspace({ generation }: { generation: ReturnType<typeof useGeneration> }) {
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
  return (
    <>
      <Button
        ref={showRef}
        className="scene-toggle compact-icon"
        variant="ghost"
        aria-label={sceneVisible ? "Hide scene" : "Show scene"}
        title={sceneVisible ? "Hide scene" : "Show scene"}
        onClick={() => toggleScene(!sceneVisible)}
        aria-expanded={sceneVisible}
        aria-controls="scene-panel"
      >
        {sceneVisible ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
      </Button>
      {
        <Sidebar
          className="scene-sidebar"
          inert={!isMobile && !open}
          mobileTitle="Set the scene"
          mobileDescription="Choose the scene, line count, and AI settings for your character."
          mobileContentProps={{
            className: "scene-drawer",
            initialFocus: focusSceneDraft ? contextRef : hideRef,
            finalFocus: showRef,
            showCloseButton: false,
          }}
        >
          <SceneComposer
            generation={generation}
            onGenerate={generate}
            onHide={() => toggleScene(false)}
            hideRef={hideRef}
            contextRef={contextRef}
            showHideButton={isMobile}
          />
        </Sidebar>
      }
      <section className="results-section" aria-label="Generated lines" aria-busy={isGenerating}>
        <ResultsDisplay
          results={results}
          favorites={generation.favorites}
          onToggleFavorite={generation.handleToggleFavorite}
          onCopy={generation.handleCopy}
          isGenerating={isGenerating}
          pendingCount={generation.resultCount}
          characterName={generation.activeCharacter?.name}
          generationType={generation.generationType}
          resultType={generation.resultType}
          resultContext={generation.resultContext}
          onChooseScene={(scene) => {
            generation.setContext(scene);
            if (isMobile) {
              setFocusSceneDraft(true);
              setOpenMobile(true);
            } else {
              setOpen(true);
              requestAnimationFrame(() => contextRef.current?.focus());
            }
          }}
        />
        <span className="sr-only" role="status">
          {isGenerating ? "Generating lines" : `${results.length} lines available`}
        </span>
      </section>
    </>
  );
}
