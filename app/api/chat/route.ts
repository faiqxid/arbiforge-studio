import { streamText } from "ai";
import { atxpModel, hasAtxpConfig } from "@/lib/atxp";
import { planningSystemPrompt, unsupportedScopeMessage } from "@/lib/agent";
import { assessIntentScope, normalizeIntent } from "@/lib/planner";
import { chatRequestSchema, sanitizeMessages } from "@/lib/validations";

function latestUserMessage(messages: Array<{ role: "user" | "assistant" | "system"; content: string }>) {
  const userMessages = messages.filter((message) => message.role === "user");
  return userMessages[userMessages.length - 1]?.content ?? "";
}

export async function POST(request: Request) {
  if (!hasAtxpConfig()) {
    return Response.json({ error: "ATXP_CONNECTION is missing." }, { status: 400 });
  }

  let parsedBody: unknown;
  try {
    parsedBody = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const payload = chatRequestSchema.safeParse(parsedBody);
  if (!payload.success) {
    return Response.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const { messages, selectedModel, selectedMode } = payload.data;
  const cleanedMessages = sanitizeMessages(messages);
  const userIntent = normalizeIntent(latestUserMessage(cleanedMessages));
  const scope = assessIntentScope(userIntent, selectedMode);

  const effectiveMode = scope.resolvedMode;

  const scopedMessages = scope.redirected
    ? [...cleanedMessages, { role: "system" as const, content: unsupportedScopeMessage(scope.classifiedMode) }]
    : cleanedMessages;

  try {
    const result = streamText({
      model: atxpModel(selectedModel),
      system: planningSystemPrompt(effectiveMode, scope.classifiedMode),
      messages: scopedMessages,
      temperature: 0,
      maxTokens: 700
    });

    return result.toDataStreamResponse();
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to initialize ATXP model."
      },
      { status: 500 }
    );
  }
}
