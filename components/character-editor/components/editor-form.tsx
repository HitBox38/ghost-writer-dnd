"use client";

import { EditorLayout } from "@/components/character-editor/components/editor-layout";
import { useEditorForm } from "@/components/character-editor/hooks/use-editor-form";
export const EditorForm = (props: Parameters<typeof useEditorForm>[0]) => {
  const state = useEditorForm(props);
  return <EditorLayout state={state} />;
};
