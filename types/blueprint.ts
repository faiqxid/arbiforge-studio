export type ContractMode = "escrow" | "treasury_timelock" | "whitelist_vault";

export interface Blueprint {
  mode: ContractMode;
  title: string;
  summary: string;
  actors: string[];
  assets: string[];
  rules: string[];
  permissions: string[];
  safetyChecks: string[];
  deploymentNotes: string[];
  missingParameters: string[];
}

export type DeploymentStatus = "mock_confirmed" | "ready_for_real_execution" | "live_submitted" | "live_failed";

export interface DeploymentRecord {
  id: string;
  prompt: string;
  selectedModel: string;
  selectedMode: ContractMode;
  blueprint: Blueprint;
  deploymentStatus: DeploymentStatus;
  registryStatus: "not_registered" | "mock_registered";
  txHash?: string;
  contractAddress?: string;
  network: "arbitrum-sepolia";
  explorerTxUrl?: string;
  explorerAddressUrl?: string;
  createdAt: string;
}
