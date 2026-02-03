
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://31.97.146.3:11434';

export async function getOllamaResponse(prompt: string, model: string = 'deepseek-r1', systemPrompt: string = "Provide clear, direct output. Do not include code blocks or technical implementation details. Do not include sections like 'Why This Works'. Write in plain text.") {
    console.log(`[Ollama] Sending request to ${OLLAMA_HOST}/api/generate with model: ${model}`);
    try {
        const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                system: systemPrompt,
                stream: false
            }),
            signal: AbortSignal.timeout(300000) // 5 minute timeout
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ollama API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Ollama request failed:", error);
        throw error;
    }
}

export async function getOllamaModels() {
    try {
        const response = await fetch(`${OLLAMA_HOST}/api/tags`);
        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.statusText}`);
        }
        const data = await response.json();
        return data.models || [];
    } catch (error) {
        console.error("Failed to fetch Ollama models:", error);
        return [];
    }
}
