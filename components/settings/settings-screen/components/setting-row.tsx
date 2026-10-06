"use client";

import { useDataSettings } from "@/components/settings/settings-screen/hooks/use-data-settings";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
export const SettingRow = ({ state }: { state: ReturnType<typeof useDataSettings> }) => {
  const { busy, fileRef, setPendingFile } = state;
  return (
    <div className="setting-row">
      <div>
        <h3>Restore a backup</h3>
        <p>
          Import a JSON backup. This replaces your current characters and saved lines; your provider
          keys stay on this device.
        </p>
      </div>
      <Button variant="outline" disabled={busy} onClick={() => fileRef.current?.click()}>
        <Upload size={16} />
        Import backup
      </Button>
      <input
        ref={fileRef}
        className="sr-only"
        type="file"
        accept=".json,application/json"
        aria-label="Backup file"
        onChange={(event) => {
          setPendingFile(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />
    </div>
  );
};
