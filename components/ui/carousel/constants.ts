"use client";

import * as React from "react";
import { CarouselContextProps } from "@/components/ui/carousel/types";
export const CarouselContext = React.createContext<CarouselContextProps | null>(null);
