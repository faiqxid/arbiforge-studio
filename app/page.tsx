import { Hero } from "@/components/hero";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-20 md:grid-cols-3">
        {[
          ["Intent → Mode", "Classifies your request into Escrow, Timelock, or Whitelist Vault."],
          ["Blueprint + Risks", "Extracts actors, assets, rules, and safety assumptions with clear review notes."],
          ["Execution Guardrails", "Prepare deployment and registry steps only after explicit user confirmation."]
        ].map((item) => (
          <article className="card p-5" key={item[0]}>
            <h2 className="mb-2 text-lg font-semibold">{item[0]}</h2>
            <p className="text-sm text-slate-300">{item[1]}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
