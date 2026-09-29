"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  Cable,
  Palette,
  Database,
  Eye,
  EyeOff,
  Check,
  Download,
  Upload,
  LoaderCircle,
} from "lucide-react";
import { FolioSelect } from "@/components/folio-select";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useSettingsStore } from "@/stores/settings-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { useCharacterStore } from "@/stores/character-store";
import { testProviderAction } from "@/app/(main)/settings/actions";
import { AI_PROVIDERS } from "@/lib/types";
import { toast } from "sonner";
const SECTIONS = [
  { id: "connections", name: "AI connections", Icon: Cable },
  { id: "appearance", name: "Appearance", Icon: Palette },
  { id: "data", name: "Data & backups", Icon: Database },
] as const;
function ProviderConnection({ provider }: { provider: (typeof AI_PROVIDERS)[number] }) {
  const { settings, updateSettings, setProvider } = useSettingsStore();
  const savedKey = settings.apiKeys[provider.id] || "";
  const [draft, setDraft] = useState(savedKey);
  const [visible, setVisible] = useState(false);
  const [testing, setTesting] = useState(false);
  const [verifiedKey, setVerifiedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const active = settings.provider === provider.id;
  const dirty = draft.trim() !== savedKey;
  function save() {
    try {
      const key = draft.trim();
      updateSettings({
        apiKeys: { ...settings.apiKeys, [provider.id]: key },
        ...(active ? { apiKey: key } : {}),
      });
      setDraft(key);
      setError(null);
      setVerifiedKey(null);
      toast.success(key ? `${provider.name} key saved` : `${provider.name} key removed`);
    } catch {
      setError("Couldn't save the key. Check that browser storage is available.");
    }
  }
  async function test() {
    setTesting(true);
    setError(null);
    try {
      const success = await testProviderAction(provider.id, savedKey);
      if (success) {
        setVerifiedKey(savedKey);
        toast.success(`${provider.name} connection verified`);
      } else {
        setVerifiedKey(null);
        const message =
          "Connection failed. Check the key, provider access, and available credits, then try again.";
        setError(message);
        toast.error(message);
      }
    } catch {
      const message = "Couldn't reach the provider. Try again in a moment.";
      setError(message);
      toast.error(message);
    }
    setTesting(false);
  }
  return (
    <details className="provider-row" open={active || undefined}>
      <summary>
        <strong className="provider-name">{provider.name}</strong>
        <span>
          {active ? "In use · " : ""}
          {savedKey ? (
            verifiedKey === savedKey ? (
              <span className="verified-status">
                <Check className="verified-mark" size={14} aria-hidden="true" />
                Connection verified
              </span>
            ) : (
              "Key saved"
            )
          ) : (
            "Not configured"
          )}
        </span>
      </summary>
      <div className="provider-fields">
        <div className="field">
          <label htmlFor={`key-${provider.id}`}>{provider.name} API key</label>
          <div className="key-input">
            <input
              id={`key-${provider.id}`}
              type={visible ? "text" : "password"}
              autoComplete="off"
              spellCheck={false}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Paste your API key"
            />
            <Button
              variant="outline"
              aria-label={visible ? `Hide ${provider.name} key` : `Show ${provider.name} key`}
              onClick={() => setVisible(!visible)}
            >
              {visible ? <EyeOff size={17} /> : <Eye size={17} />}
            </Button>
          </div>
          <p className="field-help">
            <a href={provider.url} target="_blank" rel="noreferrer" className="underline">
              Get a {provider.name} key
            </a>
            . Saving a key does not switch your active provider.
          </p>
        </div>
        <div className="provider-actions">
          <Button onClick={save} disabled={!dirty}>
            Save key
          </Button>
          <Button
            variant="outline"
            onClick={() => void test()}
            disabled={testing || !savedKey || dirty}
          >
            {testing && <LoaderCircle className="loading-icon" size={16} />}
            {testing ? "Testing…" : "Test connection"}
          </Button>
          <Button
            variant="ghost"
            disabled={active || !savedKey || dirty}
            onClick={() => {
              try {
                setProvider(provider.id);
              } catch {
                setError("Couldn't switch providers. Check browser storage.");
              }
            }}
          >
            {active ? (
              <>
                <Check size={16} />
                In use
              </>
            ) : (
              "Use this provider"
            )}
          </Button>
        </div>
        {dirty && (
          <p className="status-note">
            Unsaved key changes. Save before testing or switching providers.
          </p>
        )}
        {error && (
          <p className="inline-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </details>
  );
}
function AppearanceSettings() {
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
}
function DataSettings() {
  const { exportData, importData, clearAllData } = useSettingsStore();
  const characters = useCharacterStore((state) => state.characters);
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [clearing, setClearing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function applyImport() {
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
  }
  async function clear() {
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
  }
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
      <div className="setting-row">
        <div>
          <h3>Restore a backup</h3>
          <p>
            Import a JSON backup. This replaces your current characters and saved lines; your
            provider keys stay on this device.
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
}
export function SettingsScreen({ section }: { section: "connections" | "appearance" | "data" }) {
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
            options={SECTIONS.map(({ id, name }) => ({ value: id, label: name }))}
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
}
