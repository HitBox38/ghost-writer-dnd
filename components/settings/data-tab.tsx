import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { Download, Upload, Trash2 } from 'lucide-react';

interface DataTabProps {
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearAll: () => void;
}

export const DataTab = ({ onExport, onImport, onClearAll }: DataTabProps) => {
  return (
    <TabsContent value="data" className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Export Data</Label>
          <Button onClick={onExport} variant="outline" className="w-full justify-start">
            <Download className="h-4 w-4 mr-2" />
            Download Backup JSON
          </Button>
          <p className="text-xs text-muted-foreground">
            Export all characters and favorites (API keys excluded for security)
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
              onChange={onImport}
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
          <Button onClick={onClearAll} variant="destructive" className="w-full justify-start">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
          <p className="text-xs text-muted-foreground">
            Permanently delete all characters, favorites, and settings
          </p>
        </div>
      </div>
    </TabsContent>
  );
};