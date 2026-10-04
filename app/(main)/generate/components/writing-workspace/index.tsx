"use client";

import { useWritingWorkspace } from "@/app/(main)/generate/components/writing-workspace/hooks/use-writing-workspace";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { SceneComposer } from "@/app/(main)/generate/components/scene-composer";
import { ResultsDisplay } from "@/app/(main)/generate/components/results-display";
export const WritingWorkspace = (props: Parameters<typeof useWritingWorkspace>[0]) => {
  const {
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
  } = useWritingWorkspace(props);
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
};
