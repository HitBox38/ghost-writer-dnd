import * as React from "react";
import { cn } from "cn";
import { ChevronLeftIcon } from "lucide-react";
import { PaginationLink } from "./pagination-link";
export const PaginationPrevious = ({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  text?: string;
}) => {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("pl-2!", className)}
      {...props}
    >
      <ChevronLeftIcon data-icon="inline-start" />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  );
};
