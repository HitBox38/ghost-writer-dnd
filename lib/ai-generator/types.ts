import { type ReasoningEffort } from "@/lib/types";
export type ReasoningOptions = {
  reasoning?: Exclude<ReasoningEffort, "provider-default">;
  providerOptions?: Record<
    string,
    Record<
      string,
      | string
      | {
          effort: Exclude<ReasoningEffort, "provider-default">;
        }
    >
  >;
};
