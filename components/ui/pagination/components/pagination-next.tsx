import * as React from "react";
import { cn } from "cn";
import { ChevronRightIcon } from "lucide-react";
import { PaginationLink } from "./pagination-link";
export const PaginationNext = ({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  text?: string;
}) => {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("pr-2!", className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon data-icon="inline-end" />
    </PaginationLink>
  );
};
