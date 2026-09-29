"use client";
import { useEffect, useState } from "react";
import { LineResponse } from "@/components/line-message";

const CHAR_MS = 16;
const MAX_TYPING_MS = 1400;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Writes a line out word by word, like a streamed response. The unwritten rest stays
 * in the layout as transparent text so wrapping, height, and copy/read-aloud never change.
 * Whether it types is decided once at mount, so reordering or re-rendering never replays it.
 */
export function TypedDialogue({
  text,
  typing,
  delay = 0,
}: {
  text: string;
  typing: boolean;
  delay?: number;
}) {
  const [tokens] = useState(() => text.match(/^\s+|\S+\s*/g) ?? []);
  // Formatted responses render at once so Markdown syntax never flashes during the reveal.
  const [count, setCount] = useState(() =>
    typing && !prefersReducedMotion() && !/[*_`~\[\]<>#\\]/.test(text) ? 0 : tokens.length,
  );
  const done = count >= tokens.length;
  useEffect(() => {
    if (done) return;
    // Pace by characters so long words take longer, like a real stream.
    const charMs = Math.min(CHAR_MS, MAX_TYPING_MS / text.length);
    const starts: number[] = [];
    let offset = 0;
    for (const token of tokens) {
      starts.push(offset * charMs);
      offset += token.length;
    }
    let frame = 0;
    let origin: number | null = null;
    const tick = (now: number) => {
      origin ??= now + delay;
      const elapsed = now - origin;
      const next = elapsed < 0 ? 0 : starts.filter((start) => start <= elapsed).length;
      setCount(next);
      if (next < tokens.length) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [done, delay, text, tokens]);
  if (done) return <LineResponse text={text} />;
  return (
    <p className="dialogue" data-typing="">
      {tokens.slice(0, Math.max(count - 1, 0)).join("")}
      <span className="typed-token" key={count}>
        {count > 0 ? tokens[count - 1] : ""}
      </span>
      <span className="untyped">{tokens.slice(count).join("")}</span>
    </p>
  );
}
