import { ProfileSelector } from '@/components/profile-selector'
import { CharacterProfileForm } from '@/components/character-profile-form'
import { GenerationPanel } from '@/components/generation-panel'
import { FavoritesList } from '@/components/favorites-list'
import { SettingsPanel } from '@/components/settings-dialog'

export default function Home() {
  return (
    <div className="min-h-screen p-6 md:p-10 grid gap-6">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">D&D Flavor Text Generator</h1>
        <ProfileSelector />
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="grid gap-6">
          <SettingsPanel />
          <CharacterProfileForm />
        </div>
        <div className="grid gap-6">
          <GenerationPanel />
          <FavoritesList />
        </div>
      </div>
    </div>
  )
}
