"use client";

import { useProviderConnection } from "@/components/settings/settings-screen/hooks/use-provider-connection";
import { Eye, EyeOff, Check, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
export const ProviderFields = ({ state }: { state: ReturnType<typeof useProviderConnection> }) => {
  const {
    provider,
    visible,
    draft,
    setDraft,
    setVisible,
    save,
    dirty,
    test,
    testing,
    savedKey,
    active,
    setProvider,
    setError,
    error,
  } = state;
  return (
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
  );
};
