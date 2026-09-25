import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: vi.fn(() => "/generate"),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jsdom has no Web Animations API. Base UI inspects running animations
// when coordinating scroll areas and popup lifecycles.
if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => [];
}

// Mock hasPointerCapture
if (typeof Element !== "undefined" && !Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}

// Mock crypto.randomUUID
if (typeof crypto === "undefined") {
  global.crypto = {
    randomUUID: () => Math.random().toString(36).substring(7),
  } as Crypto;
}

// Cleanup after each test
afterEach(() => {
  cleanup();
  localStorage.clear();
});
