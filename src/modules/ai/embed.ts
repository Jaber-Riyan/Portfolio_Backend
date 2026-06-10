import { env } from "../../config/env";

const HF_EMBEDDING_URL =
  "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2";

export async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch(`${HF_EMBEDDING_URL}?wait_for_model=true`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Embedding API error ${response.status}: ${body}`);
  }

  const data = await response.json() as number[] | number[][];
  // sentence-transformers returns [[embedding...]] for a single string input
  return Array.isArray(data[0]) ? (data as number[][])[0] : (data as number[]);
}

// No-op: embeddings are now handled via the HuggingFace Inference API
export async function initializeEmbedder(): Promise<void> {}
