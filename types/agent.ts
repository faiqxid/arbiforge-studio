export interface AgentRegistrationResult {
  status: "mock_registered" | "prepared" | "failed";
  message: string;
  registryId?: string;
  txHash?: string;
  network?: string;
  explorerUrl?: string;
}
