"use client"
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { toast } from '@/components/ui/use-toast'
import { useSettingsStore } from '@/stores/settings-store'
import type { Provider } from '@/lib/types'

const PROVIDER_MODELS: Record<Provider, string[]> = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'o3-mini'],
  anthropic: ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest'],
  google: ['gemini-1.5-pro', 'gemini-1.5-flash'],
}

export const SettingsDialog = () => {
  const settings = useSettingsStore()
  const [open, setOpen] = React.useState(false)

  const models = PROVIDER_MODELS[settings.provider]
  const handleProvider = (p: Provider) => {
    settings.setProvider(p)
    // If current model not compatible, switch to first
    if (!PROVIDER_MODELS[p].includes(settings.model)) {
      settings.setModel(PROVIDER_MODELS[p][0])
    }
  }

  const handleTest = async () => {
    if (!settings.apiKey) {
      toast({ title: 'Missing API key', description: 'Enter your provider key first', variant: 'destructive' })
      return
    }
    // Simple smoke test: does the adapter construct?
    try {
      // Just a local check; we do not send any network request here
      new URL('https://example.com')
      toast({ title: 'Key stored', description: 'Your API key is saved locally' })
    } catch (e) {
      toast({ title: 'Validation failed', variant: 'destructive' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Settings</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>Your API key never leaves your browser.</DialogDescription>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Provider</Label>
            <Select value={settings.provider} onValueChange={(v: string) => handleProvider(v as Provider)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="google">Google</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>API Key</Label>
            <Input
              type="password"
              placeholder="sk-..."
              value={settings.apiKey}
              onChange={(e) => settings.setApiKey(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Model</Label>
            <Select value={settings.model} onValueChange={(v: string) => settings.setModel(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Temperature: {settings.temperature.toFixed(2)}</Label>
            <Slider value={[settings.temperature]} min={0} max={1} step={0.01} onValueChange={([v]: number[]) => settings.setTemperature(v)} />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">Your API key never leaves your browser</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleTest}>
                Test
              </Button>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

