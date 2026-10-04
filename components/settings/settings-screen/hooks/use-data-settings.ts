"use client";

import { useRef, useState } from "react";
import { useSettingsStore } from "@/stores/settings-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { useCharacterStore } from "@/stores/character-store";
import { toast } from "sonner";
export const useDataSettings = () => {
  const { exportData, importData, clearAllData } = useSettingsStore();
  const characters = useCharacterStore((state) => state.characters);
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [clearing, setClearing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const applyImport = async () => {
    if (!pendingFile || busy) return;
    setBusy(true);
    setError(null);
    try {
      await importData(pendingFile);
      useWorkspaceStore.getState().reset();
      setPendingFile(null);
      toast.success("Backup restored");
    } catch (problem) {
      setPendingFile(null);
      setError(problem instanceof Error ? problem.message : "Couldn't restore this backup.");
    }
    setBusy(false);
  };
  const clear = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await clearAllData();
      useWorkspaceStore.getState().reset();
      setClearing(false);
      toast.success("Local data cleared");
    } catch {
      setClearing(false);
      setError("Couldn't clear local data. Check your browser storage settings.");
    }
    setBusy(false);
  };
  return {
    characters,
    exportData,
    setError,
    busy,
    fileRef,
    setPendingFile,
    setClearing,
    error,
    pendingFile,
    applyImport,
    clearing,
    clear,
  };
};
