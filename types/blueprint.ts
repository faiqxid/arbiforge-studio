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

export interface DeploymentRecord {
  id: string;
  prompt: string;
  selectedModel: string;
  selectedMode: ContractMode;
  blueprint: Blueprint;
  deploymentStatus: string;
  registryStatus: string;
  txHash?: string;
  contractAddress?: string;
  createdAt: string;
}
