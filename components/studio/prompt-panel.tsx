import { MODE_DETAILS } from "@/lib/templates";
import type { ContractMode } from "@/types/blueprint";

interface Props {
  value: string;
  mode: ContractMode;
  onChange: (value: string) => void;
}

export function PromptPanel({ value, mode, onChange }: Props) {
  return (
    <div className="card p-4 md:p-5">
      <div className="mb-2 flex items-center justify-between gap-4">
        <label className="text-sm font-semibold">Describe your onchain intent</label>
        <button
          className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:border-indigo-400 hover:text-white"
          onClick={() => onChange(MODE_DETAILS[mode].sampleIntent)}
          type="button"
        >
          Use {MODE_DETAILS[mode].title} sample
        </button>
      </div>
      <textarea
        className="min-h-44 w-full rounded-xl border border-border bg-slate-900 p-3 text-sm"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Example: Create an escrow for milestone payments with explicit release and cancel logic."
        value={value}
      />
      <p className="mt-2 text-xs text-slate-400">Tip: include actors, assets, timing windows, and emergency conditions for cleaner extraction.</p>
    </div>
  );
}
