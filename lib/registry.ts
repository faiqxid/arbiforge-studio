import { keccak256, stringToBytes } from "viem";
import { createArbitrumClients } from "@/lib/arbitrum";
import type { AgentRegistrationResult } from "@/types/agent";

const REGISTRY_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "agentId", type: "bytes32" },
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: false, internalType: "string", name: "metadataURI", type: "string" }
    ],
    name: "AgentRegistered",
    type: "event"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "agentId", type: "bytes32" },
      { internalType: "string", name: "metadataURI", type: "string" }
    ],
    name: "registerAgent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;

function mockTxHash() {
  return `0x${Math.random().toString(16).slice(2).padEnd(64, "0")}`;
}

export async function registerAgentIdentityStub(title: string): Promise<AgentRegistrationResult> {
  const txHash = mockTxHash();

  return {
    status: "mock_registered",
    message: `Identity staged for ${title} on Arbitrum Sepolia demo registry.`,
    registryId: `agent_demo_${Date.now().toString(36)}`,
    txHash,
    network: "arbitrum-sepolia",
    explorerUrl: `https://sepolia.arbiscan.io/tx/${txHash}`
  };
}

export async function registerAgentIdentityLive(params: {
  title: string;
  metadataURI: string;
  registryAddress: `0x${string}`;
}): Promise<AgentRegistrationResult> {
  const { clients, reason } = createArbitrumClients();
  if (!clients) {
    return {
      status: "failed",
      message: reason ?? "Chain clients unavailable for live registry write."
    };
  }

  const agentId = keccak256(stringToBytes(`${params.title}:${Date.now()}`));

  try {
    const txHash = await clients.walletClient.writeContract({
      account: clients.account,
      address: params.registryAddress,
      abi: REGISTRY_ABI,
      functionName: "registerAgent",
      args: [agentId, params.metadataURI],
      chain: clients.walletClient.chain
    });

    const receipt = await clients.publicClient.waitForTransactionReceipt({ hash: txHash });

    return {
      status: receipt.status === "success" ? "live_registered" : "failed",
      message:
        receipt.status === "success"
          ? `Agent identity registered onchain at block ${receipt.blockNumber.toString()}.`
          : "Onchain registry transaction reverted.",
      registryId: agentId,
      txHash,
      network: "arbitrum-sepolia",
      explorerUrl: `https://sepolia.arbiscan.io/tx/${txHash}`
    };
  } catch (error) {
    return {
      status: "failed",
      message: error instanceof Error ? `Live registry write failed: ${error.message}` : "Live registry write failed."
    };
  }
}
