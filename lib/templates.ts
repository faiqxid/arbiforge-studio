import type { ContractMode } from "@/types/blueprint";

export interface ModeTemplate {
  title: string;
  description: string;
  prompts: string[];
  sampleIntent: string;
}

export const MODE_DETAILS: Record<ContractMode, ModeTemplate> = {
  escrow: {
    title: "Escrow",
    description: "Conditional release between payer and payee with dispute and emergency handling.",
    prompts: ["Who funds the escrow and who receives assets?", "What release condition verifies completion?"],
    sampleIntent:
      "Create an escrow for 25,000 USDC where 0xPAYER deposits funds and 0xPAYEE receives payment after milestone proof is approved by a resolver within 7 days, otherwise payer can cancel after 14 days."
  },
  treasury_timelock: {
    title: "Treasury Timelock",
    description: "Governed treasury actions delayed by timelock with clearly separated proposer/executor roles.",
    prompts: ["What minimum delay is required?", "Which actions are explicitly allowed?"],
    sampleIntent:
      "Set up an Arbitrum treasury timelock with a 48-hour delay, proposer role for governance multisig, executor role for operations bot, and only allow token transfers and parameter updates through queued actions."
  },
  whitelist_vault: {
    title: "Whitelist Vault",
    description: "Asset vault with controlled deposits/withdrawals restricted by whitelist rules.",
    prompts: ["Who controls whitelist updates?", "What pause or emergency path is needed?"],
    sampleIntent:
      "Design a whitelist vault for ARB deposits where only approved OTC counterparties can withdraw to pre-approved addresses, with owner pause control and daily withdrawal cap rules."
  }
};
