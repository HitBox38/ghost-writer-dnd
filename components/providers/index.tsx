"use client";

import { useEffect } from "react";
import { useCharacterStore } from "@/stores/character-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
export const Providers = ({ children }: { children: React.ReactNode }) => {
  const loadCharacters = useCharacterStore((state) => state.loadCharacters);
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  const theme = useSettingsStore((state) => state.settings.theme);
  const resultLayout = useSettingsStore((state) => state.settings.resultLayout);
  useEffect(() => {
    useWorkspaceStore.setState({
      layout: resultLayout ?? "grid",
    });
  }, [resultLayout]);
  useEffect(() => {
    loadCharacters();
    loadSettings();
  }, [loadCharacters, loadSettings]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && media.matches);
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.classList.toggle("light", !dark);
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);
  return <>{children}</>;
};
