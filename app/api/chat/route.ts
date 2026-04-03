import { streamText } from "ai";
import { atxpModel, hasAtxpConfig } from "@/lib/atxp";
import { planningSystemPrompt } from "@/lib/agent";
import { chatRequestSchema } from "@/lib/validations";

export async function POST(request: Request) {
  if (!hasAtxpConfig) {
    return Response.json({ error: "ATXP_CONNECTION is missing." }, { status: 400 });
  }

  const payload = chatRequestSchema.safeParse(await request.json());
  if (!payload.success) {
    return Response.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const { messages, selectedModel, selectedMode } = payload.data;

  const result = streamText({
    model: atxpModel(selectedModel),
    system: planningSystemPrompt(selectedMode),
    messages
  });

  return result.toDataStreamResponse();
}
