import { documents } from "../modules/ai/context";
import { getEmbedding } from "../modules/ai/embed";


export async function initializeKnowledgeBase() {
  for (const doc of documents) {
    doc.embedding = await getEmbedding(
      doc.content
    );
  }
}