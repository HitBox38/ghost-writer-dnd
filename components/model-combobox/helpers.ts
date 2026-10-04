import type { ModelCatalogStatus } from "./types";

export const getModelCatalogMessage = ({
  hasApiKey,
  status,
  requiresPdf,
  modelCount,
}: {
  hasApiKey: boolean;
  status: ModelCatalogStatus;
  requiresPdf: boolean;
  modelCount: number;
}) => {
  if (!hasApiKey) return "Connect this provider to browse models.";
  if (status === "loading" || status === "idle") return "Loading models…";
  if (status === "error") return "Couldn't load models. Your saved model is still selected.";
  if (status === "missing") {
    return requiresPdf
      ? "Saved model can't read the attached PDF. Choose a compatible model."
      : "Saved model is no longer in the catalog. Choose an available model.";
  }
  if (modelCount === 0) {
    return requiresPdf
      ? "No text models with inline PDF support are available for this key."
      : "No text models are available for this key.";
  }
  return requiresPdf ? "Showing text models that accept PDFs." : "";
};
