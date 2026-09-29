"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { PenLine, Bookmark } from "lucide-react";

export function MainNavigation() {
  const pathname = usePathname();
  return (
    <nav className="main-navigation" aria-label="Main navigation">
      <Link href="/generate" aria-current={pathname === "/generate" ? "page" : undefined}>
        <PenLine size={17} />
        Write
      </Link>
      <Link href="/favorites" aria-current={pathname === "/favorites" ? "page" : undefined}>
        <Bookmark size={17} />
        Saved lines
      </Link>
    </nav>
  );
}
