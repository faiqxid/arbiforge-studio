import type { ContractMode } from "@/types/blueprint";

export const MODE_DETAILS: Record<ContractMode, { title: string; description: string; prompts: string[] }> = {
  escrow: {
    title: "Escrow",
    description: "Conditional release between payer and payee with dispute and emergency handling.",
    prompts: ["Who funds the escrow and who receives assets?", "What release condition verifies completion?"]
  },
  treasury_timelock: {
    title: "Treasury Timelock",
    description: "Governed treasury actions delayed by timelock with clearly separated proposer/executor roles.",
    prompts: ["What minimum delay is required?", "Which actions are explicitly allowed?"]
  },
  whitelist_vault: {
    title: "Whitelist Vault",
    description: "Asset vault with controlled deposits/withdrawals restricted by whitelist rules.",
    prompts: ["Who controls whitelist updates?", "What pause or emergency path is needed?"]
  }
};
