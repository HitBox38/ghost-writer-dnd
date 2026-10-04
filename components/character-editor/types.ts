export type PendingLeave =
  | {
      kind: "navigate";
      href: string;
    }
  | {
      kind: "reload";
    };
