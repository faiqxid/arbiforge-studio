import type { Blueprint } from "@/types/blueprint";

interface Props {
  blueprint: Blueprint | null;
}

export function BlueprintPanel({ blueprint }: Props) {
  return (
    <div className="card p-4">
      <h3 className="mb-2 text-sm font-medium">Generated Blueprint</h3>
      {!blueprint ? <p className="text-sm text-slate-400">Blueprint appears here after planning.</p> : null}
      {blueprint ? (
        <div className="space-y-3 text-sm">
          <p className="font-semibold">{blueprint.title}</p>
          <p className="text-slate-300">{blueprint.summary}</p>
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            {blueprint.rules.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
