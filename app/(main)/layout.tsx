"use client";

import { ProfileSelector } from "@/components/profile-selector";
import { MainNavigation } from "@/components/layout/main-navigation";
import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";
import { Providers } from "@/components/providers";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <AppHeader />

        <div className="border-b bg-muted/40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <ProfileSelector />
              <MainNavigation />
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">{children}</main>

        <AppFooter />
      </div>
    </Providers>
  );
}
