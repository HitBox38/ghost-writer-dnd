"use client";

import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
};
const getSnapshot = () => Math.min(window.devicePixelRatio || 1, 2);
const getServerSnapshot = () => 1;

export const useDevicePixelRatio = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
