import { CheckCircle2, XCircle } from 'lucide-react';

interface TestResultsDisplayProps {
  testResults: Record<string, boolean>;
}

export const TestResultsDisplay = ({ testResults }: TestResultsDisplayProps) => {
  if (Object.keys(testResults).length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {Object.entries(testResults).map(([provider, success]) => (
        <div
          key={provider}
          className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
        >
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
  );
};