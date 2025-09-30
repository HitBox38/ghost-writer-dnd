'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSelector } from '@/components/profile-selector';
import { GenerationPanel } from '@/components/generation-panel';
import { FavoritesList } from '@/components/favorites-list';
import { SettingsDialog } from '@/components/settings-dialog';
import { Providers } from '@/components/providers';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">D&D Flavor Text Generator</h1>
              </div>
              <SettingsDialog />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <ProfileSelector />
            </div>

            <Tabs defaultValue="generate" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="generate">Generate</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="mt-6">
                <GenerationPanel />
              </TabsContent>

              <TabsContent value="favorites" className="mt-6">
                <FavoritesList />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <footer className="border-t mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>
              Your API key and data never leave your browser. All storage is local.
            </p>
          </div>
        </footer>
      </div>
    </Providers>
  );
}