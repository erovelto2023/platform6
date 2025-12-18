'use server';

import { getOllamaResponse } from "@/lib/ollama";

export async function generateOllamaContent(prompt: string, model?: string, systemPrompt?: string) {
    try {
        const response = await getOllamaResponse(prompt, model, systemPrompt);
        return { success: true, data: response };
    } catch (error) {
        console.error("Failed to generate content:", error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function getModels() {
    try {
        const { getOllamaModels } = await import("@/lib/ollama");
        const models = await getOllamaModels();
        return { success: true, data: models };
    } catch (error) {
        return { success: false, error: "Failed to fetch models" };
    }
}
