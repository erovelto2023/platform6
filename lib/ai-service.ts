import { getOllamaResponse } from "./ollama";
import connectToDatabase from "./db/connect";
import User from "./db/models/User";

interface AIRequest {
    prompt: string;
    systemPrompt?: string;
    model?: string;
    userId?: string;
    temperature?: number;
}

interface AIResponse {
    content: string;
    model: string;
    provider: 'local' | 'openrouter';
}

export class AIService {
    private static OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

    static async generate(request: AIRequest): Promise<AIResponse> {
        let provider = 'local';
        let apiKey = '';
        let model = request.model || 'deepseek-r1';

        // 1. Fetch User Settings if userId is provided
        if (request.userId) {
            await connectToDatabase();
            const user = await User.findOne({ clerkId: request.userId }).select('aiSettings');
            if (user && user.aiSettings) {
                console.log(`[AIService] User settings found:`, user.aiSettings);
                provider = user.aiSettings.provider || 'local';
                if (provider === 'openrouter') {
                    apiKey = user.aiSettings.apiKey;
                    // Priority: Request Model > User Default > Hardcoded Default
                    if (request.model && request.model !== 'deepseek-llm:latest' && request.model !== 'deepseek-r1') {
                        model = request.model;
                    } else if (user.aiSettings.defaultModel) {
                        model = user.aiSettings.defaultModel;
                    } else {
                        model = 'openai/gpt-3.5-turbo';
                    }
                } else {
                    // Local settings
                    if (user.aiSettings.defaultModel) {
                        model = user.aiSettings.defaultModel;
                    }
                    // If request specifically overrides (and isn't just the default fallback), use that
                    if (request.model && request.model !== 'deepseek-r1' && request.model !== 'deepseek-llm:latest') {
                        model = request.model;
                    }
                }
            } else {
                console.log(`[AIService] No user settings found for ${request.userId}, using defaults.`);
            }
        }

        console.log(`[AIService] Routing to ${provider} with model ${model}`);

        // 2. Route Request
        if (provider === 'openrouter') {
            return this.generateOpenRouter(request.prompt, request.systemPrompt, model, apiKey, request.temperature);
        } else {
            return this.generateLocal(request.prompt, request.systemPrompt, model);
        }
    }

    private static async generateLocal(prompt: string, systemPrompt?: string, model: string = 'deepseek-r1'): Promise<AIResponse> {
        try {
            const content = await getOllamaResponse(prompt, model, systemPrompt);
            return {
                content,
                model,
                provider: 'local'
            };
        } catch (error) {
            console.error("Local AI Generation Failed:", error);
            throw new Error("Failed to generate content with local AI.");
        }
    }

    private static async generateOpenRouter(prompt: string, systemPrompt: string = "", model: string, apiKey: string, temperature: number = 0.7): Promise<AIResponse> {
        if (!apiKey) {
            throw new Error("OpenRouter API Key is missing. Please configure it in your settings.");
        }

        try {
            const response = await fetch(this.OPENROUTER_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://kbusiness.app', // Required by OpenRouter
                    'X-Title': 'KBusiness App'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: prompt }
                    ],
                    temperature: temperature
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`OpenRouter API Error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content || "";

            return {
                content,
                model,
                provider: 'openrouter'
            };

        } catch (error) {
            console.error("OpenRouter Generation Failed:", error);
            throw error;
        }
    }

    static async getAvailableModels(provider: 'local' | 'openrouter', apiKey?: string): Promise<string[]> {
        if (provider === 'local') {
            // Fetch from Ollama
            const { getOllamaModels } = await import("./ollama");
            const models = await getOllamaModels();
            return models.map((m: any) => m.name);
        } else {
            // Fetch from OpenRouter
            if (!apiKey) return [];
            try {
                const response = await fetch("https://openrouter.ai/api/v1/models", {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                    }
                });
                const data = await response.json();
                return data.data.map((m: any) => m.id);
            } catch (error) {
                console.error("Failed to fetch OpenRouter models:", error);
                return [];
            }
        }
    }
}
