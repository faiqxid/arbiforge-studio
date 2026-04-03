import { createPublicClient, createWalletClient, http } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

export function createArbitrumClients() {
  const rpcUrl = process.env.ARBITRUM_SEPOLIA_RPC_URL;
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY as `0x${string}` | undefined;

  if (!rpcUrl || !privateKey) {
    return null;
  }

  const account = privateKeyToAccount(privateKey);
  const transport = http(rpcUrl);

  return {
    publicClient: createPublicClient({ chain: arbitrumSepolia, transport }),
    walletClient: createWalletClient({ account, chain: arbitrumSepolia, transport }),
    account
  };
}
