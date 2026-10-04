"use client";

import * as React from "react";
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import { cn } from "cn";
export const QuestionnaireError = ({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Error>) => {
  return (
    <QuestionnairePrimitive.Error
      data-slot="questionnaire-error"
      className={cn("text-sm text-destructive", className)}
      {...props}
    />
  );
};
