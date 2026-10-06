"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const serverSnapshot = () => "";

export const SavedLineDate = ({ createdAt }: { createdAt: number }) => {
  const date = useSyncExternalStore(
    subscribe,
    () => new Date(createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    serverSnapshot,
  );
  return <time dateTime={new Date(createdAt).toISOString()}>{date}</time>;
};
