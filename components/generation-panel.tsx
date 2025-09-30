"use client"

import React, { useState } from 'react';
import { useCharacterStore } from '@/stores/character-store';
import { useSettingsStore } from '@/stores/settings-store';
import { AIGenerator } from '@/lib/ai-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, Heart, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { GenerationRequest } from '@/lib/types';

export const GenerationPanel: React.FC = () => {
  const { getActiveProfile, addFavorite } = useCharacterStore();
  const { settings, isApiKeySet } = useSettingsStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTexts, setGeneratedTexts] = useState<string[]>([]);
  const [context, setContext] = useState('');
  const [spellName, setSpellName] = useState('');
  const [generationType, setGenerationType] = useState<'mockery' | 'catchphrase'>('mockery');

  const activeProfile = getActiveProfile();

  const handleGenerate = async () => {
    if (!activeProfile) {
      toast.error('Please select or create a character first');
      return;
    }

    if (!isApiKeySet()) {
      toast.error('Please set your API key in settings');
      return;
    }

    setIsGenerating(true);
    try {
      const generator = new AIGenerator(settings);
      const request: GenerationRequest = {
        type: generationType,
        context,
        spellName: generationType === 'mockery' ? spellName : undefined,
      };

      const results = await generator.generate(activeProfile, request);
      setGeneratedTexts(results);
      toast.success('Generated new flavor text!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate text');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToFavorites = (text: string) => {
    if (!activeProfile) return;
    
    addFavorite(activeProfile.id, {
      text,
      type: generationType,
      context,
    });
    toast.success('Added to favorites!');
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter' && !isGenerating) {
      handleGenerate();
    }
  };

  if (!activeProfile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No character selected. Please create or select a character to start generating flavor text.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Generate Flavor Text
        </CardTitle>
        <CardDescription>
          Create AI-powered quips and catchphrases for {activeProfile.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={generationType} onValueChange={(v) => setGenerationType(v as 'mockery' | 'catchphrase')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mockery">Vicious Mockery</TabsTrigger>
            <TabsTrigger value="catchphrase">Catchphrases</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mockery" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="spellName">Spell Name (Optional)</Label>
              <Input
                id="spellName"
                value={spellName}
                onChange={(e) => setSpellName(e.target.value)}
                placeholder="e.g., Vicious Mockery, Fireball"
                onKeyDown={handleKeyDown}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="catchphrase" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate signature phrases that define your character's personality.
            </p>
          </TabsContent>
        </Tabs>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="context">Additional Context (Optional)</Label>
            <Textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Add any specific context for this generation..."
              rows={3}
              onKeyDown={handleKeyDown}
            />
            <p className="text-xs text-muted-foreground">
              Press Ctrl+Enter to generate
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !isApiKeySet()}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
            
            {generatedTexts.length > 0 && (
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                variant="outline"
                size="icon"
                title="Regenerate"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {generatedTexts.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Generated Results</h3>
              <Badge variant="secondary">{generatedTexts.length} results</Badge>
            </div>
            
            {generatedTexts.map((text, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm flex-1">{text}</p>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleAddToFavorites(text)}
                      title="Add to favorites"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleCopyToClipboard(text)}
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};