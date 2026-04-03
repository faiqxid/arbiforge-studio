import { Hero } from "@/components/hero";

const highlights = [
  {
    title: "Constrained Intelligence",
    description: "Strictly limited to 3 audited-style contract modes to reduce ambiguity and improve reviewability."
  },
  {
    title: "Arbitrum Delivery Focus",
    description: "Blueprints, risks, and execution notes are tailored for Arbitrum Sepolia deployment workflows."
  },
  {
    title: "Demo-Ready Confidence",
    description: "Streaming planning, model selection via ATXP, and believable mock execution states for judges."
  }
];

export default function HomePage() {
  return (
    <main>
      <Hero />
      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-20 md:grid-cols-3">
        {highlights.map((item) => (
          <article className="card p-6" key={item.title}>
            <h2 className="mb-2 text-lg font-semibold">{item.title}</h2>
            <p className="text-sm text-slate-300">{item.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
