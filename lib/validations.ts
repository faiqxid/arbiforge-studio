import { z } from "zod";

export const modeSchema = z.enum(["escrow", "treasury_timelock", "whitelist_vault"]);

export const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().trim().min(1).max(4000)
});

export const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(30),
  selectedModel: z.string().trim().min(2).max(120).regex(/^[\w./:-]+$/, "selectedModel contains invalid characters"),
  selectedMode: modeSchema
});

export const planRequestSchema = z.object({
  intent: z.string().trim().min(10).max(4000),
  selectedMode: modeSchema
});

const listField = z.array(z.string().trim().min(1).max(280)).min(1).max(20);

export const blueprintSchema = z.object({
  mode: modeSchema,
  title: z.string().trim().min(3).max(120),
  summary: z.string().trim().min(20).max(500),
  actors: listField,
  assets: listField,
  rules: listField,
  permissions: listField,
  safetyChecks: listField,
  deploymentNotes: listField,
  missingParameters: z.array(z.string().trim().min(1).max(120)).max(20)
});



export const planResponseSchema = z.object({
  blueprint: blueprintSchema,
  classifiedMode: modeSchema,
  selectedMode: modeSchema,
  modeMismatch: z.boolean(),
  redirected: z.boolean(),
  reasoning: z.string().min(1),
  safetyBanner: z.string().min(1)
});

export const deployRequestSchema = z.object({
  prompt: z.string().trim().min(1).max(4000),
  selectedModel: z.string().trim().min(2).max(120),
  selectedMode: modeSchema,
  blueprint: blueprintSchema
});

export const registerAgentSchema = z.object({
  deploymentId: z.string().trim().min(1).max(120),
  mode: modeSchema,
  title: z.string().trim().min(1).max(120)
});

export function sanitizeMessages(messages: z.infer<typeof messageSchema>[]) {
  return messages.map((message) => ({
    role: message.role,
    content: message.content.trim().slice(0, 4000)
  }));
}
