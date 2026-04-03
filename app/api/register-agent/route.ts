import { registerAgentIdentityStub } from "@/lib/registry";
import { updateDeployment } from "@/lib/storage";
import { registerAgentSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const payload = registerAgentSchema.safeParse(await request.json());
  if (!payload.success) {
    return Response.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const result = await registerAgentIdentityStub(payload.data.title);

  if (payload.data.deploymentId !== "pending") {
    await updateDeployment(payload.data.deploymentId, { registryStatus: "mock_registered" });
  }

  return Response.json(result);
}
