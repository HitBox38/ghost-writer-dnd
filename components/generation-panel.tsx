'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCharacterStore } from '@/stores/character-store';
import { useSettingsStore } from '@/stores/settings-store';
import { generateFlavorText } from '@/lib/ai-generator';
import type { GenerationType, GenerationResult } from '@/lib/types';
import { Sparkles, RefreshCw, Heart, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const GenerationPanel = () => {
  const { getActiveCharacter, addFavorite } = useCharacterStore();
  const { settings, isConfigured } = useSettingsStore();
  const activeCharacter = getActiveCharacter();

  const [generationType, setGenerationType] = useState<GenerationType>('mockery');
  const [context, setContext] = useState('');
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleGenerate = async () => {
    if (!activeCharacter) {
      toast.error('Please select or create a character first');
      return;
    }

    if (!isConfigured()) {
      toast.error('Please configure your API key in settings');
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await generateFlavorText(
        activeCharacter,
        generationType,
        settings.provider,
        settings.model,
        settings.apiKey,
        settings.temperature,
        context
      );

      setResults(generated);
      setFavorites(new Set()); // Reset favorites for new generation
      toast.success(`Generated ${generated.length} ${generationType === 'mockery' ? 'combat quips' : 'catchphrases'}`);
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate text');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleFavorite = (result: GenerationResult) => {
    if (!activeCharacter) return;

    if (favorites.has(result.id)) {
      // Remove from favorites (not implemented in this component)
      setFavorites((prev) => {
        const next = new Set(prev);
        next.delete(result.id);
        return next;
      });
    } else {
      // Add to favorites
      addFavorite(activeCharacter.id, result.text, generationType, context);
      setFavorites((prev) => new Set(prev).add(result.id));
      toast.success('Added to favorites');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleGenerate();
    }
  };

  if (!activeCharacter) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">No Character Selected</p>
          <p className="text-sm text-muted-foreground text-center">
            Create or select a character to start generating flavor text
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Flavor Text</CardTitle>
        <CardDescription>
          Generate AI-powered combat quips and catchphrases for {activeCharacter.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={generationType} onValueChange={(v) => setGenerationType(v as GenerationType)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mockery">Combat Quips</TabsTrigger>
            <TabsTrigger value="catchphrase">Catchphrases</TabsTrigger>
          </TabsList>

          <TabsContent value="mockery" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="context-mockery">
                Additional Context (Optional)
              </Label>
              <Textarea
                id="context-mockery"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., 'against a pompous noble' or 'targeting their armor'"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Press Ctrl+Enter to generate
              </p>
            </div>
          </TabsContent>

          <TabsContent value="catchphrase" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="context-catchphrase">
                Additional Context (Optional)
              </Label>
              <Textarea
                id="context-catchphrase"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., 'when entering combat' or 'when celebrating victory'"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Press Ctrl+Enter to generate
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !isConfigured()}
            className="flex-1"
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
          {results.length > 0 && (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
          )}
        </div>

        {!isConfigured() && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <p className="text-sm text-yellow-600 dark:text-yellow-500">
              Please configure your API key in settings to start generating
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Generated Results</Label>
              <Badge variant="secondary">{results.length} results</Badge>
            </div>
            <div className="space-y-2">
              {results.map((result) => (
                <Card key={result.id} className="group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <p className="flex-1 text-sm">{result.text}</p>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => handleToggleFavorite(result)}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              favorites.has(result.id)
                                ? 'fill-red-500 text-red-500'
                                : ''
                            }`}
                          />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => handleCopy(result.text)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};