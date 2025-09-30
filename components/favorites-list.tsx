"use client"
import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, HeartOff } from 'lucide-react'
import { useCharacterStore } from '@/stores/character-store'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/components/ui/use-toast'

export const FavoritesList = () => {
  const { profiles, activeProfileId, removeFavorite } = useCharacterStore()
  const profile = profiles.find((p) => p.id === activeProfileId)

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({ title: 'Copied to clipboard' })
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' })
    }
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Favorites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Select a character to view favorites.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Favorites</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {profile.favorites.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No favorites yet. Save generated lines to keep them here.</div>
        ) : (
          <ScrollArea className="max-h-[380px]">
            <div className="grid gap-2 p-4">
              {profile.favorites.map((f) => (
                <div key={f.id} className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm">{f.text}</div>
                    <div>
                      <Badge variant="secondary">{f.type}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleCopy(f.text)}>
                      <Copy className="size-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removeFavorite(profile.id, f.id)}>
                      <HeartOff className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

