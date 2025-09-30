"use client"

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCharacterStore } from '@/stores/character-store'

export const FavoritesList = () => {
  const { profiles, activeProfileId, removeFavorite } = useCharacterStore()
  const profile = profiles.find((p) => p.id === activeProfileId) ?? null

  if (!profile) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Favorites</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {profile.favorites.length === 0 && (
          <p className="text-sm text-muted-foreground">No favorites yet. Favorite lines to save them here.</p>
        )}
        {profile.favorites.map((f) => (
          <div key={f.id} className="flex items-start justify-between gap-2 border rounded-md p-3">
            <div>
              <p className="text-xs text-muted-foreground">{f.type}</p>
              <p className="text-sm leading-relaxed">{f.text}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(f.text)}>Copy</Button>
              <Button size="sm" variant="destructive" onClick={() => removeFavorite(profile.id, f.id)}>Remove</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

