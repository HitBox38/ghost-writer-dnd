"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const MainNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2">
      <Link
        href="/generate"
        className={buttonVariants({ variant: pathname === "/generate" ? "default" : "ghost" })}
        aria-current={pathname === "/generate" ? "page" : undefined}
      >
        Generate
      </Link>
      <Link
        href="/favorites"
        className={buttonVariants({ variant: pathname === "/favorites" ? "default" : "ghost" })}
        aria-current={pathname === "/favorites" ? "page" : undefined}
      >
        Favorites
      </Link>
    </nav>
  );
};
