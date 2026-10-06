"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileSelector } from "@/components/profile-selector";
import { MainNavigation } from "@/components/layout/main-navigation";
export const AppHeader = () => {
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
      </header>
    </>
  );
};
