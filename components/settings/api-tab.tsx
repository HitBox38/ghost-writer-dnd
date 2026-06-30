"use client";

import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { ProviderSection } from "./provider-section";
import { TestResultsDisplay } from "./test-results-display";
import { Key, Loader2 } from "lucide-react";
import type { Settings, AIProvider } from "@/lib/types";

export interface Props {
  settings: Settings;
  isTesting: boolean;
  testResults: Record<string, boolean>;
  onApiKeyChange: (provider: AIProvider, apiKey: string) => void;
  onTestConnection: () => void;
}

const PROVIDER_CONFIG = [
  { provider: "openai" as const, displayName: "OpenAI", placeholder: "sk-..." },
  { provider: "anthropic" as const, displayName: "Anthropic", placeholder: "sk-ant-..." },
  { provider: "google" as const, displayName: "Gemini", placeholder: "AIza..." },
  { provider: "openrouter" as const, displayName: "OpenRouter", placeholder: "sk-or-..." },
];

export const ApiTab = ({
  settings,
  isTesting,
  testResults,
  onApiKeyChange,
  onTestConnection,
}: Props) => {
  return (
    <TabsContent value="api" className="space-y-4">
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <Key className="h-4 w-4" />
          Your API keys never leave your browser and are stored locally
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-6">
        {PROVIDER_CONFIG.map(({ provider, displayName, placeholder }) => (
          <ProviderSection
            key={provider}
            provider={provider}
            displayName={displayName}
            isActive={settings.provider === provider}
            apiKey={settings.apiKeys[provider] || ""}
            placeholder={placeholder}
            onApiKeyChange={(value) => onApiKeyChange(provider, value)}
          />
        ))}
      </Accordion>

      <Separator />

      <div className="space-y-3">
        <Button
          onClick={onTestConnection}
          disabled={isTesting || Object.values(settings.apiKeys).every((key) => !key)}
          className="w-full">
          {isTesting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing Connections...
            </>
          ) : (
            "Test All Connections"
          )}
        </Button>

        <TestResultsDisplay testResults={testResults} />
      </div>
    </TabsContent>
  );
};
