"use client";

import * as React from "react";
import { cn } from "cn";
export const TableHeader = ({ className, ...props }: React.ComponentProps<"thead">) => {
  return <thead data-slot="table-header" className={cn("[&_tr]:border-b", className)} {...props} />;
};
