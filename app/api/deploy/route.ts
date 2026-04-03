import { randomUUID } from "node:crypto";
import { createArbitrumClients } from "@/lib/arbitrum";
import { saveDeployment } from "@/lib/storage";
import { deployRequestSchema } from "@/lib/validations";
import type { DeploymentRecord, DeploymentStatus } from "@/types/blueprint";

function mockHash(size = 64) {
  return `0x${Math.random().toString(16).slice(2).padEnd(size, "0")}`;
}

export async function POST(request: Request) {
  let parsedBody: unknown;
  try {
    parsedBody = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const payload = deployRequestSchema.safeParse(parsedBody);
  if (!payload.success) {
    return Response.json({ error: payload.error.flatten() }, { status: 400 });
  }

  const { prompt, selectedMode, selectedModel, blueprint } = payload.data;
  const id = randomUUID();
  const logs: string[] = [];
  const { clients, reason } = createArbitrumClients();

  let deploymentStatus: DeploymentStatus = "mock_confirmed";
  let txHash = mockHash();
  let contractAddress = mockHash(40);

  if (!clients) {
    logs.push("Chain client unavailable. Falling back to mock deployment mode.");
    if (reason) logs.push(reason);
  } else {
    logs.push(`Chain client initialized for ${clients.account.address}.`);
    logs.push("Submitting live Arbitrum Sepolia transaction (0 ETH self-check tx).");

    try {
      const sentHash = await clients.walletClient.sendTransaction({
        account: clients.account,
        to: clients.account.address,
        value: 0n
      });

      txHash = sentHash;
      deploymentStatus = "live_submitted";
      contractAddress = clients.account.address;
      logs.push(`Live tx submitted: ${txHash}`);

      const receipt = await clients.publicClient.waitForTransactionReceipt({ hash: sentHash });
      logs.push(`Receipt confirmed at block ${receipt.blockNumber.toString()} with status ${receipt.status}.`);
    } catch (error) {
      deploymentStatus = "live_failed";
      logs.push(error instanceof Error ? `Live transaction failed: ${error.message}` : "Live transaction failed with unknown error.");
      logs.push("Returning mock-style record for continuity.");
    }
  }

  if (deploymentStatus === "mock_confirmed") {
    logs.push(`Mock tx generated: ${txHash}`);
  }

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
    explorerAddressUrl: record.explorerAddressUrl,
    executionNote:
      deploymentStatus === "live_submitted"
        ? "Live transaction sent on Arbitrum Sepolia."
        : deploymentStatus === "live_failed"
          ? "Live transaction failed. See logs for detail."
          : "Using mock deployment path.",
    logs,
    snapshot: record
  });
}
