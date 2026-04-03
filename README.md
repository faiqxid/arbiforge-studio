# ArbiForge Studio

ArbiForge Studio is a Vercel-ready MVP for the Arbitrum agent challenge. It converts natural-language onchain intent into a constrained, reviewable deployment blueprint for three audited-style contract modes:

- Escrow
- Treasury Timelock
- Whitelist Vault

The app is intentionally **not** a generic contract generator. It focuses on structured planning, explicit safety assumptions, and confirmation-gated execution prep.

## Why this matters for Arbitrum

Arbitrum teams often need faster intent-to-execution workflows without sacrificing controls. ArbiForge Studio provides:

- constrained planning scope for predictable outputs
- risk-first summaries before execution
- Arbitrum Sepolia deployment preparation path
- agent identity registration stub compatible with future registry contract integration

## Architecture

- **Frontend**: Next.js 15 App Router + TypeScript + Tailwind
- **AI**: Vercel AI SDK using ATXP OpenAI-compatible gateway only
- **Validation**: Zod schemas for API payloads and blueprint shape
- **EVM integration**: viem client scaffolding for Arbitrum Sepolia
- **Persistence**: file-based JSON storage (`data/deployments.json`) for MVP demoability

### Request flow

1. User enters intent and picks mode + model in `/studio`
2. `/api/chat` streams constrained planning assistant output
3. `/api/plan` returns validated structured blueprint JSON
4. `/api/deploy` records safe mock deployment (or prepared real path structure)
5. `/api/register-agent` returns mock registry status
6. Deployment summary is viewable at `/deployments/[id]`

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

```bash
ATXP_CONNECTION=
ATXP_BASE_URL=https://llm.atxp.ai/v1
NEXT_PUBLIC_APP_NAME=ArbiForge Studio
ARBITRUM_SEPOLIA_RPC_URL=
DEPLOYER_PRIVATE_KEY=
NEXT_PUBLIC_DEFAULT_MODEL=gpt-4.1
```

## ATXP integration notes

- ATXP is the **only** LLM backend.
- Gateway helper is centralized in `lib/atxp.ts`.
- Model picker values from the UI are passed into `/api/chat` and mapped into `atxpModel(selectedModel)`.
- `ATXP_BASE_URL` defaults to `https://llm.atxp.ai/v1`.

## Supported modes

### Escrow
Captures payer, payee, asset, release condition, cancel logic, and dispute/emergency assumptions.

### Treasury Timelock
Captures admin, delay, proposer/executor roles, allowed actions, and emergency controls.

### Whitelist Vault
Captures owner/admin, deposit asset, whitelist policy, withdraw permissions, and pause logic.

## Vercel deployment

1. Import repo into Vercel
2. Configure env variables in Project Settings
3. Deploy (no DB dependency required)

The app is designed to run in serverless mode with local file persistence for MVP demos.

## Roadmap to production onchain actions

- Replace mock deploy path with real per-mode contract factories + ABIs
- Add simulation + gas estimate + dry-run report
- Add signed confirmation flow for irreversible actions
- Integrate real Arbitrum identity registry contract call in `lib/registry.ts`
- Add persistent datastore and audit trail

## Hackathon positioning

ArbiForge Studio demonstrates a practical “AI agent + guardrails” pattern tailored for Arbitrum:

- constrained contract planning over open-ended generation
- safety-first UX
- clear extension path from mock to real execution
- polished, demoable product flow
