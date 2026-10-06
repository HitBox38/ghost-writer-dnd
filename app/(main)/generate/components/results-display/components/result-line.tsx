"use client";

import { Message, MessageContent, MessageToolbar } from "@/components/ai-elements/message";
import { LineActions } from "@/components/line-message";
import { TypedDialogue } from "@/app/(main)/generate/components/typed-dialogue";
import type { useResultsDisplay } from "@/app/(main)/generate/components/results-display/hooks/use-results-display";
import type { GenerationResult } from "@/lib/types";
export const ResultLine = ({
  state,
  result,
  index,
}: {
  state: ReturnType<typeof useResultsDisplay>;
  result: GenerationResult;
  index: number;
}) => {
  const { revealing, favorites, onToggleFavorite, onCopy, results } = state;
  return (
    <article
      className="line-entry"
      key={result.id}
      style={
        revealing
          ? ({
              "--index": index,
            } as React.CSSProperties)
          : undefined
      }
    >
      <Message from="assistant" className="line-message">
        <MessageContent className="line-message-content">
          <TypedDialogue
            text={result.text}
            typing={revealing}
            delay={Math.min(index, 8) * 60 + 80}
          />
        </MessageContent>
        <MessageToolbar className="line-message-toolbar">
          <LineActions
            text={result.text}
            saved={favorites.has(result.id)}
            onSave={() => onToggleFavorite(result)}
            onCopy={onCopy}
          />
          <span className="line-number" aria-hidden="true">
            {String(results.indexOf(result) + 1).padStart(2, "0")}
          </span>
        </MessageToolbar>
      </Message>
    </article>
  );
};
