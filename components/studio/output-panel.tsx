interface Props {
  content: string;
  loading: boolean;
  error?: string | null;
}

export function OutputPanel({ content, loading, error }: Props) {
  return (
    <div className="card p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Planner Output</h3>
        {loading ? <span className="text-xs text-cyan-300">Streaming…</span> : <span className="text-xs text-slate-400">Ready</span>}
      </div>
      {error ? (
        <p className="mb-3 rounded-lg border border-rose-500/40 bg-rose-500/10 p-2 text-xs text-rose-200">{error}</p>
      ) : null}
      <div className="rounded-xl border border-border/80 bg-slate-950/50 p-3">
        <p className="min-h-36 whitespace-pre-wrap text-sm leading-6 text-slate-200">{content || "No output yet. Describe an intent to start planning."}{loading ? "▍" : ""}</p>
      </div>
    </div>
  );
}
