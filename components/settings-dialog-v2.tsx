'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApiTab } from './settings/api-tab';
import { AppearanceTab } from './settings/appearance-tab';
import { DataTab } from './settings/data-tab';
import { useSettingsDialog } from './settings/hooks/use-settings-dialog';
import { Settings } from 'lucide-react';

export const SettingsDialogV2 = () => {
  const {
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
  } = useSettingsDialog();

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

          <ApiTab
            settings={settings}
            isTesting={isTesting}
            testResults={testResults}
            onApiKeyChange={handleApiKeyChange}
            onTestConnection={handleTestConnection}
          />

          <AppearanceTab theme={settings.theme} onThemeChange={setTheme} />

          <DataTab
            onExport={exportData}
            onImport={handleImport}
            onClearAll={handleClearAll}
          />
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};