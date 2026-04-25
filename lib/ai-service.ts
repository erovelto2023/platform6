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
    provider: 'openrouter';
}

export class AIService {
    private static OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

    static async generate(request: AIRequest): Promise<AIResponse> {
        let apiKey = '';
        let model = request.model || 'openai/gpt-3.5-turbo';

        // 1. Fetch User Settings if userId is provided
        if (request.userId) {
            await connectToDatabase();
            const user = await User.findOne({ clerkId: request.userId }).select('aiSettings');
            if (user && user.aiSettings) {
                apiKey = user.aiSettings.apiKey;
                // Priority: Request Model > User Default > Hardcoded Default
                if (request.model) {
                    model = request.model;
                } else if (user.aiSettings.defaultModel) {
                    model = user.aiSettings.defaultModel;
                }
            }
        }

        console.log(`[AIService] Routing to openrouter with model ${model}`);

        // 2. Route Request
        return this.generateOpenRouter(request.prompt, request.systemPrompt, model, apiKey, request.temperature);
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

    static async getAvailableModels(provider: 'openrouter', apiKey?: string): Promise<string[]> {
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
