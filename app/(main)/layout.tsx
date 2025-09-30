"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProfileSelector } from "@/components/profile-selector";
import { SettingsDialog } from "@/components/settings-dialog";
import { Providers } from "@/components/providers";
import { Sparkles } from "lucide-react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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

        <div className="border-b bg-muted/40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <ProfileSelector />
              <nav className="flex gap-2">
                <Button variant={pathname === "/generate" ? "default" : "ghost"} asChild>
                  <Link href="/generate">Generate</Link>
                </Button>
                <Button variant={pathname === "/favorites" ? "default" : "ghost"} asChild>
                  <Link href="/favorites">Favorites</Link>
                </Button>
              </nav>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </Providers>
  );
}
