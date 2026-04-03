import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeployment } from "@/lib/storage";

export default async function DeploymentResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deployment = await getDeployment(id);

  if (!deployment) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold">Deployment Result</h1>
        <p className="mt-1 text-sm text-slate-400">Shareable summary for hackathon demo and review.</p>

        <dl className="mt-6 grid gap-3 text-sm md:grid-cols-2">
          <div><dt className="text-slate-400">Mode</dt><dd>{deployment.selectedMode}</dd></div>
          <div><dt className="text-slate-400">Model</dt><dd>{deployment.selectedModel}</dd></div>
          <div><dt className="text-slate-400">Deployment Status</dt><dd>{deployment.deploymentStatus}</dd></div>
          <div><dt className="text-slate-400">Registry Status</dt><dd>{deployment.registryStatus}</dd></div>
          <div><dt className="text-slate-400">Tx Hash</dt><dd className="break-all">{deployment.txHash}</dd></div>
          <div><dt className="text-slate-400">Contract Address</dt><dd className="break-all">{deployment.contractAddress}</dd></div>
        </dl>

        <section className="mt-6 space-y-2 text-sm">
          <h2 className="font-medium">Prompt</h2>
          <p className="text-slate-300">{deployment.prompt}</p>
          <h2 className="font-medium">Extracted Parameters</h2>
          <ul className="list-disc pl-5 text-slate-300">
            {deployment.blueprint.actors.map((actor) => <li key={actor}>{actor}</li>)}
            {deployment.blueprint.assets.map((asset) => <li key={asset}>{asset}</li>)}
          </ul>
          <h2 className="font-medium">Blueprint Summary</h2>
          <p className="text-slate-300">{deployment.blueprint.summary}</p>
        </section>

        <Link className="mt-6 inline-block rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium" href="/studio">
          Back to Studio
        </Link>
      </div>
    </main>
  );
}
