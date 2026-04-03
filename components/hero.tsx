import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-20">
      <p className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1 text-sm text-indigo-200">
        Arbitrum Agent Challenge Ready
      </p>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
        ArbiForge Studio turns plain English intent into safe, structured Arbitrum deployment plans.
      </h1>
      <p className="max-w-2xl text-lg text-slate-300">
        Build Escrow, Treasury Timelock, and Whitelist Vault blueprints with model-selectable AI via ATXP,
        safety checks, and confirmation-gated deployment prep for Arbitrum Sepolia.
      </p>
      <div className="flex gap-3">
        <Link className="rounded-xl bg-indigo-500 px-5 py-3 font-medium text-white hover:bg-indigo-400" href="/studio">
          Open Studio
        </Link>
      </div>
    </section>
  );
}
