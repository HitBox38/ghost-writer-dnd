"use client"
import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useCharacterStore } from '@/stores/character-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const CharacterProfileForm = () => {
  const { profiles, activeProfileId, updateProfile } = useCharacterStore()
  const profile = profiles.find((p) => p.id === activeProfileId)

  const [fileError, setFileError] = React.useState<string | null>(null)

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Character</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Create or select a character to edit details.</div>
        </CardContent>
      </Card>
    )
  }

  const handleChange = (field: 'name' | 'class' | 'race' | 'level' | 'appearance' | 'worldSetting' | 'backstory', value: string | number) => {
    updateProfile(profile.id, { [field]: value } as any)
  }

  const handleUpload = async (file: File) => {
    setFileError(null)
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setFileError('PDF must be under 5MB')
      return
    }
    const base64 = await fileToBase64(file)
    updateProfile(profile.id, { characterSheet: base64 })
  }

  const handleRemoveSheet = () => updateProfile(profile.id, { characterSheet: undefined })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Character</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={profile.name} onChange={(e) => handleChange('name', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="level">Level</Label>
            <Input id="level" type="number" min={1} max={20} value={profile.level} onChange={(e) => handleChange('level', Number(e.target.value))} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="grid gap-1.5">
            <Label htmlFor="class">Class</Label>
            <Input id="class" value={profile.class} onChange={(e) => handleChange('class', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="race">Race</Label>
            <Input id="race" value={profile.race} onChange={(e) => handleChange('race', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="world">World / Setting</Label>
            <Input id="world" value={profile.worldSetting} onChange={(e) => handleChange('worldSetting', e.target.value)} />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="appearance">Appearance</Label>
          <Textarea id="appearance" rows={3} value={profile.appearance} onChange={(e) => handleChange('appearance', e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="backstory">Backstory</Label>
          <Textarea id="backstory" rows={5} value={profile.backstory} onChange={(e) => handleChange('backstory', e.target.value)} />
        </div>

        <Separator />

        <div className="grid gap-1.5">
          <Label htmlFor="sheet">Character Sheet (PDF, max 5MB)</Label>
          <Input id="sheet" type="file" accept="application/pdf" onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
          {fileError && <div className="text-sm text-destructive">{fileError}</div>}
          {profile.characterSheet && (
            <div className="flex items-center justify-between rounded-md border p-2 text-sm">
              <span>PDF uploaded</span>
              <Button variant="outline" size="sm" onClick={handleRemoveSheet}>
                Remove
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

