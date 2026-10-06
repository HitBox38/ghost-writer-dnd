"use client";

import * as React from "react";
import { cn } from "cn";
export const QuestionnaireActions = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="questionnaire-actions"
      className={cn(
        "grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 sm:min-h-9",
        className,
      )}
      {...props}
    />
  );
};
