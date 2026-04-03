import { createOpenAI } from "@ai-sdk/openai";
import { DEFAULT_MODEL } from "@/lib/models";

const DEFAULT_ATXP_BASE_URL = "https://llm.atxp.ai/v1";

export function getAtxpConfig() {
  return {
    apiKey: process.env.ATXP_CONNECTION,
    baseURL: process.env.ATXP_BASE_URL ?? DEFAULT_ATXP_BASE_URL
  };
}

export function hasAtxpConfig() {
  return Boolean(process.env.ATXP_CONNECTION);
}

export function atxpModel(modelName?: string) {
  const { apiKey, baseURL } = getAtxpConfig();

  if (!apiKey) {
    throw new Error("ATXP_CONNECTION is missing.");
  }

  // This is where Studio model picker selection maps to ATXP gateway model routing.
  const atxp = createOpenAI({ apiKey, baseURL });
  return atxp(modelName || DEFAULT_MODEL);
}
