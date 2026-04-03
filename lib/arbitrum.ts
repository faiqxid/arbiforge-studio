import { createPublicClient, createWalletClient, http } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

export interface ArbitrumClientResult {
  clients: {
    publicClient: ReturnType<typeof createPublicClient>;
    walletClient: ReturnType<typeof createWalletClient>;
    account: ReturnType<typeof privateKeyToAccount>;
  } | null;
  reason?: string;
}

function normalizePrivateKey(value: string): `0x${string}` | null {
  const trimmed = value.trim();
  const normalized = trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`;

  if (!/^0x[a-fA-F0-9]{64}$/.test(normalized)) {
    return null;
  }

  return normalized as `0x${string}`;
}

export function createArbitrumClients(): ArbitrumClientResult {
  const rpcUrl = process.env.ARBITRUM_SEPOLIA_RPC_URL?.trim();
  const rawPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;

  if (!rpcUrl || !rawPrivateKey) {
    return { clients: null, reason: "Missing ARBITRUM_SEPOLIA_RPC_URL or DEPLOYER_PRIVATE_KEY." };
  }

  const privateKey = normalizePrivateKey(rawPrivateKey);
  if (!privateKey) {
    return { clients: null, reason: "DEPLOYER_PRIVATE_KEY must be 32-byte hex (with or without 0x)." };
  }

  try {
    const account = privateKeyToAccount(privateKey);
    const transport = http(rpcUrl);

    return {
      clients: {
        publicClient: createPublicClient({ chain: arbitrumSepolia, transport }),
        walletClient: createWalletClient({ account, chain: arbitrumSepolia, transport }),
        account
      }
    };
  } catch {
    return { clients: null, reason: "Failed to initialize Arbitrum clients from provided credentials." };
  }
}
