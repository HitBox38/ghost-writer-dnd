"use client"

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/stores/settings-store'

export const SettingsPanel = () => {
  const settings = useSettingsStore()
  const [testing, setTesting] = React.useState(false)
  const [testResult, setTestResult] = React.useState<string | null>(null)

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    const res = await settings.testConnection()
    setTesting(false)
    setTestResult(res.ok ? 'Connection OK' : `Failed: ${res.error}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label>Provider</Label>
          <Select value={settings.provider} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => settings.setProvider(e.target.value as any)}>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="google">Google</option>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>API Key</Label>
          <Input
            value={settings.apiKey}
            onChange={(e) => settings.setApiKey(e.target.value)}
            placeholder="sk-..."
            type="password"
          />
          <p className="text-xs text-muted-foreground">Your API key never leaves your browser.</p>
        </div>
        <div className="grid gap-2">
          <Label>Model</Label>
          <Input value={settings.model} onChange={(e) => settings.setModel(e.target.value)} placeholder="gpt-4o-mini" />
        </div>
        <div className="grid gap-2">
          <Label>Temperature: {settings.temperature.toFixed(2)}</Label>
          <Slider value={settings.temperature} min={0} max={1} step={0.05} onChange={(v: number) => settings.setTemperature(v)} />
        </div>
        <div className="flex gap-2 items-center">
          <Button onClick={handleTest} disabled={!settings.apiKey || testing}>{testing ? 'Testing...' : 'Test Connection'}</Button>
          {testResult && <span className="text-sm">{testResult}</span>}
        </div>
      </CardContent>
    </Card>
  )
}

