interface Props {
  content: string;
  loading: boolean;
}

export function OutputPanel({ content, loading }: Props) {
  return (
    <div className="card p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Planner Output</h3>
        {loading ? <span className="text-xs text-cyan-300">Streaming…</span> : <span className="text-xs text-slate-400">Ready</span>}
      </div>
      <div className="rounded-xl border border-border/80 bg-slate-950/50 p-3">
        <p className="min-h-36 whitespace-pre-wrap text-sm leading-6 text-slate-200">{content || "No output yet. Describe an intent to start planning."}{loading ? "▍" : ""}</p>
      </div>
    </div>
  );
}
