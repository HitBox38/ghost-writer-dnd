"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { ProfileSelector } from "@/components/profile-selector";
import { MainNavigation } from "./main-navigation";

export function AppHeader() {
  const pathname = usePathname();
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="app-header">
        <Link href="/generate" className="wordmark">
          Ghost Writer
        </Link>
        {!pathname.startsWith("/characters") && <ProfileSelector />}
        <MainNavigation />
        <Link
          className="settings-link"
          href="/settings/connections"
          aria-label="Settings"
          aria-current={pathname.startsWith("/settings") ? "page" : undefined}
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>
      </header>
    </>
  );
}
