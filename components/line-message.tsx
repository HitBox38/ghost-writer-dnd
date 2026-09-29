"use client";

import { useEffect, useState } from "react";
import { Bookmark, Check, Copy } from "lucide-react";
import { MessageAction, MessageActions, MessageResponse } from "@/components/ai-elements/message";

const LINE_FORMATTING = ["p", "strong", "em", "del", "code", "br"];

export function LineResponse({ text }: { text: string }) {
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
}

export type CopyLineAction = (text: string) => void | boolean | Promise<void | boolean>;

export function LineActions({
  text,
  saved,
  onSave,
  onCopy,
  savedLabel = "Saved",
}: {
  text: string;
  saved: boolean;
  onSave: () => void;
  onCopy: CopyLineAction;
  savedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);
  async function copy() {
    try {
      setCopied((await onCopy(text)) !== false);
    } catch {
      setCopied(false);
    }
  }
  return (
    <MessageActions className="line-actions" aria-label="Line actions">
      <MessageAction
        size="sm"
        variant="ghost"
        className={saved ? "saved-action" : undefined}
        aria-label={saved ? savedLabel : "Save"}
        aria-pressed={saved}
        onClick={onSave}
      >
        <Bookmark size={15} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
        {saved ? "Saved" : "Save"}
      </MessageAction>
      <MessageAction size="sm" onClick={() => void copy()} aria-label={copied ? "Copied" : "Copy"}>
        {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </MessageAction>
    </MessageActions>
  );
}
