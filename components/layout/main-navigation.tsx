'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const MainNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2">
      <Button variant={pathname === '/generate' ? 'default' : 'ghost'} asChild>
        <Link href="/generate">Generate</Link>
      </Button>
      <Button variant={pathname === '/favorites' ? 'default' : 'ghost'} asChild>
        <Link href="/favorites">Favorites</Link>
      </Button>
    </nav>
  );
};