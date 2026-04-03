export interface AgentRegistrationResult {
  status: "mock_registered" | "prepared" | "failed" | "live_registered";
  message: string;
  registryId?: string;
  txHash?: string;
  network?: string;
  explorerUrl?: string;
}
