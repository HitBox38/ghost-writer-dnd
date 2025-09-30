"use client"
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { downloadJson, exportAppData, importAppData } from '@/lib/storage'
import { toast } from '@/components/ui/use-toast'
import { useCharacterStore } from '@/stores/character-store'
import { useSettingsStore } from '@/stores/settings-store'

export const DataControls = () => {
  const { clearAll } = useCharacterStore()
  const settings = useSettingsStore()

  const handleExport = () => {
    const data = exportAppData()
    downloadJson(data, 'dnd-flavor-text.json')
    toast({ title: 'Exported data' })
  }

  const handleImport = async (file: File) => {
    try {
      const text = await file.text()
      const json = JSON.parse(text)
      importAppData(json)
      toast({ title: 'Imported data' })
    } catch (e: any) {
      toast({ title: 'Import failed', description: e?.message ?? 'Invalid file', variant: 'destructive' })
    }
  }

  const handleClear = () => {
    const ok = confirm('This will clear all characters and favorites. Continue?')
    if (!ok) return
    clearAll()
    // preserve settings
    toast({ title: 'Cleared all data' })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" onClick={handleExport}>
        Export JSON
      </Button>
      <label className="inline-flex cursor-pointer items-center rounded-md border px-3 py-1 text-sm hover:bg-accent">
        Import JSON
        <input
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => e.target.files && handleImport(e.target.files[0])}
        />
      </label>
      <Button variant="destructive" onClick={handleClear}>
        Clear Data
      </Button>
    </div>
  )
}

