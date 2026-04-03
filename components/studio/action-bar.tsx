interface Props {
  canRunChain: boolean;
  deploying: boolean;
  registering: boolean;
  onPlan: () => void;
  onDeploy: () => void;
  onRegister: () => void;
}

export function ActionBar({ canRunChain, deploying, registering, onPlan, onDeploy, onRegister }: Props) {
  return (
    <div className="card p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Execution Controls</h3>
        <span className="text-xs text-slate-400">Review required before execution</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium" onClick={onPlan} type="button">
          Generate Plan
        </button>
        <button
          className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium disabled:opacity-50"
          disabled={deploying}
          onClick={onDeploy}
          type="button"
        >
          {deploying ? "Preparing..." : "Prepare Deployment"}
        </button>
        <button
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium disabled:opacity-50"
          disabled={registering}
          onClick={onRegister}
          type="button"
        >
          {registering ? "Registering..." : "Register Agent Identity"}
        </button>
      </div>
      {!canRunChain ? (
        <p className="mt-3 text-xs text-amber-300">Chain env missing. Deployment and registry are currently demo-safe mock flows.</p>
      ) : null}
    </div>
  );
}
