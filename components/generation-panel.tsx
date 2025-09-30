"use client"

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCharacterStore } from '@/stores/character-store'
import { useSettingsStore } from '@/stores/settings-store'
import { generateFlavorText } from '@/lib/ai-generator'
import type { GenerationMode } from '@/lib/types'

export const GenerationPanel = () => {
  const { profiles, activeProfileId, addFavorite } = useCharacterStore()
  const settings = useSettingsStore()
  const profile = profiles.find((p) => p.id === activeProfileId) ?? null

  const [mode, setMode] = React.useState<GenerationMode>('mockery')
  const [context, setContext] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState<string[]>([])

  const canGenerate = !!profile && !!settings.apiKey

  const handleGenerate = async () => {
    if (!profile) return
    setIsLoading(true)
    try {
      const lines = await generateFlavorText({ profile, settings, mode, userContext: context, count: 5 })
      setResults(lines)
    } catch (e: any) {
      alert(e?.message || 'Generation failed')
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'enter') {
        e.preventDefault()
        if (canGenerate) void handleGenerate()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [canGenerate, profile, settings, mode, context])

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Generation</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Tabs value={mode} onValueChange={(v) => setMode(v as GenerationMode)}>
          <TabsList>
            <TabsTrigger value="mockery">Vicious Mockery</TabsTrigger>
            <TabsTrigger value="catchphrase">Catchphrases</TabsTrigger>
          </TabsList>
          <TabsContent value="mockery"><div /></TabsContent>
          <TabsContent value="catchphrase"><div /></TabsContent>
        </Tabs>
        <Textarea
          placeholder="Add situational context (enemy, scene, mood)..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={3}
        />
        <div className="flex gap-2">
          <Button onClick={handleGenerate} disabled={!canGenerate || isLoading}>{isLoading ? 'Generating...' : 'Generate'}</Button>
          <Button onClick={handleGenerate} variant="secondary" disabled={!canGenerate || isLoading}>Regenerate</Button>
        </div>
        <div className="grid gap-2">
          {results.length === 0 && <p className="text-sm text-muted-foreground">No results yet.</p>}
          {profile && results.map((line: string, idx: number) => (
            <div key={idx} className="flex items-start justify-between gap-2 border rounded-md p-3">
              <p className="text-sm leading-relaxed">{line}</p>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(line)}>Copy</Button>
                <Button size="sm" onClick={() => addFavorite(profile.id, line, mode)}>❤</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

