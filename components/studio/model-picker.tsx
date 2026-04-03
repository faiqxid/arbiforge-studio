import { MODEL_CATALOG } from "@/lib/models";

interface Props {
  value: string;
  onChange: (next: string) => void;
}

export function ModelPicker({ value, onChange }: Props) {
  return (
    <div className="card p-4">
      <label className="mb-2 block text-sm font-medium text-slate-200">Model</label>
      <select
        className="w-full rounded-xl border border-border bg-slate-900 px-3 py-2 text-sm"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {MODEL_CATALOG.map((model) => (
          <option key={model.id} value={model.id}>
            {model.label}
          </option>
        ))}
      </select>
      <p className="mt-2 text-xs text-slate-400">Selected model is routed through ATXP&apos;s OpenAI-compatible gateway.</p>
    </div>
  );
}
