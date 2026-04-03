import { randomUUID } from "node:crypto";
import { createArbitrumClients } from "@/lib/arbitrum";
import { saveDeployment } from "@/lib/storage";
import { deployRequestSchema } from "@/lib/validations";
import type { DeploymentRecord } from "@/types/blueprint";

export async function POST(request: Request) {
  const payload = deployRequestSchema.safeParse(await request.json());
  if (!payload.success) {
    return Response.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const { prompt, selectedMode, selectedModel, blueprint } = payload.data;
  const id = randomUUID();
  const clients = createArbitrumClients();

  // MVP-safe path: mock until real contract factories/ABIs are wired.
  const deploymentStatus = clients ? "prepared_for_real_deploy" : "mock_deployed";
  const txHash = clients
    ? "0xprepared_real_transaction_not_executed"
    : `0xmock${Math.random().toString(16).slice(2).padEnd(60, "0")}`;
  const contractAddress = clients
    ? "0x0000000000000000000000000000000000000000"
    : `0x${Math.random().toString(16).slice(2).padEnd(40, "0")}`;

  const record: DeploymentRecord = {
    id,
    prompt,
    selectedModel,
    selectedMode,
    blueprint,
    deploymentStatus,
    registryStatus: "not_registered",
    txHash,
    contractAddress,
    createdAt: new Date().toISOString()
  };

  await saveDeployment(record);

  return Response.json({ id, deploymentStatus, txHash, contractAddress });
}
