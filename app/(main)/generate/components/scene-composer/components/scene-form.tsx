"use client";

import { SceneFields } from "@/app/(main)/generate/components/scene-composer/components/scene-fields";
import Link from "next/link";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import type { useSceneComposer } from "@/app/(main)/generate/components/scene-composer/hooks/use-scene-composer";
export const SceneForm = ({ state }: { state: ReturnType<typeof useSceneComposer> }) => {
  const { onGenerate, generation, resultCount, settings, error, isGenerating } = state;
  return (
    <form
      className="scene-form"
      aria-label="Scene form"
      action={async () => {
        await (onGenerate ?? generation.handleGenerate)();
      }}
      onKeyDown={(event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.requestSubmit();
        }
      }}
    >
      <SceneFields state={state} />
      <SidebarFooter className="scene-footer">
        {!settings.apiKey && (
          <p className="inline-notice">
            Connect a provider to start writing.{" "}
            <Link href="/settings/connections">
              Configure provider <ArrowRight size={14} />
            </Link>
          </p>
        )}
        {error && (
          <p className="inline-error" role="alert">
            {error}
          </p>
        )}
        <Button
          type="submit"
          className="generate-action"
          disabled={
            isGenerating ||
            !settings.apiKey ||
            !settings.model ||
            !Number.isInteger(resultCount) ||
            resultCount < 1 ||
            resultCount > 25
          }
        >
          {isGenerating ? (
            <>
              <LoaderCircle className="loading-icon" size={17} />
              Writing lines…
            </>
          ) : (
            <>
              Generate lines
              <ArrowRight size={17} />
            </>
          )}
        </Button>
        <p className="keyboard-hint">Ctrl / ⌘ + Enter to generate</p>
      </SidebarFooter>
    </form>
  );
};
