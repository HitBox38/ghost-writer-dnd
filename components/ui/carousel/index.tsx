"use client";

import type { CarouselProps } from "@/components/ui/carousel/types";
import * as React from "react";
import { cn } from "cn";
import useEmblaCarousel from "embla-carousel-react";
import { CarouselContext } from "@/components/ui/carousel/constants";
export const Carousel = ({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) => {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      api?.on("reInit", onChange);
      api?.on("select", onChange);
      return () => {
        api?.off("reInit", onChange);
        api?.off("select", onChange);
      };
    },
    [api],
  );
  const canScrollPrev = React.useSyncExternalStore(
    subscribe,
    () => api?.canScrollPrev() ?? false,
    () => false,
  );
  const canScrollNext = React.useSyncExternalStore(
    subscribe,
    () => api?.canScrollNext() ?? false,
    () => false,
  );
  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);
  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );
  React.useEffect(() => {
    if (!api || !setApi) return;
    // Embla owns this imperative handle; the callback does not mirror local React state.
    // react-doctor-disable-next-line react-doctor/no-pass-data-to-parent, react-doctor/no-pass-live-state-to-parent, react-doctor/no-prop-callback-in-effect
    setApi(api);
  }, [api, setApi]);
  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
};
export type { CarouselApi } from "@/components/ui/carousel/types";
export { CarouselContent } from "@/components/ui/carousel/components/carousel-content";
export { CarouselItem } from "@/components/ui/carousel/components/carousel-item";
export { CarouselPrevious } from "@/components/ui/carousel/components/carousel-previous";
export { CarouselNext } from "@/components/ui/carousel/components/carousel-next";
export { useCarousel } from "@/components/ui/carousel/hooks/use-carousel";
