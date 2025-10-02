import { useState } from 'react';
import { useSettingsStore } from '@/stores/settings-store';
import { testConnection } from '@/lib/ai-generator';
import { MODEL_OPTIONS } from '@/lib/types';
import type { AIProvider } from '@/lib/types';
import { toast } from 'sonner';

export const useSettingsDialog = () => {
  const { settings, updateSettings, setProvider, setTheme, exportData, importData, clearAllData } =
    useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  const handleApiKeyChange = (provider: AIProvider, apiKey: string) => {
    const apiKeys = { ...settings.apiKeys, [provider]: apiKey };
    updateSettings({
      apiKeys,
      ...(settings.provider === provider && { apiKey }),
    });
    if (apiKey && settings.provider !== provider) {
      setProvider(provider);
    }
  };

  const handleTestConnection = async () => {
    const providersToTest = (Object.entries(settings.apiKeys) as [AIProvider, string][]).filter(
      ([, key]) => key && key.length > 0
    );

    if (providersToTest.length === 0) {
      toast.error('Please enter at least one API key');
      return;
    }

    setIsTesting(true);
    setTestResults({});

    const results: Record<string, boolean> = {};

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

    const successCount = Object.values(results).filter((r) => r).length;
    const totalCount = Object.keys(results).length;

    if (successCount === totalCount) {
      toast.success(`All ${totalCount} provider(s) connected successfully!`);
    } else if (successCount > 0) {
      toast.warning(`${successCount}/${totalCount} provider(s) connected successfully`);
    } else {
      toast.error('All connection tests failed. Please check your API keys.');
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

  return {
    isOpen,
    setIsOpen,
    isTesting,
    testResults,
    settings,
    handleApiKeyChange,
    handleTestConnection,
    handleImport,
    handleClearAll,
    setTheme,
    exportData,
  };
};