import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { DeploymentRecord } from "@/types/blueprint";

const DATA_DIR = path.join(process.cwd(), "data");
const DEPLOYMENTS_PATH = path.join(DATA_DIR, "deployments.json");

async function ensureFile() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(DEPLOYMENTS_PATH, "utf-8");
  } catch {
    await writeFile(DEPLOYMENTS_PATH, "[]", "utf-8");
  }
}

export async function listDeployments(): Promise<DeploymentRecord[]> {
  await ensureFile();
  const raw = await readFile(DEPLOYMENTS_PATH, "utf-8");
  return JSON.parse(raw) as DeploymentRecord[];
}

export async function getDeployment(id: string): Promise<DeploymentRecord | undefined> {
  const records = await listDeployments();
  return records.find((record) => record.id === id);
}

export async function saveDeployment(record: DeploymentRecord): Promise<void> {
  const records = await listDeployments();
  records.unshift(record);
  await writeFile(DEPLOYMENTS_PATH, JSON.stringify(records, null, 2), "utf-8");
}
