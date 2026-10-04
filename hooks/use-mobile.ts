"use client";

import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;

const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

const getSnapshot = () => {
  return window.matchMedia(MOBILE_QUERY).matches;
};

const getServerSnapshot = () => {
  return false;
};

export const useIsMobile = () => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
