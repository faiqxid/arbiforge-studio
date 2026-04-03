import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-24">
      <p className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-4 py-1 text-xs font-medium uppercase tracking-wide text-indigo-200">
        Arbitrum-native AI deployment studio
      </p>
      <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
        Turn natural-language intent into production-style Arbitrum plans in minutes.
      </h1>
      <p className="max-w-2xl text-lg text-slate-300">
        ArbiForge Studio helps teams draft constrained contract blueprints for Escrow, Treasury Timelock, and
        Whitelist Vault flows—with model-selectable ATXP intelligence, safety-first review, and confirmation-gated
        deployment prep.
      </p>
      <div className="flex gap-3">
        <Link className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-400" href="/studio">
          Launch Studio
        </Link>
      </div>
    </section>
  );
}
