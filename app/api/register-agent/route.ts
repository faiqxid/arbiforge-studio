import { registerAgentIdentityLive, registerAgentIdentityStub } from "@/lib/registry";
import { updateDeployment } from "@/lib/storage";
import { registerAgentSchema } from "@/lib/validations";

export async function POST(request: Request) {
  let parsedBody: unknown;
  try {
    parsedBody = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const payload = registerAgentSchema.safeParse(parsedBody);
  if (!payload.success) {
    return Response.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const logs: string[] = [];
  logs.push(`Starting agent identity registration for mode ${payload.data.mode}.`);

  const registryAddress = process.env.REGISTRY_CONTRACT_ADDRESS as `0x${string}` | undefined;
  const metadataURI = `arbiforge://${payload.data.mode}/${encodeURIComponent(payload.data.title)}`;

  const result = registryAddress
    ? await registerAgentIdentityLive({
        title: payload.data.title,
        metadataURI,
        registryAddress
      })
    : await registerAgentIdentityStub(payload.data.title);

  logs.push(registryAddress ? "Using live registry contract write." : "Using demo registry stub (no real contract call yet).");
  logs.push(`Registry status: ${result.status}`);
  if (result.registryId) logs.push(`Registry ID: ${result.registryId}`);
  if (result.txHash) logs.push(`Tx Hash: ${result.txHash}`);

  if (payload.data.deploymentId !== "pending") {
    await updateDeployment(payload.data.deploymentId, {
      registryStatus:
        result.status === "live_registered"
          ? "live_registered"
          : result.status === "mock_registered"
            ? "mock_registered"
            : "not_registered"
    });
    logs.push(`Linked registry result to deployment ${payload.data.deploymentId}.`);
  } else {
    logs.push("Deployment ID is pending; skipped persistence update.");
  }

  return Response.json({ ...result, logs });
}
