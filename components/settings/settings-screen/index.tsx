"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FolioSelect } from "@/components/folio-select";
import { useCharacterStore } from "@/stores/character-store";
import { AI_PROVIDERS } from "@/lib/types";
import { SECTIONS } from "@/components/settings/settings-screen/constants";
import { ProviderConnection } from "@/components/settings/settings-screen/components/provider-connection";
import { AppearanceSettings } from "@/components/settings/settings-screen/components/appearance-settings";
import { DataSettings } from "@/components/settings/settings-screen/components/data-settings";
export const SettingsScreen = ({ section }: { section: "connections" | "appearance" | "data" }) => {
  const router = useRouter();
  const initialized = useCharacterStore((state) => state.initialized);
  return (
    <div className="settings-page">
      <Link className="text-action back-link" href="/generate">
        <ArrowLeft size={16} />
        Back to workspace
      </Link>
      <div className="page-heading">
        <div>
          <h1>Settings</h1>
          <p>Your tools, your table.</p>
        </div>
      </div>
      <div className="settings-layout">
        <nav className="settings-nav" aria-label="Settings sections">
          {SECTIONS.map(({ id, name, Icon }) => (
            <Link
              href={`/settings/${id}`}
              key={id}
              aria-current={section === id ? "page" : undefined}
            >
              <Icon size={17} />
              {name}
            </Link>
          ))}
        </nav>
        <div className="settings-mobile-nav">
          <label htmlFor="settings-section">Settings section</label>
          <FolioSelect
            id="settings-section"
            label="Settings section"
            value={section}
            onValueChange={(value) => router.push(`/settings/${value}`)}
            options={SECTIONS.map(({ id, name }) => ({
              value: id,
              label: name,
            }))}
          />
        </div>
        <section className="settings-content">
          {!initialized ? (
            <p role="status">Loading settings…</p>
          ) : section === "connections" ? (
            <>
              <h2>AI connections</h2>
              <p className="settings-intro">
                Connect the provider you want to write with. Keys are stored in this browser and
                sent through the app server to your chosen provider when generating or testing.
                Connection tests use a small provider request.
              </p>
              {AI_PROVIDERS.map((provider) => (
                <ProviderConnection key={provider.id} provider={provider} />
              ))}
            </>
          ) : section === "appearance" ? (
            <AppearanceSettings />
          ) : (
            <DataSettings />
          )}
        </section>
      </div>
    </div>
  );
};
