"use client";

import * as React from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { useCarousel } from "@/components/ui/carousel/hooks/use-carousel";
export const CarouselNext = ({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation rounded-full",
        orientation === "horizontal"
          ? "inset-y-0 -right-12 my-auto"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRightIcon />
      <span className="sr-only">Next slide</span>
    </Button>
  );
};
