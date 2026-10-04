"use client";

import * as React from "react";
import { cn } from "cn";
import { OTPInput } from "input-otp";
export const InputOTP = ({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) => {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        containerClassName,
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
};
export { InputOTPGroup } from "@/components/ui/input-otp/components/input-otpgroup";
export { InputOTPSlot } from "@/components/ui/input-otp/components/input-otpslot";
export { InputOTPSeparator } from "@/components/ui/input-otp/components/input-otpseparator";
