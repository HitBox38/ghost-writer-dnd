'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettingsStore } from '@/stores/settings-store';
import { testConnection } from '@/lib/ai-generator';
import { MODEL_OPTIONS } from '@/lib/types';
import type { AIProvider } from '@/lib/types';
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
} from 'lucide-react';
import { toast } from 'sonner';

export const SettingsDialog = () => {
  const { settings, updateSettings, setProvider, setTheme, exportData, importData, clearAllData } =
    useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);

  const handleProviderChange = (provider: AIProvider) => {
    setProvider(provider);
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    if (!settings.apiKey) {
      toast.error('Please enter an API key first');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testConnection(settings.provider, settings.model, settings.apiKey);
      setTestResult(result);
      if (result) {
        toast.success('Connection successful!');
      } else {
        toast.error('Connection failed. Please check your API key.');
      }
    } catch (error) {
      console.error('Test connection error:', error);
      setTestResult(false);
      toast.error('Connection failed. Please check your API key.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importData(file);
      toast.success('Data imported successfully');
      setIsOpen(false);
    } catch (error) {
      console.error('Import error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to import data');
    }

    // Reset input
    e.target.value = '';
  };

  const handleClearAll = () => {
    if (
      confirm(
        'Are you sure you want to clear ALL data? This will delete all characters, favorites, and settings. This cannot be undone.'
      )
    ) {
      clearAllData();
      toast.success('All data cleared');
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
                Your API key never leaves your browser and is stored locally
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">AI Provider</Label>
                <Select
                  value={settings.provider}
                  onValueChange={(v) => handleProviderChange(v as AIProvider)}
                >
                  <SelectTrigger id="provider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="google">Google AI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => updateSettings({ apiKey: e.target.value })}
                  placeholder="sk-..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select
                  value={settings.model}
                  onValueChange={(v) => updateSettings({ model: v })}
                >
                  <SelectTrigger id="model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODEL_OPTIONS[settings.provider].map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">
                  Temperature: {settings.temperature.toFixed(2)}
                </Label>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.05}
                  value={[settings.temperature]}
                  onValueChange={([v]) => updateSettings({ temperature: v })}
                />
                <p className="text-xs text-muted-foreground">
                  Lower = more focused, Higher = more creative
                </p>
              </div>

              <Separator />

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleTestConnection}
                  disabled={isTesting || !settings.apiKey}
                  className="flex-1"
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </Button>
                {testResult !== null && (
                  <div className="flex items-center">
                    {testResult ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
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
                    variant={settings.theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                    className="w-full"
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={settings.theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                    className="w-full"
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                  <Button
                    variant={settings.theme === 'system' ? 'default' : 'outline'}
                    onClick={() => setTheme('system')}
                    className="w-full"
                  >
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
                  className="w-full justify-start"
                >
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