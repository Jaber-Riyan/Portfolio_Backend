import { pipeline } from "@xenova/transformers";

let embedder: any;

export const initializeEmbedder = async () => {
    embedder = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
    )
}

export async function getEmbedding(text: any) {
    if (!embedder) {
        throw new Error(
            "Embedder not initialized. Call initializeEmbedder() first."
        );
    }
    
    const output = await embedder(text, {
        pooling: "mean",
        normalize: true,
    });

    return Array.from(output.data);
}