import { streamText } from "ai";
import { atxpModel, hasAtxpConfig } from "@/lib/atxp";
import { planningSystemPrompt, unsupportedScopeMessage } from "@/lib/agent";
import { DEFAULT_MODEL } from "@/lib/models";
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

  const baseSystem = planningSystemPrompt(effectiveMode, scope.classifiedMode);

  const tryStream = (modelName: string, systemPrompt: string) =>
    streamText({
      model: atxpModel(modelName),
      system: systemPrompt,
      messages: scopedMessages,
      temperature: 0,
      maxTokens: 700
    });

  try {
    const primary = tryStream(selectedModel, baseSystem);
    return primary.toDataStreamResponse();
  } catch (error) {
    if (selectedModel !== DEFAULT_MODEL) {
      try {
        const fallback = tryStream(
          DEFAULT_MODEL,
          `${baseSystem}\n\nNote: requested model \"${selectedModel}\" was unavailable; fallback to \"${DEFAULT_MODEL}\".`
        );
        return fallback.toDataStreamResponse();
      } catch (fallbackError) {
        return Response.json(
          {
            error:
              fallbackError instanceof Error
                ? fallbackError.message
                : "Selected model and fallback model both failed to initialize on ATXP."
          },
          { status: 500 }
        );
      }
    }

    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to initialize ATXP model."
      },
      { status: 500 }
    );
  }
}
