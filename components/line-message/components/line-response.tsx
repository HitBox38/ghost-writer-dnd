"use client";

import { MessageResponse } from "@/components/ai-elements/message";
import { LINE_FORMATTING } from "@/components/line-message/constants";
export const LineResponse = ({ text }: { text: string }) => {
  return (
    <MessageResponse
      className="dialogue line-response"
      mode="static"
      controls={false}
      allowedElements={LINE_FORMATTING}
      unwrapDisallowed
    >
      {text}
    </MessageResponse>
  );
};
