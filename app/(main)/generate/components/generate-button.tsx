import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  isGenerating: boolean;
  hasApiKey: boolean;
  onClick: () => void;
}

export const GenerateButton = ({ isGenerating, hasApiKey, onClick }: GenerateButtonProps) => {
  return (
    <>
      <Button
        onClick={onClick}
        disabled={isGenerating || !hasApiKey}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate
          </>
        )}
      </Button>

      {!hasApiKey && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <p className="text-sm text-yellow-600 dark:text-yellow-500">
            Please configure your API key in settings
          </p>
        </div>
      )}
    </>
  );
};