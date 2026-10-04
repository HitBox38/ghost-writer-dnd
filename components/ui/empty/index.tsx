import { cn } from "cn";
export const Empty = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-lg border-dashed p-12 text-center text-balance",
        className,
      )}
      {...props}
    />
  );
};
export { EmptyHeader } from "@/components/ui/empty/components/empty-header";
export { EmptyTitle } from "@/components/ui/empty/components/empty-title";
export { EmptyDescription } from "@/components/ui/empty/components/empty-description";
export { EmptyContent } from "@/components/ui/empty/components/empty-content";
export { EmptyMedia } from "@/components/ui/empty/components/empty-media";
