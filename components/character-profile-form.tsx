"use client"

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCharacterStore } from '@/stores/character-store'

export const CharacterProfileForm = () => {
  const { profiles, activeProfileId, updateProfile, createProfile } = useCharacterStore()
  const profile = profiles.find((p) => p.id === activeProfileId)

  const handleCreate = () => {
    const id = createProfile({
      name: 'New Adventurer',
      class: 'Bard',
      race: 'Human',
      level: 1,
      backstory: '',
      appearance: '',
      worldSetting: '',
    })
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create your first character</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleCreate}>Create Character</Button>
        </CardContent>
      </Card>
    )
  }

  const handleChange = (key: keyof typeof profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateProfile(profile.id, { [key]: key === 'level' ? Number(e.target.value) : e.target.value } as any)
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large (max 5MB)')
      return
    }
    const buffer = await file.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
    updateProfile(profile.id, { characterSheet: `data:application/pdf;base64,${base64}` })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Character Profile</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={profile.name} onChange={handleChange('name')} placeholder="Lyra Dawnsong" />
          </div>
          <div>
            <Label htmlFor="class">Class</Label>
            <Input id="class" value={profile.class} onChange={handleChange('class')} placeholder="Bard" />
          </div>
          <div>
            <Label htmlFor="race">Race</Label>
            <Input id="race" value={profile.race} onChange={handleChange('race')} placeholder="Half-elf" />
          </div>
          <div>
            <Label htmlFor="level">Level</Label>
            <Input id="level" type="number" min={1} value={profile.level} onChange={handleChange('level')} />
          </div>
        </div>
        <div>
          <Label htmlFor="backstory">Backstory</Label>
          <Textarea id="backstory" value={profile.backstory} onChange={handleChange('backstory')} rows={4} />
        </div>
        <div>
          <Label htmlFor="appearance">Appearance</Label>
          <Textarea id="appearance" value={profile.appearance} onChange={handleChange('appearance')} rows={3} />
        </div>
        <div>
          <Label htmlFor="worldSetting">World / Campaign Setting</Label>
          <Textarea id="worldSetting" value={profile.worldSetting} onChange={handleChange('worldSetting')} rows={3} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sheet">Character Sheet (PDF, max 5MB)</Label>
          <Input id="sheet" type="file" accept="application/pdf" onChange={handleFile} />
        </div>
      </CardContent>
    </Card>
  )
}

