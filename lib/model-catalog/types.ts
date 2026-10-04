export type ModelOption = {
  value: string;
  label: string;
};
export type ModelRecord = {
  id?: unknown;
  name?: unknown;
  display_name?: unknown;
  displayName?: unknown;
  supportedGenerationMethods?: unknown;
  architecture?: {
    input_modalities?: unknown;
    output_modalities?: unknown;
  };
  input_modalities?: unknown;
  output_modalities?: unknown;
  active?: unknown;
  archived?: unknown;
  is_deprecated?: unknown;
  capabilities?: {
    completion_chat?: unknown;
    vision?: unknown;
  };
};
