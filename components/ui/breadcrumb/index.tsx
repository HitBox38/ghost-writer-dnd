import * as React from "react";
import { cn } from "cn";
export const Breadcrumb = ({ className, ...props }: React.ComponentProps<"nav">) => {
  return (
    <nav aria-label="breadcrumb" data-slot="breadcrumb" className={cn(className)} {...props} />
  );
};
export { BreadcrumbList } from "@/components/ui/breadcrumb/components/breadcrumb-list";
export { BreadcrumbItem } from "@/components/ui/breadcrumb/components/breadcrumb-item";
export { BreadcrumbLink } from "@/components/ui/breadcrumb/components/breadcrumb-link";
export { BreadcrumbPage } from "@/components/ui/breadcrumb/components/breadcrumb-page";
export { BreadcrumbSeparator } from "@/components/ui/breadcrumb/components/breadcrumb-separator";
export { BreadcrumbEllipsis } from "@/components/ui/breadcrumb/components/breadcrumb-ellipsis";
