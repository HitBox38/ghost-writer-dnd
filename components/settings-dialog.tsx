"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettingsStore } from "@/stores/settings-store";
import { testConnection } from "@/lib/ai-generator";
import { MODEL_OPTIONS } from "@/lib/types";
import type { AIProvider } from "@/lib/types";
import {
  Settings,
  Key,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";

export const SettingsDialog = () => {
  const { settings, updateSettings, setProvider, setTheme, exportData, importData, clearAllData } =
    useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  const handleTestConnection = async () => {
    // Find all providers with API keys
    const providersToTest = (Object.entries(settings.apiKeys) as [AIProvider, string][])
      .filter(([, key]) => key && key.length > 0);

    if (providersToTest.length === 0) {
      toast.error("Please enter at least one API key");
      return;
    }

    setIsTesting(true);
    setTestResults({});

    const results: Record<string, boolean> = {};
    
    // Test each provider with an API key
    for (const [provider, apiKey] of providersToTest) {
      try {
        const model = MODEL_OPTIONS[provider][0].value;
        const result = await testConnection(provider, model, apiKey);
        results[provider] = result;
      } catch (error) {
        console.error(`Test connection error for ${provider}:`, error);
        results[provider] = false;
      }
    }

    setTestResults(results);
    setIsTesting(false);

    // Show summary toast
    const successCount = Object.values(results).filter(r => r).length;
    const totalCount = Object.keys(results).length;
    
    if (successCount === totalCount) {
      toast.success(`All ${totalCount} provider(s) connected successfully!`);
    } else if (successCount > 0) {
      toast.warning(`${successCount}/${totalCount} provider(s) connected successfully`);
    } else {
      toast.error("All connection tests failed. Please check your API keys.");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importData(file);
      toast.success("Data imported successfully");
      setIsOpen(false);
    } catch (error) {
      console.error("Import error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to import data");
    }

    // Reset input
    e.target.value = "";
  };

  const handleClearAll = () => {
    if (
      confirm(
        "Are you sure you want to clear ALL data? This will delete all characters, favorites, and settings. This cannot be undone."
      )
    ) {
      clearAllData();
      toast.success("All data cleared");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your AI provider, manage your data, and customize your experience
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <Key className="h-4 w-4" />
                Your API keys never leave your browser and are stored locally
              </p>
            </div>

            <div className="space-y-6">
              {/* OpenAI Section */}
              <div className="space-y-3 p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">OpenAI</h3>
                  {settings.provider === "openai" && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Active
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="openai-key">API Key</Label>
                  <Input
                    id="openai-key"
                    type="password"
                    value={settings.apiKeys.openai || ""}
                    onChange={(e) => {
                      const apiKeys = { ...settings.apiKeys, openai: e.target.value };
                      updateSettings({
                        apiKeys,
                        ...(settings.provider === "openai" && { apiKey: e.target.value }),
                      });
                      if (e.target.value && settings.provider !== "openai") {
                        setProvider("openai");
                      }
                    }}
                    placeholder="sk-..."
                  />
                </div>
              </div>

              {/* Anthropic Section */}
              <div className="space-y-3 p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Anthropic</h3>
                  {settings.provider === "anthropic" && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Active
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anthropic-key">API Key</Label>
                  <Input
                    id="anthropic-key"
                    type="password"
                    value={settings.apiKeys.anthropic || ""}
                    onChange={(e) => {
                      const apiKeys = { ...settings.apiKeys, anthropic: e.target.value };
                      updateSettings({
                        apiKeys,
                        ...(settings.provider === "anthropic" && { apiKey: e.target.value }),
                      });
                      if (e.target.value && settings.provider !== "anthropic") {
                        setProvider("anthropic");
                      }
                    }}
                    placeholder="sk-ant-..."
                  />
                </div>
              </div>

              {/* Google AI Section */}
              <div className="space-y-3 p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Google AI</h3>
                  {settings.provider === "google" && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Active
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="google-key">API Key</Label>
                  <Input
                    id="google-key"
                    type="password"
                    value={settings.apiKeys.google || ""}
                    onChange={(e) => {
                      const apiKeys = { ...settings.apiKeys, google: e.target.value };
                      updateSettings({
                        apiKeys,
                        ...(settings.provider === "google" && { apiKey: e.target.value }),
                      });
                      if (e.target.value && settings.provider !== "google") {
                        setProvider("google");
                      }
                    }}
                    placeholder="AIza..."
                  />
                </div>
              </div>

              <Separator />

              {/* Test Connection */}
              <div className="space-y-3">
                <Button
                  onClick={handleTestConnection}
                  disabled={isTesting || Object.values(settings.apiKeys).every(key => !key)}
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
                
                {/* Show individual test results */}
                {Object.keys(testResults).length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(testResults).map(([provider, success]) => (
                      <div key={provider} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <span className="text-sm font-medium capitalize">{provider}</span>
                        <div className="flex items-center gap-2">
                          {success ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className="text-xs text-green-600 dark:text-green-400">Connected</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-500" />
                              <span className="text-xs text-red-600 dark:text-red-400">Failed</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={settings.theme === "light" ? "default" : "outline"}
                    onClick={() => setTheme("light")}
                    className="w-full">
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={settings.theme === "dark" ? "default" : "outline"}
                    onClick={() => setTheme("dark")}
                    className="w-full">
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                  <Button
                    variant={settings.theme === "system" ? "default" : "outline"}
                    onClick={() => setTheme("system")}
                    className="w-full">
                    <Monitor className="h-4 w-4 mr-2" />
                    System
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Export Data</Label>
                <Button onClick={exportData} variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Backup JSON
                </Button>
                <p className="text-xs text-muted-foreground">
                  Export all characters and favorites (API key excluded for security)
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="import-file">Import Data</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="import-file"
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="flex-1"
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Import characters and favorites from a backup file
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Clear All Data</Label>
                <Button
                  onClick={handleClearAll}
                  variant="destructive"
                  className="w-full justify-start">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
                <p className="text-xs text-muted-foreground">
                  Permanently delete all characters, favorites, and settings
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
