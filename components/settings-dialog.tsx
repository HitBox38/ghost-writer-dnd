"use client"

import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '@/stores/settings-store';
import { useCharacterStore } from '@/stores/character-store';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Download, Upload, Trash2, Shield, TestTube, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Settings as SettingsType } from '@/lib/types';

const MODEL_OPTIONS = {
  openai: [
    { value: 'gpt-4-turbo-preview', label: 'GPT-4 Turbo' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  ],
  anthropic: [
    { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
  ],
  google: [
    { value: 'gemini-pro', label: 'Gemini Pro' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
  ],
  groq: [
    { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
    { value: 'llama2-70b-4096', label: 'Llama 2 70B' },
  ],
  cohere: [
    { value: 'command', label: 'Command' },
    { value: 'command-light', label: 'Command Light' },
  ],
};

export const SettingsDialog: React.FC = () => {
  const { settings, updateSettings, exportData, importData, clearApiKey } = useSettingsStore();
  const { clearAllData } = useCharacterStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempSettings, setTempSettings] = useState<SettingsType>(settings);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(tempSettings);
    toast.success('Settings saved');
    setIsOpen(false);
  };

  const handleTestConnection = async () => {
    if (!tempSettings.apiKey) {
      toast.error('Please enter an API key first');
      return;
    }

    // Simple validation for API key format
    const keyPatterns = {
      openai: /^sk-[A-Za-z0-9]{48,}$/,
      anthropic: /^sk-ant-[A-Za-z0-9-]{40,}$/,
      google: /^[A-Za-z0-9_-]{39}$/,
      groq: /^gsk_[A-Za-z0-9]{50,}$/,
      cohere: /^[A-Za-z0-9]{40}$/,
    };

    const pattern = keyPatterns[tempSettings.provider];
    if (pattern && !pattern.test(tempSettings.apiKey)) {
      toast.warning('API key format may be incorrect for ' + tempSettings.provider);
    } else {
      toast.success('API key format looks valid!');
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dnd-flavor-text-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        importData(data);
        toast.success('Data imported successfully');
        setIsOpen(false);
      } catch (error) {
        toast.error('Failed to import data. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      clearAllData();
      clearApiKey();
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your AI provider and manage your data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Your API key never leaves your browser
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">AI Provider</Label>
                <Select
                  value={tempSettings.provider}
                  onValueChange={(value: any) => {
                    const models = MODEL_OPTIONS[value as keyof typeof MODEL_OPTIONS];
                    setTempSettings(prev => ({
                      ...prev,
                      provider: value,
                      model: models[0].value,
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="groq">Groq</SelectItem>
                    <SelectItem value="cohere">Cohere</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="apiKey"
                      type={showApiKey ? 'text' : 'password'}
                      value={tempSettings.apiKey}
                      onChange={(e) => setTempSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="Enter your API key..."
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestConnection}
                  >
                    <TestTube className="mr-2 h-4 w-4" />
                    Test
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select
                  value={tempSettings.model}
                  onValueChange={(value) => setTempSettings(prev => ({ ...prev, model: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODEL_OPTIONS[tempSettings.provider]?.map(model => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="temperature">Temperature</Label>
                  <span className="text-sm text-muted-foreground">
                    {tempSettings.temperature.toFixed(1)}
                  </span>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[tempSettings.temperature]}
                  onValueChange={(value) => setTempSettings(prev => ({ ...prev, temperature: value[0] }))}
                />
                <p className="text-xs text-muted-foreground">
                  Higher values make output more creative, lower values more focused
                </p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data Management</CardTitle>
              <CardDescription>
                Export, import, or clear your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleExport}
              >
                <Download className="mr-2 h-4 w-4" />
                Export All Data
              </Button>

              <div className="relative">
                <Input
                  type="file"
                  accept="application/json"
                  onChange={handleImport}
                  className="hidden"
                  id="import-file"
                />
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => document.getElementById('import-file')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                </Button>
              </div>

              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleClearAllData}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Data
              </Button>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};