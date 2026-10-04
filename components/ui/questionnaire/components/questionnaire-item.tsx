"use client";

import * as React from "react";
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import { cn } from "cn";
export const QuestionnaireItem = ({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Item>) => {
  return (
    <QuestionnairePrimitive.Item
      data-slot="questionnaire-item"
      className={cn("flex min-w-0 flex-col gap-5 border-0 p-0 outline-none", className)}
      {...props}
    />
  );
};
