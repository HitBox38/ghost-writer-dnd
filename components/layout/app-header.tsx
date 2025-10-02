import { SettingsDialog as SettingsDialog } from "@/components/settings-dialog";
import { Sparkles } from "lucide-react";

export const AppHeader = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">D&D Flavor Text Generator</h1>
          </div>
          <SettingsDialog />
        </div>
      </div>
    </header>
  );
};
