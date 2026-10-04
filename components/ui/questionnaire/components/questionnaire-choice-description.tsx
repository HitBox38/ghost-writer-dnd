"use client";

import * as React from "react";
import { cn } from "cn";
export const QuestionnaireChoiceDescription = ({
  className,
  ...props
}: React.ComponentProps<"span">) => {
  return (
    <span
      data-slot="questionnaire-choice-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
};
