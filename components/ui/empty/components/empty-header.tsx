import { cn } from "cn";
export const EmptyHeader = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex max-w-sm flex-col items-center gap-2", className)}
      {...props}
    />
  );
};
