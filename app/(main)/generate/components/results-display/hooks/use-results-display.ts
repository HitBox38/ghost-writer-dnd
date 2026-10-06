"use client";

import type { ResultsDisplayProps } from "../types";
import { MAX_LINES } from "../constants";
import { useState } from "react";
import { useWorkspaceStore } from "@/stores/workspace-store";
export const useResultsDisplay = ({
  results,
  favorites,
  onToggleFavorite,
  onCopy,
  isGenerating = false,
  pendingCount = 5,
  characterName,
  generationType = "mockery",
  resultType = "mockery",
  resultContext,
  onChooseScene,
}: ResultsDisplayProps) => {
  const { layout, sort, setLayout, setSort } = useWorkspaceStore();
  // Only lines that arrive from a generation finishing in this view animate in;
  // sorting, remounting, or switching characters shows them instantly.
  const [previous, setPrevious] = useState({
    results,
    isGenerating,
  });
  const [arrival, setArrival] = useState(0);
  const [revealing, setRevealing] = useState(false);
  if (previous.results !== results || previous.isGenerating !== isGenerating) {
    if (previous.results !== results && previous.isGenerating && results.length) {
      setArrival(arrival + 1);
      setRevealing(true);
    }
    setPrevious({
      results,
      isGenerating,
    });
  }
  const sorted =
    sort === "original"
      ? results
      : results.toSorted(
          (a, b) =>
            (Number(favorites.has(b.id)) - Number(favorites.has(a.id))) *
            (sort === "saved" ? 1 : -1),
        );
  const drafts = Math.min(
    Math.max(Number.isInteger(pendingCount) ? pendingCount : 1, 1),
    MAX_LINES,
  );
  return {
    isGenerating,
    results,
    sort,
    setSort,
    layout,
    setLayout,
    pendingCount,
    resultType,
    characterName,
    resultContext,
    drafts,
    onChooseScene,
    generationType,
    arrival,
    revealing,
    setRevealing,
    sorted,
    favorites,
    onToggleFavorite,
    onCopy,
  };
};
