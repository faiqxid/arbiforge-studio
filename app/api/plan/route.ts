import { assessIntentScope, buildBlueprint, normalizeIntent } from "@/lib/planner";
import { blueprintSchema, planRequestSchema, planResponseSchema } from "@/lib/validations";

export async function POST(request: Request) {
  let parsedBody: unknown;
  try {
    parsedBody = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const payload = planRequestSchema.safeParse(parsedBody);
  if (!payload.success) {
    return Response.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const intent = normalizeIntent(payload.data.intent);
  const { selectedMode } = payload.data;

  const scope = assessIntentScope(intent, selectedMode);
  const blueprint = buildBlueprint(intent, scope.resolvedMode);
  const parsedBlueprint = blueprintSchema.parse(blueprint);

  const response = planResponseSchema.parse({
    blueprint: parsedBlueprint,
    classifiedMode: scope.classifiedMode,
    selectedMode: scope.resolvedMode,
    modeMismatch: scope.resolvedMode !== scope.classifiedMode,
    redirected: scope.redirected,
    reasoning: scope.reason,
    safetyBanner: "Review extracted parameters and safety assumptions before any deployment action."
  });

  return Response.json(response);
}
