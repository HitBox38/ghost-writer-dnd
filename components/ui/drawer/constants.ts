"use client";

import * as React from "react";
import { DrawerContextProps } from "@/components/ui/drawer/types";
export const DrawerContext = React.createContext<DrawerContextProps | null>(null);
