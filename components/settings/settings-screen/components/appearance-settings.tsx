"use client";

import { useSettingsStore } from "@/stores/settings-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { toast } from "sonner";
export const AppearanceSettings = () => {
  const { settings, setTheme } = useSettingsStore();
  const { layout, setLayout } = useWorkspaceStore();
  return (
    <>
      <h2>Appearance</h2>
      <p className="settings-intro">Make room for the way you play.</p>
      <div className="setting-row">
        <div>
          <h3>Color theme</h3>
          <p>Choose a light page, dark page, or follow your device.</p>
        </div>
        <div className="segmented-control" aria-label="Color theme">
          {(["light", "dark", "system"] as const).map((theme) => (
            <button
              key={theme}
              aria-pressed={settings.theme === theme}
              onClick={() => {
                try {
                  setTheme(theme);
                } catch {
                  toast.error("Couldn't save appearance settings.");
                }
              }}
            >
              {theme[0].toUpperCase() + theme.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="setting-row">
        <div>
          <h3>Results layout</h3>
          <p>
            Read lines side by side or in one continuous list. Small screens always use one column.
          </p>
        </div>
        <div className="segmented-control" aria-label="Default results layout">
          {(["grid", "list"] as const).map((value) => (
            <button key={value} aria-pressed={layout === value} onClick={() => setLayout(value)}>
              {value === "grid" ? "Grid" : "List"}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
