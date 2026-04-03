export interface ModelOption {
  id: string;
  label: string;
  description: string;
}

// Model catalog is local so the UI remains stable even if gateway inventory changes.
// Exact model availability depends on ATXP account and gateway configuration.
export const MODEL_CATALOG: ModelOption[] = [
  { id: "gpt-4.1", label: "GPT-4.1", description: "Balanced planning quality and speed." },
  { id: "openai/gpt-5-nano", label: "GPT-5 Nano", description: "Fast and lightweight for iterative drafting." },
  { id: "anthropic/claude-sonnet-placeholder", label: "Claude-like Placeholder", description: "Placeholder for ATXP-enabled model routing." }
];

export const DEFAULT_MODEL = process.env.NEXT_PUBLIC_DEFAULT_MODEL || MODEL_CATALOG[0].id;
