import type { BitButtonProps } from "@/components/ui/8bit/button/types";
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";
import "@/components/ui/8bit/styles/retro.css";
export const Button = ({
  children,
  variant = "default",
  size = "default",
  className,
  font,
  ...props
}: BitButtonProps) => {
  return (
    <ShadcnButton
      {...props}
      className={cn(
        "rounded-none active:translate-y-1 transition-transform relative inline-flex items-center justify-center gap-1.5 border-none",
        font !== "normal" && "retro",
        className,
      )}
      size={size}
      variant={variant}
    >
      <>
        {children}

        {variant !== "ghost" && variant !== "link" && !size?.startsWith("icon") && (
          <>
            {/* Pixelated border */}
            <div className="absolute -top-1.5 w-1/2 left-1.5 h-1.5 bg-foreground dark:bg-ring" />
            <div className="absolute -top-1.5 w-1/2 right-1.5 h-1.5 bg-foreground dark:bg-ring" />
            <div className="absolute -bottom-1.5 w-1/2 left-1.5 h-1.5 bg-foreground dark:bg-ring" />
            <div className="absolute -bottom-1.5 w-1/2 right-1.5 h-1.5 bg-foreground dark:bg-ring" />
            <div className="absolute top-0 left-0 size-1.5 bg-foreground dark:bg-ring" />
            <div className="absolute top-0 right-0 size-1.5 bg-foreground dark:bg-ring" />
            <div className="absolute bottom-0 left-0 size-1.5 bg-foreground dark:bg-ring" />
            <div className="absolute bottom-0 right-0 size-1.5 bg-foreground dark:bg-ring" />
            <div className="absolute top-1.5 -left-1.5 h-[calc(100%-12px)] w-1.5 bg-foreground dark:bg-ring" />
            <div className="absolute top-1.5 -right-1.5 h-[calc(100%-12px)] w-1.5 bg-foreground dark:bg-ring" />
            {variant !== "outline" && (
              <>
                {/* Top shadow */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-foreground/20" />
                <div className="absolute top-1.5 left-0 w-3 h-1.5 bg-foreground/20" />

                {/* Bottom shadow */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-foreground/20" />
                <div className="absolute bottom-1.5 right-0 w-3 h-1.5 bg-foreground/20" />
              </>
            )}
          </>
        )}

        {size?.startsWith("icon") && (
          <>
            <div className="absolute top-0 left-0 w-full h-[5px] md:h-1.5 bg-foreground dark:bg-ring pointer-events-none" />
            <div className="absolute bottom-0 w-full h-[5px] md:h-1.5 bg-foreground dark:bg-ring pointer-events-none" />
            <div className="absolute top-1 -left-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
            <div className="absolute bottom-1 -left-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
            <div className="absolute top-1 -right-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
            <div className="absolute bottom-1 -right-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
          </>
        )}
      </>
    </ShadcnButton>
  );
};
export { buttonVariants } from "@/components/ui/8bit/button/constants";
export type { BitButtonProps } from "@/components/ui/8bit/button/types";
