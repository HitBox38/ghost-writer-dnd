"use client";

import { useEffect, useRef, useState } from "react";
import type { PendingLeave } from "../types";
export const useUnsavedChanges = (dirty: boolean) => {
  const [pendingLeave, setPendingLeave] = useState<PendingLeave | null>(null);
  const [unloadBlocked, setUnloadBlocked] = useState(false);
  const dirtyRef = useRef(dirty);
  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return;
      event.preventDefault();
      event.returnValue = true;
      // Some embedded browsers cancel unloading without displaying the native warning.
      setUnloadBlocked(true);
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);
  useEffect(() => {
    const interceptRefresh = (event: KeyboardEvent) => {
      if (!dirtyRef.current || event.defaultPrevented || event.altKey) return;
      if (
        event.key !== "F5" &&
        !((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r")
      )
        return;
      event.preventDefault();
      setPendingLeave({
        kind: "reload",
      });
    };
    const interceptLink = (event: MouseEvent) => {
      if (
        !dirtyRef.current ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (
        url.origin !== window.location.origin ||
        (url.pathname === window.location.pathname && url.hash)
      )
        return;
      event.preventDefault();
      event.stopPropagation();
      setPendingLeave({
        kind: "navigate",
        href: url.pathname + url.search + url.hash,
      });
    };
    window.addEventListener("keydown", interceptRefresh);
    document.addEventListener("click", interceptLink, true);
    return () => {
      window.removeEventListener("keydown", interceptRefresh);
      document.removeEventListener("click", interceptLink, true);
    };
  }, []);
  return {
    dirtyRef,
    pendingLeave,
    setPendingLeave,
    unloadBlocked,
  };
};
