import type { AgentRegistrationResult } from "@/types/agent";

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
