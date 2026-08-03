import connectToDatabase from "./db/connect";
import User from "./db/models/User";

interface AIRequest {
    prompt: string;
    systemPrompt?: string;
    model?: string;
    userId?: string;
    apiKey?: string;
    temperature?: number;
}

interface AIResponse {
    content: string;
    model: string;
    provider: 'openrouter';
}

export class AIService {
    private static OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

    static async generate(request: AIRequest): Promise<AIResponse> {
        let apiKey = request.apiKey || '';
        let model = request.model || process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

        // 1. Fetch User Settings if userId is provided
        if (request.userId && !apiKey) {
            try {
                await connectToDatabase();
                const user = await User.findOne({ clerkId: request.userId }).select('aiSettings');
                if (user && user.aiSettings && user.aiSettings.apiKey) {
                    apiKey = user.aiSettings.apiKey;
                    if (!request.model && user.aiSettings.defaultModel) {
                        model = user.aiSettings.defaultModel;
                    }
                }
            } catch (err) {
                console.warn("[AIService] Could not fetch user settings, checking env keys...", err);
            }
        }

        // 2. Fallback to Environment Variables (OpenRouter -> OpenAI -> DeepSeek)
        if (!apiKey) {
            apiKey = process.env.OPENROUTER_API_KEY || 
                     process.env.OPENAI_API_KEY || 
                     process.env.DEEPSEEK_API_KEY || '';
        }

        // Normalize model if llama/deepseek-llm local names were passed
        if (model === 'llama2:latest' || model === 'deepseek-llm:latest') {
            model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
        }

        console.log(`[AIService] Routing request via OpenRouter with model: ${model}`);

        // 3. Execute OpenRouter Request
        return this.generateOpenRouter(request.prompt, request.systemPrompt, model, apiKey, request.temperature);
    }

    private static async generateOpenRouter(
        prompt: string, 
        systemPrompt: string = "", 
        model: string, 
        apiKey: string, 
        temperature: number = 0.7
    ): Promise<AIResponse> {
        if (!apiKey) {
            throw new Error("OpenRouter API Key is missing. Please configure OPENROUTER_API_KEY in your environment or Settings.");
        }

        try {
            const response = await fetch(this.OPENROUTER_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://kbusinessacademy.com', // Required by OpenRouter
                    'X-Title': 'K Business Academy'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: 'system', content: systemPrompt || "You are an expert AI business strategist and direct-response copywriter." },
                        { role: 'user', content: prompt }
                    ],
                    temperature: temperature
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`OpenRouter API Error (${response.status}): ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content || "";

            return {
                content,
                model,
                provider: 'openrouter'
            };

        } catch (error: any) {
            console.error("[AIService] OpenRouter Generation Error:", error.message || error);
            throw error;
        }
    }

    static async getAvailableModels(provider: 'openrouter' = 'openrouter', apiKey?: string): Promise<string[]> {
        const key = apiKey || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
        if (!key) return ["openai/gpt-4o-mini", "anthropic/claude-3.5-sonnet", "google/gemini-2.0-flash-001"];

        try {
            const response = await fetch("https://openrouter.ai/api/v1/models", {
                headers: {
                    'Authorization': `Bearer ${key}`,
                }
            });
            const data = await response.json();
            if (Array.isArray(data.data)) {
                return data.data.map((m: any) => m.id);
            }
            return ["openai/gpt-4o-mini", "anthropic/claude-3.5-sonnet", "google/gemini-2.0-flash-001"];
        } catch (error) {
            console.error("Failed to fetch OpenRouter models:", error);
            return ["openai/gpt-4o-mini", "anthropic/claude-3.5-sonnet", "google/gemini-2.0-flash-001"];
        }
    }
}
