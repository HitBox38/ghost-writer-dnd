"use client"
import * as React from 'react'
import { Loader2, RefreshCcw, Sparkles, Heart, Copy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useCharacterStore } from '@/stores/character-store'
import { useSettingsStore } from '@/stores/settings-store'
import { generateFlavorText } from '@/lib/ai-generator'
import { toast } from '@/components/ui/use-toast'

export const GenerationPanel = () => {
  const { profiles, activeProfileId, addFavorite } = useCharacterStore()
  const settings = useSettingsStore()
  const profile = profiles.find((p) => p.id === activeProfileId)

  const [mode, setMode] = React.useState<'mockery' | 'catchphrase'>('mockery')
  const [context, setContext] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [results, setResults] = React.useState<string[]>([])

  const handleGenerate = async () => {
    if (!profile) {
      toast({ title: 'No character selected', variant: 'destructive' })
      return
    }
    if (!settings.apiKey) {
      toast({ title: 'Missing API key', description: 'Add your key in Settings', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const { lines } = await generateFlavorText({
        character: profile,
        type: mode,
        extraContext: context,
        count: 4,
        settings,
      })
      setResults(lines)
    } catch (err: any) {
      toast({ title: 'Generation failed', description: err?.message ?? 'Unknown error', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({ title: 'Copied to clipboard' })
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' })
    }
  }

  const handleFavorite = (text: string) => {
    if (!profile) return
    addFavorite(profile.id, text, mode)
    toast({ title: 'Saved to favorites' })
  }

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'enter') {
        e.preventDefault()
        handleGenerate()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [profile, settings, mode, context])

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Generator</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Tabs value={mode} onValueChange={(v: string) => setMode(v as 'mockery' | 'catchphrase')}>
          <TabsList>
            <TabsTrigger value="mockery">Vicious Mockery</TabsTrigger>
            <TabsTrigger value="catchphrase">Catchphrases</TabsTrigger>
          </TabsList>
        </Tabs>

        <Textarea
          placeholder="Additional context (encounter details, target, mood, etc.)"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={3}
        />

        <div className="flex items-center gap-2">
          <Button onClick={handleGenerate} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Generate
          </Button>
          <Button onClick={handleGenerate} disabled={loading} variant="outline" className="gap-2">
            <RefreshCcw className="size-4" /> Regenerate
          </Button>
        </div>

        <div className="grid gap-2">
          {results.length === 0 && (
            <div className="text-sm text-muted-foreground">No results yet. Press Generate to create your first lines.</div>
          )}
          {results.map((line, i) => (
            <div key={i} className="flex items-center justify-between rounded-md border p-3">
              <div className="text-sm">{line}</div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => handleCopy(line)}>
                  <Copy className="size-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleFavorite(line)}>
                  <Heart className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

