"use client";

import { Cable, Palette, Database } from "lucide-react";
export const SECTIONS = [
  {
    id: "connections",
    name: "AI connections",
    Icon: Cable,
  },
  {
    id: "appearance",
    name: "Appearance",
    Icon: Palette,
  },
  {
    id: "data",
    name: "Data & backups",
    Icon: Database,
  },
] as const;
