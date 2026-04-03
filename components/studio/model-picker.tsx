import { MODEL_CATALOG } from "@/lib/models";

interface Props {
  value: string;
  onChange: (next: string) => void;
}

export function ModelPicker({ value, onChange }: Props) {
  const selected = MODEL_CATALOG.find((model) => model.id === value);

  return (
    <div className="card p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <label className="text-sm font-semibold text-slate-100">Model Router</label>
        <span className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-2 py-0.5 text-[11px] text-indigo-200">ATXP Gateway</span>
      </div>
      <select
        className="w-full rounded-xl border border-border bg-slate-900 px-3 py-2 text-sm"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {MODEL_CATALOG.map((model) => (
          <option key={model.id} value={model.id}>
            {model.label} · {model.id}
          </option>
        ))}
      </select>
      <p className="mt-2 text-xs text-slate-400">{selected?.description ?? "Model metadata unavailable."}</p>
      <p className="mt-1 text-[11px] text-slate-500">Your selection is passed to `/api/chat` and mapped to the ATXP OpenAI-compatible model call.</p>
    </div>
  );
}
