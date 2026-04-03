import { registerAgentIdentityStub } from "@/lib/registry";
import { registerAgentSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const payload = registerAgentSchema.safeParse(await request.json());
  if (!payload.success) {
    return Response.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const result = await registerAgentIdentityStub(payload.data.title);
  return Response.json(result);
}
