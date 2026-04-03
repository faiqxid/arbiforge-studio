export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function isChainEnvReady() {
  return Boolean(process.env.ARBITRUM_SEPOLIA_RPC_URL && process.env.DEPLOYER_PRIVATE_KEY);
}
