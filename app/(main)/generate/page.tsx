'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useCharacterStore } from '@/stores/character-store';
import { useSettingsStore } from '@/stores/settings-store';
import { generateFlavorText } from '@/lib/ai-generator';
import { MODEL_OPTIONS } from '@/lib/types';
import type { GenerationType, GenerationResult, AIProvider } from '@/lib/types';
import { Sparkles, Loader2, Heart, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function GeneratePage() {
  const { getActiveCharacter, addFavorite } = useCharacterStore();
  const { settings, updateSettings } = useSettingsStore();
  const activeCharacter = getActiveCharacter();

  const [generationType, setGenerationType] = useState<GenerationType>('mockery');
  const [context, setContext] = useState('');
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [resultCount, setResultCount] = useState(5);

  const handleGenerate = async () => {
    if (!activeCharacter) {
      toast.error('Please select or create a character first');
      return;
    }

    if (!settings.apiKey) {
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
        context,
        resultCount
      );

      setResults(generated);
      setFavorites(new Set());
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
      setFavorites((prev) => {
        const next = new Set(prev);
        next.delete(result.id);
        return next;
      });
    } else {
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
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left Side - Inputs */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Generation Type</Label>
              <Tabs value={generationType} onValueChange={(v) => setGenerationType(v as GenerationType)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="mockery">Combat Quips</TabsTrigger>
                  <TabsTrigger value="catchphrase">Catchphrases</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">AI Provider</Label>
              <Select
                value={settings.provider}
                onValueChange={(v) => updateSettings({ provider: v as AIProvider, model: MODEL_OPTIONS[v as AIProvider][0].value })}
              >
                <SelectTrigger id="provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="google">Google AI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select
                value={settings.model}
                onValueChange={(v) => updateSettings({ model: v })}
              >
                <SelectTrigger id="model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODEL_OPTIONS[settings.provider].map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">
                Temperature: {settings.temperature.toFixed(2)}
              </Label>
              <Slider
                id="temperature"
                min={0}
                max={1}
                step={0.05}
                value={[settings.temperature]}
                onValueChange={([v]) => updateSettings({ temperature: v })}
              />
              <p className="text-xs text-muted-foreground">
                Lower = more focused, Higher = more creative
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resultCount">
                Number of Results: {resultCount}
              </Label>
              <Slider
                id="resultCount"
                min={1}
                max={25}
                step={1}
                value={[resultCount]}
                onValueChange={([v]) => setResultCount(v)}
              />
              <p className="text-xs text-muted-foreground">
                Generate between 1-25 results
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">
                Additional Context (Optional)
              </Label>
              <Textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  generationType === 'mockery'
                    ? "e.g., 'against a pompous noble' or 'targeting their armor'"
                    : "e.g., 'when entering combat' or 'when celebrating victory'"
                }
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Press Ctrl+Enter to generate
              </p>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !settings.apiKey}
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

            {!settings.apiKey && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-sm text-yellow-600 dark:text-yellow-500">
                  Please configure your API key in settings
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Results */}
      <div className="lg:col-span-3">
        <Card>
          <CardContent className="pt-6">
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No Results Yet</p>
                <p className="text-sm text-muted-foreground">
                  Configure your settings and click Generate to create flavor text
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Generated Results</h3>
                  <span className="text-sm text-muted-foreground">
                    {results.length} {results.length === 1 ? 'result' : 'results'}
                  </span>
                </div>
                <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="group flex items-start gap-2 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <p className="flex-1 text-sm leading-relaxed">{result.text}</p>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 shrink-0"
                          onClick={() => handleToggleFavorite(result)}
                        >
                          <Heart
                            className={`h-3.5 w-3.5 ${
                              favorites.has(result.id)
                                ? 'fill-red-500 text-red-500'
                                : ''
                            }`}
                          />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 shrink-0"
                          onClick={() => handleCopy(result.text)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}