import OpenAI from "openai";
import { env } from "../../config/env";

export const aion = new OpenAI({
    apiKey: env.AION_API_KEY,
    baseURL: "https://api.aionlabs.ai/v1",
});