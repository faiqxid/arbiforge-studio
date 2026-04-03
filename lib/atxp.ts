import { createOpenAI } from "@ai-sdk/openai";
import { DEFAULT_MODEL } from "@/lib/models";

const atxpBaseUrl = process.env.ATXP_BASE_URL ?? "https://llm.atxp.ai/v1";

export const hasAtxpConfig = Boolean(process.env.ATXP_CONNECTION);

export const atxp = createOpenAI({
  apiKey: process.env.ATXP_CONNECTION,
  baseURL: atxpBaseUrl
});

export function atxpModel(modelName?: string) {
  // This is where Studio model picker selection maps to ATXP gateway model routing.
  return atxp(modelName || DEFAULT_MODEL);
}
