"use client";

import { useState } from "react";
import { useCompletion } from "ai/react";
import { ActionBar } from "@/components/studio/action-bar";
import { BlueprintPanel } from "@/components/studio/blueprint-panel";
import { ModeSelector } from "@/components/studio/mode-selector";
import { ModelPicker } from "@/components/studio/model-picker";
import { OutputPanel } from "@/components/studio/output-panel";
import { PromptPanel } from "@/components/studio/prompt-panel";
import { RiskPanel } from "@/components/studio/risk-panel";
import { DEFAULT_MODEL } from "@/lib/models";
import type { Blueprint, ContractMode } from "@/types/blueprint";
import { useRouter } from "next/navigation";

const atxpMissing = !process.env.NEXT_PUBLIC_DEFAULT_MODEL;

export default function StudioPage() {
  const [intent, setIntent] = useState("");
  const [mode, setMode] = useState<ContractMode>("escrow");
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [registering, setRegistering] = useState(false);
  const router = useRouter();

  const { completion, complete, isLoading } = useCompletion({ api: "/api/chat" });

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
      router.push(`/deployments/${data.id}`);
    } finally {
      setDeploying(false);
    }
  }

  async function onRegister() {
    if (!blueprint) return;
    setRegistering(true);
    try {
      await fetch("/api/register-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deploymentId: "pending", mode, title: blueprint.title })
      });
    } finally {
      setRegistering(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:px-6">
      <header className="mb-2">
        <h1 className="text-3xl font-semibold">ArbiForge Studio</h1>
        <p className="text-sm text-slate-300">Create Arbitrum deployment plans with ATXP-backed AI models.</p>
      </header>

      {atxpMissing ? (
        <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-200">
          ATXP env appears missing. Set ATXP_CONNECTION and optionally ATXP_BASE_URL for live model responses.
        </div>
      ) : null}

      <ModelPicker onChange={setModel} value={model} />
      <ModeSelector onChange={setMode} value={mode} />

      <details className="card p-4">
        <summary className="cursor-pointer text-sm font-medium">Advanced settings</summary>
        <p className="mt-2 text-xs text-slate-400">This MVP uses constrained mode templates and a confirmation-gated deployment flow.</p>
      </details>

      <PromptPanel onChange={setIntent} value={intent} />
      <ActionBar
        canRunChain={false}
        deploying={deploying}
        onDeploy={onDeploy}
        onPlan={onPlan}
        onRegister={onRegister}
        registering={registering}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OutputPanel content={completion} loading={isLoading} />
        </div>
        <div className="space-y-4">
          <BlueprintPanel blueprint={blueprint} />
          <RiskPanel blueprint={blueprint} />
        </div>
      </div>
    </main>
  );
}
