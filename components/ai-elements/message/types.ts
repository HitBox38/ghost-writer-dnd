"use client";

import type { UIMessage } from "ai";
import { Button } from "@/components/ui/button";
import type { ComponentProps, HTMLAttributes } from "react";
import { Streamdown } from "streamdown";
export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"];
};
export type MessageContentProps = HTMLAttributes<HTMLDivElement>;
export type MessageActionsProps = ComponentProps<"div">;
export type MessageActionProps = ComponentProps<typeof Button> & {
  tooltip?: string;
  label?: string;
};
export type MessageResponseProps = ComponentProps<typeof Streamdown>;
export type MessageToolbarProps = ComponentProps<"div">;
