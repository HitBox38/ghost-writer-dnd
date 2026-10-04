"use client";

import * as React from "react";
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import { cn } from "cn";
export const QuestionnaireTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Title>) => {
  return (
    <QuestionnairePrimitive.Title
      data-slot="questionnaire-title"
      className={cn(
        "text-base font-semibold text-pretty [&:not(:has(~[data-slot=questionnaire-description]))]:mb-5",
        className,
      )}
      {...props}
    />
  );
};
