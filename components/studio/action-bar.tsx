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
    <div className="card flex flex-wrap gap-2 p-4">
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
      {!canRunChain ? <p className="w-full text-xs text-amber-300">Chain env missing. Deployment and registry are mock-safe stubs.</p> : null}
    </div>
  );
}
