import type { CSSProperties } from "react";

export const DraftLines = ({ drafts, layout }: { drafts: number; layout: string }) => (
  <div
    className={`line-collection draft-collection ${layout === "list" ? "list-layout" : ""}`}
    aria-hidden="true"
  >
    {Array.from({ length: drafts }, (_, index) => (
      <div className="draft-entry" key={index} style={{ "--index": index } as CSSProperties}>
        <span className="draft-bar" />
        <span className="draft-bar" />
        <span className="draft-bar" />
      </div>
    ))}
  </div>
);
