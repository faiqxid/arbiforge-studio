import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { DeploymentRecord } from "@/types/blueprint";

const memoryStore: DeploymentRecord[] = [];

function getPaths() {
  const writableTmpDir = path.join("/tmp", "arbiforge-studio");
  const localDataDir = path.join(process.cwd(), "data");

  const useTmp = process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME;
  const dataDir = useTmp ? writableTmpDir : localDataDir;

  return {
    dataDir,
    filePath: path.join(dataDir, "deployments.json")
  };
}

async function ensureFile() {
  const { dataDir, filePath } = getPaths();

  try {
    await mkdir(dataDir, { recursive: true });
    await readFile(filePath, "utf-8");
    return filePath;
  } catch {
    try {
      await writeFile(filePath, "[]", "utf-8");
      return filePath;
    } catch {
      // In strict read-only environments, fall back to in-memory storage.
      return null;
    }
  }
}

export async function listDeployments(): Promise<DeploymentRecord[]> {
  const filePath = await ensureFile();

  if (!filePath) {
    return memoryStore;
  }

  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as DeploymentRecord[];
  } catch {
    return memoryStore;
  }
}

export async function getDeployment(id: string): Promise<DeploymentRecord | undefined> {
  const records = await listDeployments();
  return records.find((record) => record.id === id);
}

export async function saveDeployment(record: DeploymentRecord): Promise<void> {
  const filePath = await ensureFile();

  if (!filePath) {
    memoryStore.unshift(record);
    return;
  }

  const records = await listDeployments();
  records.unshift(record);

  try {
    await writeFile(filePath, JSON.stringify(records, null, 2), "utf-8");
  } catch {
    memoryStore.unshift(record);
  }
}

export async function updateDeployment(id: string, patch: Partial<DeploymentRecord>): Promise<DeploymentRecord | undefined> {
  const filePath = await ensureFile();
  const records = await listDeployments();
  const index = records.findIndex((record) => record.id === id);

  if (index === -1) {
    return undefined;
  }

  records[index] = { ...records[index], ...patch };

  if (!filePath) {
    return records[index];
  }

  try {
    await writeFile(filePath, JSON.stringify(records, null, 2), "utf-8");
  } catch {
    // ignore write error; return updated in-memory result
  }

  return records[index];
}
