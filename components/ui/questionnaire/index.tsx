"use client";

import * as React from "react";
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import { cn } from "cn";
export const Questionnaire = ({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Root>) => {
  return (
    <QuestionnairePrimitive.Root
      data-slot="questionnaire"
      className={cn("flex w-full min-w-0 flex-col gap-6", className)}
      {...props}
    />
  );
};
export { QuestionnaireActions } from "./components/questionnaire-actions";
export { QuestionnaireChoice } from "./components/questionnaire-choice";
export { QuestionnaireChoiceDescription } from "./components/questionnaire-choice-description";
export { QuestionnaireChoices } from "./components/questionnaire-choices";
export { QuestionnaireDescription } from "./components/questionnaire-description";
export { QuestionnaireError } from "./components/questionnaire-error";
export { QuestionnaireInput } from "./components/questionnaire-input";
export { QuestionnaireItem } from "./components/questionnaire-item";
export { QuestionnaireNext } from "./components/questionnaire-next";
export { QuestionnairePrevious } from "./components/questionnaire-previous";
export { QuestionnaireProgress } from "./components/questionnaire-progress";
export { QuestionnaireSkip } from "./components/questionnaire-skip";
export { QuestionnaireSubmit } from "./components/questionnaire-submit";
export { QuestionnaireTitle } from "./components/questionnaire-title";
