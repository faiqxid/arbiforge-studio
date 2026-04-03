interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function PromptPanel({ value, onChange }: Props) {
  return (
    <div className="card p-4">
      <label className="mb-2 block text-sm font-medium">Describe your onchain intent</label>
      <textarea
        className="min-h-40 w-full rounded-xl border border-border bg-slate-900 p-3 text-sm"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Example: Set up an escrow where payer sends 10,000 USDC to payee after oracle confirms milestone completion."
        value={value}
      />
    </div>
  );
}
