import { MODE_DETAILS } from "@/lib/templates";
import type { ContractMode } from "@/types/blueprint";
import { cn } from "@/lib/utils";

interface Props {
  value: ContractMode;
  onChange: (mode: ContractMode) => void;
}

export function ModeSelector({ value, onChange }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {(Object.keys(MODE_DETAILS) as ContractMode[]).map((mode) => (
        <button
          className={cn(
            "card p-4 text-left transition",
            value === mode ? "border-indigo-400 bg-indigo-500/10" : "hover:border-slate-600"
          )}
          key={mode}
          onClick={() => onChange(mode)}
          type="button"
        >
          <p className="text-sm font-semibold text-white">{MODE_DETAILS[mode].title}</p>
          <p className="mt-1 text-xs text-slate-400">{MODE_DETAILS[mode].description}</p>
          <p className="mt-2 text-[11px] text-slate-500">Sample ready in prompt panel.</p>
        </button>
      ))}
    </div>
  );
}
