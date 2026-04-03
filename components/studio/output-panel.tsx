interface Props {
  content: string;
  loading: boolean;
}

export function OutputPanel({ content, loading }: Props) {
  return (
    <div className="card p-4">
      <h3 className="mb-2 text-sm font-medium">Agent Output</h3>
      {loading ? <p className="text-sm text-slate-400">Streaming response…</p> : null}
      <p className="whitespace-pre-wrap text-sm text-slate-200">{content || "No output yet. Start with your intent."}</p>
    </div>
  );
}
