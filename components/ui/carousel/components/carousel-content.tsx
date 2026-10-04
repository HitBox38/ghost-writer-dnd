"use client";

import * as React from "react";
import { cn } from "cn";
import { useCarousel } from "@/components/ui/carousel/hooks/use-carousel";
export const CarouselContent = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div ref={carouselRef} className="overflow-hidden" data-slot="carousel-content">
      <div
        className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)}
        {...props}
      />
    </div>
  );
};
