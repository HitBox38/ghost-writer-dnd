"use client";

import { type Button } from "@/components/ui/button";
import * as React from "react";
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
export const QuestionnairePrevious = ({
  children,
  className,
  size = "default",
  variant = "outline",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Previous> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) => {
  return (
    <QuestionnairePrimitive.Previous
      data-slot="questionnaire-previous"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({
          size,
          variant,
        }),
        "col-start-1 row-start-1 min-h-11 justify-self-start sm:min-h-0",
        className,
      )}
      {...props}
    >
      {children ?? "Previous"}
    </QuestionnairePrimitive.Previous>
  );
};
