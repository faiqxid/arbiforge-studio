export async function GET() {
  return Response.json({
    hasAtxpConnection: Boolean(process.env.ATXP_CONNECTION),
    hasChainConfig: Boolean(process.env.ARBITRUM_SEPOLIA_RPC_URL && process.env.DEPLOYER_PRIVATE_KEY)
  });
}
