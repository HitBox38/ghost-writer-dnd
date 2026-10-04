import * as React from "react";
import { cn } from "cn";
export const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => {
  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
};
export { PaginationContent } from "./components/pagination-content";
export { PaginationEllipsis } from "./components/pagination-ellipsis";
export { PaginationItem } from "./components/pagination-item";
export { PaginationLink } from "./components/pagination-link";
export { PaginationNext } from "./components/pagination-next";
export { PaginationPrevious } from "./components/pagination-previous";
