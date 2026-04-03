import { buildBlueprint, classifyIntentMode } from "@/lib/planner";
import { blueprintSchema, planRequestSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const payload = planRequestSchema.safeParse(await request.json());
  if (!payload.success) {
    return Response.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const { intent, selectedMode } = payload.data;
  const classifiedMode = classifyIntentMode(intent);
  const mode = selectedMode || classifiedMode;
  const blueprint = buildBlueprint(intent, mode);
  const parsedBlueprint = blueprintSchema.parse(blueprint);

  return Response.json({ blueprint: parsedBlueprint, classifiedMode, modeMismatch: selectedMode !== classifiedMode });
}
