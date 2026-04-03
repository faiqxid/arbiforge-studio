"use client";

import { useEffect, useMemo, useState } from "react";
import { useCompletion } from "ai/react";
import { ActionBar } from "@/components/studio/action-bar";
import { BlueprintPanel } from "@/components/studio/blueprint-panel";
import { ModeSelector } from "@/components/studio/mode-selector";
import { ModelPicker } from "@/components/studio/model-picker";
import { OutputPanel } from "@/components/studio/output-panel";
import { PromptPanel } from "@/components/studio/prompt-panel";
import { RiskPanel } from "@/components/studio/risk-panel";
import { DEFAULT_MODEL } from "@/lib/models";
import { MODE_DETAILS } from "@/lib/templates";
import type { Blueprint, ContractMode, DeploymentStatus } from "@/types/blueprint";

interface DeployResultState {
  status: DeploymentStatus;
  txHash?: string;
  contractAddress?: string;
  explorerTxUrl?: string;
  explorerAddressUrl?: string;
  executionNote?: string;
  logs: string[];
}

export default function StudioPage() {
  const [intent, setIntent] = useState("");
  const [mode, setMode] = useState<ContractMode>("escrow");
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registryStatus, setRegistryStatus] = useState<string>("Not started");
  const [registryLogs, setRegistryLogs] = useState<string[]>([]);
  const [planReasoning, setPlanReasoning] = useState<string>("No plan generated yet.");
  const [deployResult, setDeployResult] = useState<DeployResultState | null>(null);
  const [lastDeploymentId, setLastDeploymentId] = useState<string>("pending");
  const [atxpReady, setAtxpReady] = useState<boolean | null>(null);
  const [chainReady, setChainReady] = useState<boolean>(false);

  const { completion, complete, isLoading } = useCompletion({ api: "/api/chat" });

  const modePromptHints = useMemo(() => MODE_DETAILS[mode].prompts, [mode]);

  useEffect(() => {
    fetch("/api/config")
      .then((response) => response.json())
      .then((data) => {
        setAtxpReady(Boolean(data.hasAtxpConnection));
        setChainReady(Boolean(data.hasChainConfig));
      })
      .catch(() => setAtxpReady(false));
  }, []);

  async function onPlan() {
    if (!intent.trim()) return;

    await complete(intent, {
      body: {
        messages: [{ role: "user", content: intent }],
        selectedModel: model,
        selectedMode: mode
      }
    });

    const response = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent, selectedMode: mode })
    });

    if (!response.ok) return;
    const data = await response.json();
    setBlueprint(data.blueprint as Blueprint);
    setPlanReasoning(`${data.reasoning} ${data.safetyBanner}`);
  }

  async function onDeploy() {
    if (!blueprint) return;
    setDeploying(true);
    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: intent, selectedMode: mode, selectedModel: model, blueprint })
      });
      if (!response.ok) return;
      const data = await response.json();

      setLastDeploymentId(typeof data.id === "string" ? data.id : "pending");
      setDeployResult({
        status: data.deploymentStatus as DeploymentStatus,
        txHash: data.txHash,
        contractAddress: data.contractAddress,
        explorerTxUrl: data.explorerTxUrl,
        explorerAddressUrl: data.explorerAddressUrl,
        executionNote: data.executionNote,
        logs: Array.isArray(data.logs) ? data.logs : []
      });
    } finally {
      setDeploying(false);
    }
  }

  async function onRegister() {
    if (!blueprint) return;
    setRegistering(true);
    try {
      const response = await fetch("/api/register-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deploymentId: lastDeploymentId, mode, title: blueprint.title })
      });

      const data = await response.json();
      setRegistryStatus(data.message || "Mock registration complete");
      setRegistryLogs(Array.isArray(data.logs) ? data.logs : []);
    } finally {
      setRegistering(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 md:px-6 md:py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">ArbiForge Studio</h1>
        <p className="text-sm text-slate-300">Arbitrum-native contract planning with constrained modes, safety checks, and confirmation-gated execution prep.</p>
      </header>

      {atxpReady === false ? (
        <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-200">
          ATXP env missing. Set ATXP_CONNECTION and optionally ATXP_BASE_URL for live model responses.
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <PromptPanel mode={mode} onChange={setIntent} value={intent} />
        <div className="space-y-4">
          <ModelPicker onChange={setModel} value={model} />
          <div className="card p-4">
            <h3 className="text-sm font-semibold">Mode Guidance</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-300">
              {modePromptHints.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <ModeSelector onChange={setMode} value={mode} />

      <details className="card p-4">
        <summary className="cursor-pointer text-sm font-medium">Advanced settings</summary>
        <p className="mt-2 text-xs text-slate-400">All plans are constrained to 3 supported templates and require review before any deploy action.</p>
      </details>

      <ActionBar
        canRunChain={chainReady}
        deploying={deploying}
        onDeploy={onDeploy}
        onPlan={onPlan}
        onRegister={onRegister}
        registering={registering}
      />

      <p className="text-xs text-slate-400">Registry status: {registryStatus}</p>
      <p className="text-xs text-slate-500">Planner note: {planReasoning}</p>


      {registryLogs.length > 0 ? (
        <section className="card p-4">
          <h3 className="text-sm font-semibold">Registry Logs</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-300">
            {registryLogs.map((log, idx) => (
              <li key={`${log}-${idx}`}>{log}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {deployResult ? (
        <section className="card p-4">
          <h3 className="text-sm font-semibold">Deployment Logs</h3>
          <p className="mt-1 text-xs text-slate-400">Status: {deployResult.status}</p>
          {deployResult.executionNote ? <p className="mt-1 text-xs text-cyan-300">{deployResult.executionNote}</p> : null}
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-300">
            {deployResult.logs.map((log, idx) => (
              <li key={`${log}-${idx}`}>{log}</li>
            ))}
          </ul>
          <div className="mt-3 text-xs text-slate-300">
            <p className="break-all">Tx Hash: {deployResult.txHash}</p>
            <p className="break-all">Contract/Deployer: {deployResult.contractAddress}</p>
            {deployResult.explorerTxUrl ? (
              <a className="mt-1 inline-block text-indigo-300 hover:text-indigo-200" href={deployResult.explorerTxUrl} rel="noreferrer" target="_blank">
                View Tx on Arbiscan
              </a>
            ) : null}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <OutputPanel content={completion} loading={isLoading} />
          <BlueprintPanel blueprint={blueprint} />
        </div>
        <div>
          <RiskPanel blueprint={blueprint} />
        </div>
      </div>
    </main>
  );
}
