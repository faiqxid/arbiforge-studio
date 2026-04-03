import type { AgentRegistrationResult } from "@/types/agent";

export async function registerAgentIdentityStub(title: string): Promise<AgentRegistrationResult> {
  return {
    status: "mock_registered",
    message: `Mock identity registered for ${title}. Replace with real registry contract call later.`,
    registryId: `agent_${Date.now().toString(36)}`,
    txHash: `0xmock${Math.random().toString(16).slice(2).padEnd(60, "0")}`
  };
}
