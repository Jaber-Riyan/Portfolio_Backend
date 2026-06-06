import { getEmbedding } from "../ai/embed";
import { documents } from "../ai/context";
import { searchDocuments } from "../ai/search";
import { aion } from "../ai/aion";
import { Request, Response } from "express";

const systemPrompt = `
You are Jaber's personal portfolio AI assistant.

STRICT OUTPUT RULES:
- Output ONLY the final answer
- NEVER include <think>, reasoning, or steps
- NEVER include explanations about how you found the answer
- NEVER wrap output in tags or markdown
- Keep answer short and clean
- Use ONLY provided context
- If answer is not in context, say: "I don't have enough information from the portfolio data. Please contact with Jaber Ahmed Riyan"
`;

function cleanResponse(text: string) {
    return text
        .replace(/<think>[\s\S]*?<\/think>/g, "")
        .trim();
}

export const chat = async (req: Request, res: Response) => {
    // Wrap in try-catch to prevent unhandled Express crashes
    try {
        const { message } = req.body;

        const queryVector = await getEmbedding(message);

        const relevantDocs = searchDocuments(
            queryVector,
            documents
        );

        const context = relevantDocs
            .map((doc:any) => doc.content)
            .join("\n");

        const completion = await aion.chat.completions.create({
            model: "aion-labs/aion-1.0-mini",
            // model: "aion-1.0-mini",
            messages: [
                {
                    role: "system",
                    content: "Answer only using provided context in plain text."
                },
                {
                    role: "user",
                    content: `
                    Context:
                    ${context}

                    Question:
                    ${message}
                    `,
                },
            ],
        });

        console.log("FULL RESPONSE:", JSON.stringify(completion, null, 2));

        // Fixed array element access safely
        const raw = completion.choices[0]?.message?.content || "No response generated.";

        const answer = cleanResponse(raw)

        // Fixed typo: changed 'reson' to 'res.json'
        res.json({
            answer,
            // contextUsed: relevantDocs,
        });

    } catch (error) {
        console.error("Chat error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
