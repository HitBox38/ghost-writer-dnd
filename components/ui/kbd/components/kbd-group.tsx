import { cn } from "cn";
export const KbdGroup = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
};
