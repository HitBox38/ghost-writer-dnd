"use client";

import * as React from "react";
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import { cn } from "cn";
export const QuestionnaireChoices = ({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choices>) => {
  return (
    <QuestionnairePrimitive.Choices
      data-slot="questionnaire-choices"
      className={cn("group/questionnaire-choices grid min-w-0 gap-3", className)}
      {...props}
    />
  );
};
