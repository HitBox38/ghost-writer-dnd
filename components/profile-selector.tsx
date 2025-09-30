"use client"

import * as React from 'react'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useCharacterStore } from '@/stores/character-store'

export const ProfileSelector = () => {
  const { profiles, activeProfileId, setActiveProfileId, createProfile, deleteProfile } = useCharacterStore()

  const handleCreate = () => {
    createProfile({ name: 'New Adventurer', class: 'Bard', race: 'Human', level: 1, backstory: '', appearance: '', worldSetting: '' })
  }

  const handleDelete = () => {
    if (!activeProfileId) return
    if (confirm('Delete this profile?')) deleteProfile(activeProfileId)
  }

  return (
    <div className="flex gap-2 items-center">
      <Select value={activeProfileId ?? ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setActiveProfileId(e.target.value || null)} aria-label="Select character">
        <option value="">Select a character</option>
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name || 'Unnamed'} ({p.class || 'Class'})
          </option>
        ))}
      </Select>
      <Button onClick={handleCreate} variant="secondary">New</Button>
      <Button onClick={handleDelete} variant="destructive" disabled={!activeProfileId}>Delete</Button>
    </div>
  )
}

