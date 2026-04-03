# ArbiForge Studio

**ArbiForge Studio** is a polished, judge-friendly hackathon MVP for Arbitrum teams.
It transforms plain-English onchain intent into a constrained, reviewable deployment blueprint for three contract modes:

1. Escrow
2. Treasury Timelock
3. Whitelist Vault

> This app deliberately avoids arbitrary contract generation. It focuses on **safer planning**, clear assumptions, and confirmation-gated execution preparation.

---

## Why this is relevant for Arbitrum

Arbitrum builders often need to move quickly without losing rigor. ArbiForge Studio demonstrates a pragmatic “AI + guardrails” workflow:

- **Arbitrum-native framing** in prompts, safety checks, and deployment notes
- **Constrained templates** to reduce hallucinated architecture
- **Review-first UX** with extracted parameters and risk panels
- **Demo-safe execution states** that clearly separate planning vs confirmed onchain actions

---

## Core product flow

1. User enters intent in `/studio`
2. User selects contract mode + model
3. `/api/chat` streams planning assistant output from **ATXP only**
4. `/api/plan` returns a Zod-validated structured blueprint
5. User confirms and triggers `/api/deploy` (live tx attempted if chain key/rpc valid, otherwise mock-safe)
6. User optionally triggers `/api/register-agent` (mock-safe)
7. Shareable result page at `/deployments/[id]`

---

## Tech stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Vercel AI SDK
- Zod
- viem
- Local JSON persistence (`data/deployments.json` in local dev, `/tmp/arbiforge-studio/deployments.json` on serverless)

No database is required for MVP operation.

---

## Environment variables

Copy `.env.example` to `.env.local` and configure:

```bash
ATXP_CONNECTION=
ATXP_BASE_URL=https://llm.atxp.ai/v1
NEXT_PUBLIC_APP_NAME=ArbiForge Studio
ARBITRUM_SEPOLIA_RPC_URL=
DEPLOYER_PRIVATE_KEY=
NEXT_PUBLIC_DEFAULT_MODEL=gpt-4.1
REGISTRY_CONTRACT_ADDRESS=
```

### Notes

- `ATXP_CONNECTION` is required for live AI responses.
- `ATXP_BASE_URL` defaults to `https://llm.atxp.ai/v1`.
- Chain env vars are optional in MVP; when missing, deploy/register remain demo-safe mock flows.
- If `REGISTRY_CONTRACT_ADDRESS` is set, register route uses onchain `registerAgent(bytes32,string)` write.
- If valid chain env is set, deploy route submits a live 0 ETH self-check transaction on Arbitrum Sepolia and logs receipt status.
- On serverless platforms, deployment history is ephemeral unless replaced with a real database.

---

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

---

## Vercel deployment

1. Import this repo to Vercel
2. Set environment variables in Project Settings
3. Deploy

### Security baseline

- This project pins Next.js to a patched version for CVE-2025-66478 mitigation.
- Keep `next`, `react`, and `react-dom` on patched releases before submitting demos.

### Recommended for demo stability

- Set `ATXP_CONNECTION`
- Keep `NEXT_PUBLIC_DEFAULT_MODEL` aligned with an available ATXP model
- Use Arbitrum Sepolia credentials only (never production keys)

---

## Supported contract modes

### 1) Escrow
Captures payer, payee, asset, release condition, cancel logic, and dispute/emergency options.

### 2) Treasury Timelock
Captures admin, delay, proposer/executor roles, allowed actions, and emergency controls.

### 3) Whitelist Vault
Captures owner/admin, deposit asset, whitelist policy, withdraw permissions, and pause logic.

---

## ATXP integration details

- `lib/atxp.ts` centralizes ATXP gateway configuration.
- UI model picker sends selected model to `/api/chat`.
- `/api/chat` maps `selectedModel` into `atxpModel(selectedModel)`.
- No alternative LLM providers are configured.

---

## Demo positioning for judges

This submission highlights:

- Clear product framing and polished UX
- Fast iteration with streamed AI output
- Safety-first plan extraction with explicit missing parameters
- Honest mock states for deployment/registry (no fake success claims)
- Strong extension path from mock MVP to real contract integrations

---

## Roadmap: from MVP to production

- Replace mock deploy route with per-mode ABI/factory deployments via viem
- Add simulation + gas estimation + dry-run reports
- Add signed confirmation checkpoints before state-changing actions
- Integrate real Arbitrum identity registry contract writes
- Move persistence to managed database + audit logs
