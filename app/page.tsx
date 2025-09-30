"use client";
import { ProfileSelector } from "@/components/profile-selector";
import { CharacterProfileForm } from "@/components/character-profile-form";
import { GenerationPanel } from "@/components/generation-panel";
import { FavoritesList } from "@/components/favorites-list";
import { SettingsDialog } from "@/components/settings-dialog";
import { Separator } from "@/components/ui/separator";
import { DataControls } from "@/components/data-controls";

export default function Home() {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <ProfileSelector />
        </div>
        <SettingsDialog />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CharacterProfileForm />
        <GenerationPanel />
      </div>
      <div className="flex items-center justify-between">
        <Separator />
        <DataControls />
      </div>
      <FavoritesList />
    </div>
  );
}
