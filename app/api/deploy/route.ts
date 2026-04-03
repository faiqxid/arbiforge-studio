import { randomUUID } from "node:crypto";
import { createArbitrumClients } from "@/lib/arbitrum";
import { saveDeployment } from "@/lib/storage";
import { deployRequestSchema } from "@/lib/validations";
import type { DeploymentRecord } from "@/types/blueprint";

function mockHash(size = 64) {
  return `0x${Math.random().toString(16).slice(2).padEnd(size, "0")}`;
}

export async function POST(request: Request) {
  const payload = deployRequestSchema.safeParse(await request.json());
  if (!payload.success) {
    return Response.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const { prompt, selectedMode, selectedModel, blueprint } = payload.data;
  const id = randomUUID();
  const clients = createArbitrumClients();

  // MVP-safe path: look realistic while keeping chain execution mocked.
  const deploymentStatus = clients ? "ready_for_real_execution" : "mock_confirmed";
  const txHash = clients ? "0xprepared_real_transaction_not_executed" : mockHash();
  const contractAddress = clients ? "0x0000000000000000000000000000000000000000" : mockHash(40);

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
    network: "arbitrum-sepolia",
    explorerTxUrl: `https://sepolia.arbiscan.io/tx/${txHash}`,
    explorerAddressUrl: `https://sepolia.arbiscan.io/address/${contractAddress}`,
    createdAt: new Date().toISOString()
  };

  await saveDeployment(record);

  return Response.json({
    id,
    deploymentStatus,
    txHash,
    contractAddress,
    network: record.network,
    explorerTxUrl: record.explorerTxUrl,
    explorerAddressUrl: record.explorerAddressUrl
  });
}
