function cosineSimilarity(a, b) {
    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }

    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export function searchDocuments(queryVector, docs) {
    return docs
        .map((doc) => ({
            ...doc,
            score: cosineSimilarity(
                queryVector,
                doc.embedding
            ),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}