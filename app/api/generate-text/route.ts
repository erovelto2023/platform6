import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
    const userKey = req.headers.get("X-OpenAI-Key");

    // STRICT BYOK
    if (!userKey) {
        return NextResponse.json({ error: "AI API key is required. Please set it in Settings." }, { status: 401 });
    }

    // Initialize client wrapper locally with the user's key
    const openai = new OpenAI({
        apiKey: userKey,
        baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1", // Allow DeepSeek URL override from env, or default
    });

    try {
        const { prompt, systemPrompt, maxTokens = 1000 } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: "deepseek-chat", // or gpt-4
            messages: [
                { role: "system", content: systemPrompt || "You are a helpful assistant." },
                { role: "user", content: prompt }
            ],
            max_tokens: maxTokens,
        });

        const content = response.choices[0].message.content;

        return NextResponse.json({ success: true, content });

    } catch (error: any) {
        console.error("Text Generation Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate text" }, { status: 500 });
    }
}
