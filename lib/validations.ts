import { z } from "zod";

export const modeSchema = z.enum(["escrow", "treasury_timelock", "whitelist_vault"]);

export const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1)
});

export const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1),
  selectedModel: z.string().min(1),
  selectedMode: modeSchema
});

export const planRequestSchema = z.object({
  intent: z.string().min(10),
  selectedMode: modeSchema
});

export const blueprintSchema = z.object({
  mode: modeSchema,
  title: z.string(),
  summary: z.string(),
  actors: z.array(z.string()),
  assets: z.array(z.string()),
  rules: z.array(z.string()),
  permissions: z.array(z.string()),
  safetyChecks: z.array(z.string()),
  deploymentNotes: z.array(z.string()),
  missingParameters: z.array(z.string())
});

export const deployRequestSchema = z.object({
  prompt: z.string().min(1),
  selectedModel: z.string().min(1),
  selectedMode: modeSchema,
  blueprint: blueprintSchema
});

export const registerAgentSchema = z.object({
  deploymentId: z.string().min(1),
  mode: modeSchema,
  title: z.string().min(1)
});
