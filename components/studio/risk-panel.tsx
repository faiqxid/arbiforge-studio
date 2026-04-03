import type { Blueprint } from "@/types/blueprint";

interface Props {
  blueprint: Blueprint | null;
}

export function RiskPanel({ blueprint }: Props) {
  return (
    <div className="card p-4">
      <h3 className="mb-2 text-sm font-medium">Safety & Risk Review</h3>
      {!blueprint ? <p className="text-sm text-slate-400">Safety checks will be listed after blueprint generation.</p> : null}
      {blueprint ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-amber-200">
          {blueprint.safetyChecks.map((check) => (
            <li key={check}>{check}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
