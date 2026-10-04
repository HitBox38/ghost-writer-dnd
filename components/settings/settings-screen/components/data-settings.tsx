"use client";

import { SettingRow } from "@/components/settings/settings-screen/components/setting-row";
import { useDataSettings } from "@/components/settings/settings-screen/hooks/use-data-settings";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
export const DataSettings = () => {
  const state = useDataSettings();
  const {
    characters,
    exportData,
    setError,
    busy,
    setPendingFile,
    setClearing,
    error,
    pendingFile,
    applyImport,
    clearing,
    clear,
  } = state;
  return (
    <>
      <h2>Data & backups</h2>
      <p className="settings-intro">
        Your characters and saved lines live in this browser. Keep a backup before changing devices
        or clearing browser data.
      </p>
      <div className="setting-row">
        <div>
          <h3>Export a backup</h3>
          <p>
            {characters.length} characters and their saved lines, portraits, character sheets, and
            preferences. API keys are excluded.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            try {
              exportData();
            } catch {
              setError("Couldn't export a backup. Please try again.");
            }
          }}
        >
          <Download size={16} />
          Export backup
        </Button>
      </div>
      <SettingRow state={state} />
      <div className="setting-row settings-danger">
        <div>
          <h3>Clear local data</h3>
          <p>
            Remove every character, saved line, provider key, and preference from this browser. This
            cannot be undone.
          </p>
        </div>
        <Button variant="outline" onClick={() => setClearing(true)} disabled={busy}>
          Clear local data
        </Button>
      </div>
      {error && (
        <p className="inline-error" role="alert">
          {error}
        </p>
      )}
      <ConfirmDialog
        open={!!pendingFile}
        onOpenChange={(open) => {
          if (!open && !busy) setPendingFile(null);
        }}
        title="Replace data with this backup?"
        description="Your current characters and saved lines will be replaced. Export a backup first if you want to keep them. Provider keys will be preserved."
        action={busy ? "Restoring…" : "Restore backup"}
        onConfirm={() => void applyImport()}
      />
      <ConfirmDialog
        open={clearing}
        onOpenChange={(open) => {
          if (!busy) setClearing(open);
        }}
        title="Clear all local data?"
        description="This permanently removes your characters, saved lines, portraits, sheets, and provider keys from this browser."
        action={busy ? "Clearing…" : "Clear all data"}
        onConfirm={() => void clear()}
      />
    </>
  );
};
