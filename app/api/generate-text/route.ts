import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
    const userKey = req.headers.get("X-OpenAI-Key") || 
                    req.headers.get("X-OpenRouter-Key") || 
                    process.env.OPENROUTER_API_KEY || 
                    process.env.OPENAI_API_KEY;

    if (!userKey) {
        return NextResponse.json({ error: "AI API key is required. Please set OPENROUTER_API_KEY in environment or Settings." }, { status: 401 });
    }

    const isOpenRouter = userKey.startsWith("sk-or-") || Boolean(process.env.OPENROUTER_API_KEY);
    const openai = new OpenAI({
        apiKey: userKey,
        baseURL: isOpenRouter ? "https://openrouter.ai/api/v1" : (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1"),
        defaultHeaders: isOpenRouter ? {
            "HTTP-Referer": "https://kbusinessacademy.com",
            "X-Title": "K Business Academy"
        } : undefined
    });

    try {
        const { prompt, systemPrompt, maxTokens = 1000, model } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: model || process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
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
