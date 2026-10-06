"use client";

import { WritingWorkspace } from "@/app/(main)/generate/components/writing-workspace";
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useCharacterStore } from "@/stores/character-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { NoCharacterState } from "@/app/(main)/generate/components/no-character-state";
import { useGeneration } from "@/app/(main)/generate/hooks/use-generation";
const GeneratePage = () => {
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
};
export default GeneratePage;
