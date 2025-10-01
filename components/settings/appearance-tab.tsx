import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import { Sun, Moon, Monitor } from 'lucide-react';
import type { Settings } from '@/lib/types';

interface AppearanceTabProps {
  theme: Settings['theme'];
  onThemeChange: (theme: Settings['theme']) => void;
}

export const AppearanceTab = ({ theme, onThemeChange }: AppearanceTabProps) => {
  return (
    <TabsContent value="appearance" className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Theme</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => onThemeChange('light')}
              className="w-full"
            >
              <Sun className="h-4 w-4 mr-2" />
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => onThemeChange('dark')}
              className="w-full"
            >
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              onClick={() => onThemeChange('system')}
              className="w-full"
            >
              <Monitor className="h-4 w-4 mr-2" />
              System
            </Button>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};