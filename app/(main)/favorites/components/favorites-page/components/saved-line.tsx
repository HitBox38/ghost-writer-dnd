"use client";

import { useFavoritesPage } from "@/app/(main)/favorites/components/favorites-page/hooks/use-favorites-page";
import { MessageSquare } from "lucide-react";
import { Message, MessageContent, MessageToolbar } from "@/components/ai-elements/message";
import { LineActions, LineResponse } from "@/components/line-message";
import { copyLine } from "@/lib/clipboard";
import type { FavoriteText } from "@/lib/types";
import { SavedLineDate } from "./saved-line-date";
export const SavedLine = ({
  favorite,
  state,
}: {
  favorite: FavoriteText;
  state: ReturnType<typeof useFavoritesPage>;
}) => {
  const { entries, selected, remove } = state;
  return (
    <article
      key={favorite.id}
      tabIndex={-1}
      ref={(element) => {
        if (element) entries.current.set(favorite.id, element);
        else entries.current.delete(favorite.id);
      }}
      className={`line-entry ${selected === favorite.id ? "highlighted-line" : ""}`}
    >
      <Message from="assistant" className="line-message">
        <div className="saved-line-heading">
          <span className="line-kind">
            {favorite.type === "mockery" ? "Combat quip" : "Catchphrase"}
          </span>
          <SavedLineDate createdAt={favorite.createdAt} />
        </div>
        <MessageContent className="line-message-content">
          <LineResponse text={favorite.text} />
        </MessageContent>
        {favorite.context && (
          <details className="saved-scene">
            <summary>
              <MessageSquare size={13} aria-hidden="true" />
              Original scene
            </summary>
            <p>{favorite.context}</p>
          </details>
        )}
        <MessageToolbar className="line-message-toolbar">
          <LineActions
            text={favorite.text}
            saved
            savedLabel="Unsave line"
            onSave={() => remove(favorite)}
            onCopy={copyLine}
          />
        </MessageToolbar>
      </Message>
    </article>
  );
};
