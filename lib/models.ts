export interface ModelOption {
  id: string;
  label: string;
  description: string;
}

// Keep a local catalog so UI does not break if account-level ATXP offerings change.
// Actual model availability depends on the ATXP gateway/account configuration.
export const MODEL_CATALOG: ModelOption[] = [
  { id: "gpt-4.1", label: "GPT-4.1", description: "Best default for high-quality planning and review language." },
  { id: "openai/gpt-5-nano", label: "GPT-5 Nano", description: "Lower-latency draft mode for fast iteration loops." },
  { id: "meta/llama-3.1-70b-instruct", label: "Llama 3.1 70B", description: "Alternative reasoning profile for comparative demos." }
];

export const DEFAULT_MODEL = process.env.NEXT_PUBLIC_DEFAULT_MODEL || MODEL_CATALOG[0].id;
