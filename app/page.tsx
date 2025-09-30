"use client"

import React, { useState, useEffect } from 'react';
import { useCharacterStore } from '@/stores/character-store';
import { useSettingsStore } from '@/stores/settings-store';
import { ProfileSelector } from '@/components/profile-selector';
import { CharacterProfileForm } from '@/components/character-profile-form';
import { GenerationPanel } from '@/components/generation-panel';
import { FavoritesList } from '@/components/favorites-list';
import { SettingsDialog } from '@/components/settings-dialog';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, User, Heart, Shield, Dice6 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const { profiles, activeProfileId } = useCharacterStore();
  const { isApiKeySet } = useSettingsStore();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | undefined>();

  // Show welcome screen if no API key is set
  useEffect(() => {
    if (!isApiKeySet() && profiles.length === 0) {
      // This is handled in the UI below
    }
  }, [isApiKeySet, profiles.length]);

  const handleCreateNew = () => {
    setEditingProfileId(undefined);
    setShowProfileDialog(true);
  };

  const handleEditProfile = () => {
    if (activeProfileId) {
      setEditingProfileId(activeProfileId);
      setShowProfileDialog(true);
    }
  };

  const handleProfileSave = () => {
    setShowProfileDialog(false);
    setEditingProfileId(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dice6 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">D&D Flavor Text Generator</h1>
                <p className="text-sm text-muted-foreground">
                  AI-powered quips and catchphrases for your characters
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ProfileSelector onCreateNew={handleCreateNew} />
              <SettingsDialog />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isApiKeySet() && profiles.length === 0 ? (
          // Welcome Screen
          <div className="max-w-2xl mx-auto">
            <Card className="border-2">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl">Welcome, Adventurer!</CardTitle>
                <CardDescription className="text-base">
                  Get started by setting up your API key and creating your first character
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">1</Badge>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Configure API Key</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Add your AI provider API key to enable text generation. Your key never leaves your browser.
                      </p>
                      <SettingsDialog />
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">2</Badge>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Create Your Character</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Build your character profile with backstory, appearance, and world details.
                      </p>
                      <Button onClick={handleCreateNew}>
                        <User className="mr-2 h-4 w-4" />
                        Create Character
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">3</Badge>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Generate Flavor Text</h3>
                      <p className="text-sm text-muted-foreground">
                        Create vicious mockery insults and signature catchphrases that match your character's personality.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2 text-sm">Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Multiple character profiles with detailed backstories</li>
                    <li>• AI-powered generation using OpenAI, Anthropic, and more</li>
                    <li>• Save favorite quips and catchphrases</li>
                    <li>• Export/import your data as JSON</li>
                    <li>• All data stored locally - complete privacy</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Main Application
          <div className="max-w-6xl mx-auto">
            {activeProfileId ? (
              <Tabs defaultValue="generate" className="space-y-6">
                <div className="flex items-center justify-between">
                  <TabsList className="grid w-fit grid-cols-3">
                    <TabsTrigger value="generate" className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      Generate
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="gap-2">
                      <Heart className="h-4 w-4" />
                      Favorites
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </TabsTrigger>
                  </TabsList>
                  
                  {!isApiKeySet() && (
                    <Badge variant="destructive" className="gap-1">
                      <Shield className="h-3 w-3" />
                      No API Key Set
                    </Badge>
                  )}
                </div>

                <TabsContent value="generate" className="space-y-6">
                  <GenerationPanel />
                </TabsContent>

                <TabsContent value="favorites" className="space-y-6">
                  <FavoritesList />
                </TabsContent>

                <TabsContent value="profile" className="space-y-6">
                  <CharacterProfileForm
                    profileId={activeProfileId}
                    onSave={handleProfileSave}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              // No character selected
              <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">No Character Selected</h2>
                    <p className="text-muted-foreground mb-6">
                      Create your first character to start generating flavor text
                    </p>
                    <Button onClick={handleCreateNew} size="lg">
                      <User className="mr-2 h-4 w-4" />
                      Create Your First Character
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      {/* Character Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProfileId ? 'Edit Character' : 'Create New Character'}
            </DialogTitle>
          </DialogHeader>
          <CharacterProfileForm
            profileId={editingProfileId}
            onSave={handleProfileSave}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}