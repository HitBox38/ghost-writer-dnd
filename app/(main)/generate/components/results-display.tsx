'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ActionButtons } from '@/components/shared/action-buttons';
import type { GenerationResult } from '@/lib/types';
import { Sparkles } from 'lucide-react';

interface ResultsDisplayProps {
  results: GenerationResult[];
  favorites: Set<string>;
  onToggleFavorite: (result: GenerationResult) => void;
  onCopy: (text: string) => void;
}

export const ResultsDisplay = ({
  results,
  favorites,
  onToggleFavorite,
  onCopy,
}: ResultsDisplayProps) => {
  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No Results Yet</p>
            <p className="text-sm text-muted-foreground">
              Configure your settings and click Generate to create flavor text
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Results</h3>
            <span className="text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </span>
          </div>
          <ScrollArea className="h-[calc(100vh-20rem)] w-full rounded-md">
            <div className="space-y-2 pr-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="group flex items-start gap-2 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <p className="flex-1 text-sm leading-relaxed">{result.text}</p>
                  <ActionButtons
                    isFavorited={favorites.has(result.id)}
                    onToggleFavorite={() => onToggleFavorite(result)}
                    onCopy={() => onCopy(result.text)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};