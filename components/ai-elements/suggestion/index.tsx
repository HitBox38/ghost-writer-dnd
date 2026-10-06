"use client";

import type { SuggestionProps } from "@/components/ai-elements/suggestion/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
export const Suggestion = ({
  suggestion,
  onClick,
  className,
  variant = "outline",
  size = "sm",
  children,
  ...props
}: SuggestionProps) => {
  const handleClick = useCallback(() => {
    onClick?.(suggestion);
  }, [onClick, suggestion]);
  return (
    <Button
      className={cn("cursor-pointer rounded-full px-4", className)}
      onClick={handleClick}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      {children || suggestion}
    </Button>
  );
};
export type { SuggestionsProps } from "@/components/ai-elements/suggestion/types";
export { Suggestions } from "@/components/ai-elements/suggestion/components/suggestions";
export type { SuggestionProps } from "@/components/ai-elements/suggestion/types";
