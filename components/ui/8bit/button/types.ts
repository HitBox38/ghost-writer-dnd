import { Button as ShadcnButton } from "@/components/ui/button";
import "@/components/ui/8bit/styles/retro.css";
export type BitButtonProps = Omit<React.ComponentProps<typeof ShadcnButton>, "className"> & {
  className?: string;
  font?: "normal" | "retro";
};
