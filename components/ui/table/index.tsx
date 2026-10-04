"use client";

import * as React from "react";
import { cn } from "cn";
export const Table = ({ className, ...props }: React.ComponentProps<"table">) => {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
};
export { TableHeader } from "./components/table-header";
export { TableBody } from "./components/table-body";
export { TableFooter } from "./components/table-footer";
export { TableHead } from "./components/table-head";
export { TableRow } from "./components/table-row";
export { TableCell } from "./components/table-cell";
export { TableCaption } from "./components/table-caption";
