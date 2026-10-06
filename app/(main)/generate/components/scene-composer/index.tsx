"use client";

import { SceneForm } from "@/app/(main)/generate/components/scene-composer/components/scene-form";
import { useSceneComposer } from "@/app/(main)/generate/components/scene-composer/hooks/use-scene-composer";
import { PanelLeftClose } from "lucide-react";
import { SidebarHeader } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
export const SceneComposer = (props: Parameters<typeof useSceneComposer>[0]) => {
  const state = useSceneComposer(props);
  const { showHideButton, hideRef, onHide } = state;
  return (
    <aside id="scene-panel" className="scene-panel" aria-labelledby="scene-heading">
      <SidebarHeader className="section-heading">
        <h2 id="scene-heading">Set the scene</h2>
        {showHideButton && (
          <Button
            ref={hideRef}
            className="compact-icon mobile-scene-toggle"
            aria-label="Hide scene"
            title="Hide scene"
            variant="ghost"
            onClick={() => onHide()}
            aria-expanded={true}
            aria-controls="scene-panel"
          >
            <PanelLeftClose size={16} />
          </Button>
        )}
      </SidebarHeader>
      <SceneForm state={state} />
    </aside>
  );
};
