"use client"
import * as React from 'react'
import { ChevronsUpDown, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCharacterStore } from '@/stores/character-store'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export const ProfileSelector = () => {
  const { profiles, activeProfileId, setActiveProfile, deleteProfile, createProfile } = useCharacterStore()
  const [open, setOpen] = React.useState(false)

  const handleCreate = (payload: { name: string; class: string; race: string; level: number; backstory: string; appearance: string; worldSetting: string }) => {
    createProfile(payload)
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="flex-1">
        <Select value={activeProfileId ?? undefined} onValueChange={(v: string) => setActiveProfile(v)}>
          <SelectTrigger aria-label="Select character">
            <SelectValue placeholder="Select character" />
          </SelectTrigger>
          <SelectContent>
            {profiles.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name} — Lv {p.level} {p.race} {p.class}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="size-4" /> New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>New Character</DialogTitle>
            <NewCharacterForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>

        {activeProfileId && (
          <Button size="sm" variant="destructive" onClick={() => deleteProfile(activeProfileId)}>
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

const NewCharacterForm = ({ onSubmit }: { onSubmit: (p: { name: string; class: string; race: string; level: number; backstory: string; appearance: string; worldSetting: string }) => void }) => {
  const [name, setName] = React.useState('')
  const [clazz, setClazz] = React.useState('Bard')
  const [race, setRace] = React.useState('Human')
  const [level, setLevel] = React.useState<number>(1)
  const [backstory, setBackstory] = React.useState('')
  const [appearance, setAppearance] = React.useState('')
  const [worldSetting, setWorldSetting] = React.useState('Forgotten Realms')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), class: clazz.trim(), race: race.trim(), level, backstory, appearance, worldSetting })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="grid gap-1.5">
          <Label htmlFor="class">Class</Label>
          <Input id="class" value={clazz} onChange={(e) => setClazz(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="race">Race</Label>
          <Input id="race" value={race} onChange={(e) => setRace(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="level">Level</Label>
          <Input id="level" type="number" min={1} max={20} value={level} onChange={(e) => setLevel(Number(e.target.value))} />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="appearance">Appearance</Label>
        <Textarea id="appearance" value={appearance} onChange={(e) => setAppearance(e.target.value)} rows={3} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="world">World / Setting</Label>
        <Input id="world" value={worldSetting} onChange={(e) => setWorldSetting(e.target.value)} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="backstory">Backstory</Label>
        <Textarea id="backstory" value={backstory} onChange={(e) => setBackstory(e.target.value)} rows={4} />
      </div>
      <div className="flex justify-end">
        <Button type="submit">Create</Button>
      </div>
    </form>
  )
}

