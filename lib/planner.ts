import type { Blueprint, ContractMode } from "@/types/blueprint";

function extractMatches(intent: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = intent.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }
  return null;
}

export function classifyIntentMode(intent: string): ContractMode {
  const normalized = intent.toLowerCase();
  if (/(escrow|milestone|release condition|payer|payee)/.test(normalized)) return "escrow";
  if (/(timelock|governance|treasury|proposer|executor|delay)/.test(normalized)) return "treasury_timelock";
  return "whitelist_vault";
}

export function buildBlueprint(intent: string, mode: ContractMode): Blueprint {
  const base: Blueprint = {
    mode,
    title: "",
    summary: "",
    actors: [],
    assets: [],
    rules: [],
    permissions: [],
    safetyChecks: [],
    deploymentNotes: ["Review blueprint details and confirm before deployment.", "Target network: Arbitrum Sepolia."],
    missingParameters: []
  };

  if (mode === "escrow") {
    const payer = extractMatches(intent, [/payer[:\s]+([^,.;]+)/i, /from\s+([^,.;]+)\s+to/i]);
    const payee = extractMatches(intent, [/payee[:\s]+([^,.;]+)/i, /to\s+([^,.;]+)\s+(?:if|when|after)/i]);
    const asset = extractMatches(intent, [/asset[:\s]+([^,.;]+)/i, /(\d+\s*(?:USDC|USDT|ETH|ARB))/i]) || "Unspecified ERC-20";

    return {
      ...base,
      title: "Escrow Plan",
      summary: "Conditional value transfer with payer/payee controls and explicit release/cancel paths.",
      actors: [payer ? `Payer: ${payer}` : "Payer: TBD", payee ? `Payee: ${payee}` : "Payee: TBD", "Arbiter/Dispute Resolver: TBD"],
      assets: [asset],
      rules: ["Release condition must be machine-checkable or operator-approved.", "Cancel path needs timeout and ownership constraints.", "Dispute path must define authorized resolver and decision finality."],
      permissions: ["Only payer can fund escrow.", "Release callable only when condition met.", "Emergency pause must be restricted and auditable."],
      safetyChecks: ["Verify payer/payee addresses on Arbitrum Sepolia.", "Define objective release condition and timeout windows.", "Prevent unilateral withdrawal after deposit except allowed cancel path."],
      missingParameters: [payer ? "" : "payer address", payee ? "" : "payee address", "release condition", "cancel timeout", "dispute resolver"].filter(Boolean)
    };
  }

  if (mode === "treasury_timelock") {
    const delay = extractMatches(intent, [/delay[:\s]+([^,.;]+)/i, /(\d+\s*(?:hours|days|minutes))/i]);
    return {
      ...base,
      title: "Treasury Timelock Plan",
      summary: "Delayed treasury execution with role-separated governance and emergency safeguards.",
      actors: ["Admin: TBD", "Proposer: TBD", "Executor: TBD"],
      assets: ["Treasury-controlled ERC-20/ETH balances"],
      rules: ["All privileged actions queue through timelock.", "Minimum delay enforced on every proposal.", "Allowed action list should be explicit and narrow."],
      permissions: ["Admin can update roles through timelock only.", "Proposer queues actions; executor executes after delay.", "Emergency action must be rate-limited or multisig-protected."],
      safetyChecks: ["Set delay long enough for community review.", "Limit callable targets and function selectors.", "Prevent role overlap for proposer/executor in production."],
      missingParameters: [delay ? "" : "timelock delay", "admin address", "proposer/executor addresses", "allowed action list"].filter(Boolean)
    };
  }

  return {
    ...base,
    title: "Whitelist Vault Plan",
    summary: "Whitelist-gated vault for deposits and controlled withdrawals with pause protections.",
    actors: ["Owner/Admin: TBD", "Whitelist Manager: TBD", "Authorized Withdrawers: TBD"],
    assets: ["Vault deposit asset: TBD"],
    rules: ["Only whitelisted addresses can perform restricted operations.", "Withdrawal limits and destinations must be explicit.", "Pause and unpause authority must be clearly assigned."],
    permissions: ["Owner can transfer admin with two-step process.", "Whitelist manager can add/remove accounts.", "Pause authority should be separate from daily operations."],
    safetyChecks: ["Define whitelist governance and audit logs.", "Set max withdrawal per window where possible.", "Document emergency recovery process for compromised keys."],
    missingParameters: ["owner/admin address", "deposit asset", "whitelist policy", "withdraw permissions", "pause logic"]
  };
}
