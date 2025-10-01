import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/generate',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock crypto.randomUUID
if (typeof crypto === 'undefined') {
  global.crypto = {
    randomUUID: () => Math.random().toString(36).substring(7),
  } as Crypto;
}

// Cleanup after each test
afterEach(() => {
  cleanup();
  localStorage.clear();
});
