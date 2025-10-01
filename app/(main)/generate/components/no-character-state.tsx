import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export const NoCharacterState = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">No Character Selected</p>
          <p className="text-sm text-muted-foreground text-center">
            Create or select a character to start generating flavor text
          </p>
        </CardContent>
      </Card>
    </div>
  );
};