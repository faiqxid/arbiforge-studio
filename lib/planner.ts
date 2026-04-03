import type { Blueprint, ContractMode } from "@/types/blueprint";

export interface ScopeAssessment {
  classifiedMode: ContractMode;
  resolvedMode: ContractMode;
  redirected: boolean;
  reason: string;
}

const MODE_KEYWORDS: Record<ContractMode, RegExp[]> = {
  escrow: [/escrow/i, /payer/i, /payee/i, /milestone/i, /release/i, /dispute/i],
  treasury_timelock: [/timelock/i, /treasury/i, /governance/i, /proposer/i, /executor/i, /delay/i],
  whitelist_vault: [/whitelist/i, /vault/i, /allowlist/i, /withdraw/i, /pause/i, /admin/i]
};

const OUT_OF_SCOPE_KEYWORDS = [/nft marketplace/i, /dex/i, /lending/i, /bridge/i, /game/i, /token launch/i, /oracle network/i];

function extractMatches(intent: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = intent.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }
  return null;
}

export function normalizeIntent(intent: string): string {
  return intent.trim().replace(/\s+/g, " ").slice(0, 4000);
}

export function classifyIntentMode(intent: string): ContractMode {
  const scores: Record<ContractMode, number> = {
    escrow: 0,
    treasury_timelock: 0,
    whitelist_vault: 0
  };

  for (const mode of Object.keys(MODE_KEYWORDS) as ContractMode[]) {
    for (const regex of MODE_KEYWORDS[mode]) {
      if (regex.test(intent)) {
        scores[mode] += 1;
      }
    }
  }

  const ranked = (Object.entries(scores) as Array<[ContractMode, number]>).sort((a, b) => b[1] - a[1]);
  return ranked[0][1] > 0 ? ranked[0][0] : "whitelist_vault";
}

export function assessIntentScope(intent: string, selectedMode: ContractMode): ScopeAssessment {
  const normalized = normalizeIntent(intent);
  const classifiedMode = classifyIntentMode(normalized);
  const outOfScope = OUT_OF_SCOPE_KEYWORDS.some((regex) => regex.test(normalized));

  if (outOfScope) {
    return {
      classifiedMode,
      resolvedMode: classifiedMode,
      redirected: true,
      reason: `Request appears outside supported scope. Redirected to closest supported mode: ${classifiedMode}.`
    };
  }

  if (selectedMode !== classifiedMode) {
    return {
      classifiedMode,
      resolvedMode: selectedMode,
      redirected: false,
      reason: `Intent signals ${classifiedMode}; keeping selected mode ${selectedMode} for deterministic planning.`
    };
  }

  return {
    classifiedMode,
    resolvedMode: selectedMode,
    redirected: false,
    reason: "Intent is within supported scope."
  };
}

function uniq(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

export function buildBlueprint(intent: string, mode: ContractMode): Blueprint {
  const cleanedIntent = normalizeIntent(intent);

  const base: Blueprint = {
    mode,
    title: "",
    summary: "",
    actors: [],
    assets: [],
    rules: [],
    permissions: [],
    safetyChecks: [],
    deploymentNotes: [
      "Review blueprint details and confirm before deployment.",
      "Target network: Arbitrum Sepolia.",
      "Deployment and registry actions require explicit API confirmation."
    ],
    missingParameters: []
  };

  if (mode === "escrow") {
    const payer = extractMatches(cleanedIntent, [/payer[:\s]+([^,.;]+)/i, /from\s+([^,.;]+)\s+to/i]);
    const payee = extractMatches(cleanedIntent, [/payee[:\s]+([^,.;]+)/i, /to\s+([^,.;]+)\s+(?:if|when|after)/i]);
    const asset = extractMatches(cleanedIntent, [/asset[:\s]+([^,.;]+)/i, /(\d+\s*(?:USDC|USDT|ETH|ARB))/i]) || "Unspecified ERC-20";

    return {
      ...base,
      title: "Escrow Plan",
      summary: "Conditional transfer between payer and payee with release, cancel, and dispute controls.",
      actors: uniq([payer ? `Payer: ${payer}` : "Payer: TBD", payee ? `Payee: ${payee}` : "Payee: TBD", "Arbiter/Dispute Resolver: TBD"]),
      assets: uniq([asset]),
      rules: uniq([
        "Release condition must be objective and verifiable.",
        "Cancel path requires timeout and role constraints.",
        "Dispute flow must define resolver authority and finality."
      ]),
      permissions: uniq([
        "Only payer can fund escrow.",
        "Release callable only when release condition passes.",
        "Emergency pause authority must be restricted and logged."
      ]),
      safetyChecks: uniq([
        "Validate payer/payee addresses on Arbitrum Sepolia.",
        "Document timeout windows for release and cancellation.",
        "Block unilateral withdrawal paths outside explicit rules."
      ]),
      missingParameters: uniq([payer ? "" : "payer address", payee ? "" : "payee address", "release condition", "cancel timeout", "dispute resolver"])
    };
  }

  if (mode === "treasury_timelock") {
    const delay = extractMatches(cleanedIntent, [/delay[:\s]+([^,.;]+)/i, /(\d+\s*(?:hours|days|minutes))/i]);

    return {
      ...base,
      title: "Treasury Timelock Plan",
      summary: "Role-separated treasury control with enforced execution delay and emergency safeguards.",
      actors: uniq(["Admin: TBD", "Proposer: TBD", "Executor: TBD"]),
      assets: uniq(["Treasury-controlled ERC-20/ETH balances"]),
      rules: uniq([
        "Privileged treasury actions must queue through timelock.",
        "Minimum delay applies to every queued action.",
        "Allowed target contracts/selectors should be explicitly listed."
      ]),
      permissions: uniq([
        "Admin changes must route through timelock governance.",
        "Proposer queues actions; executor executes after delay.",
        "Emergency override requires strict multi-party control."
      ]),
      safetyChecks: uniq([
        "Use delay window that enables meaningful review.",
        "Restrict callable targets and function selectors.",
        "Avoid overlapping proposer/executor privileges in production."
      ]),
      missingParameters: uniq([delay ? "" : "timelock delay", "admin address", "proposer/executor addresses", "allowed action list"])
    };
  }

  return {
    ...base,
    title: "Whitelist Vault Plan",
    summary: "Whitelist-gated vault for controlled asset access with pause and governance protections.",
    actors: uniq(["Owner/Admin: TBD", "Whitelist Manager: TBD", "Authorized Withdrawers: TBD"]),
    assets: uniq(["Vault deposit asset: TBD"]),
    rules: uniq([
      "Restricted operations require whitelist membership.",
      "Withdrawal limits and destinations must be explicit.",
      "Pause/unpause controls must be clearly assigned."
    ]),
    permissions: uniq([
      "Owner transfer should use a two-step handoff.",
      "Whitelist manager can add/remove accounts under policy.",
      "Pause authority should be separated from daily operations."
    ]),
    safetyChecks: uniq([
      "Track whitelist changes with auditable logs.",
      "Apply per-window withdrawal limits where possible.",
      "Document emergency recovery procedure for compromised keys."
    ]),
    missingParameters: uniq(["owner/admin address", "deposit asset", "whitelist policy", "withdraw permissions", "pause logic"])
  };
}
