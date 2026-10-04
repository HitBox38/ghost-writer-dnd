import * as React from "react";
export const PaginationItem = ({ ...props }: React.ComponentProps<"li">) => {
  return <li data-slot="pagination-item" {...props} />;
};
