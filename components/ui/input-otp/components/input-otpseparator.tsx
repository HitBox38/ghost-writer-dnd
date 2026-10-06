"use client";

import * as React from "react";
import { MinusIcon } from "lucide-react";
export const InputOTPSeparator = ({ ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon />
    </div>
  );
};
