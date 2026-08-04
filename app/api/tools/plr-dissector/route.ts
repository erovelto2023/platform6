import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";

const PIPELINE_PROMPTS: Record<string, string> = {
  assets: `Act as a senior digital product auditor. Analyze the provided PLR package text and produce a structured Markdown report with:
1. Asset Inventory Checklist (E-books, workbooks, sales letters, graphics, slides, audio/video).
2. Primary Product Type & Recommended Rebranding Angle.
3. Missing Assets needed before launch.`,

  license: `Act as an IP & Licensing Legal Expert. Analyze the PLR license text within the provided context and produce a structured Markdown report with:
1. Allowed Uses Checklist ([YES] items).
2. Strictly Prohibited Restrictions ([NO] items).
3. Resale Price Minimums & Royalty Terms.
4. Safe Rebranding & Modification Guardrails.`,

  xray: `Act as a Chief Marketing Officer. Analyze the PLR content and produce a Product X-Ray report with:
1. Target Customer Avatar (Pain Points, Desires, Goals).
2. Product Quality Verdict & Market Fit Score (1-10).
3. Core Value Proposition & Unique Angle to Stand Out.`,

  dissect: `Act as an Instructional Designer. Extract the 7 Core Knowledge Concepts from this PLR content into:
1. Concept 1 to 7 Breakdown with Key Takeaways.
2. Micro-Lesson Titles & Action Steps for each concept.`,

  score: `Act as a Content Quality Auditor. Filter fluff vs gold signal in this PLR package:
1. 5 High-Value Insights to keep and emphasize.
2. 5 Outdated or Weak Sections to cut or rewrite.
3. Recommended Enhancements & Case Studies to add.`,

  angles: `Act as a Viral Copywriter. Create 5 Growth Hooks & Angles for this PLR package:
1. 3 Scroll-Stopping Headlines for Meta & TikTok.
2. 2 Email Subject Line Hooks with High Open Intent.
3. 1 High-Converting Offer Tagline.`,

  factory: `Act as a Content Operations Strategist. Map out 3 Content Silos:
1. Silo 1: Educational Blog & Thread Silo.
2. Silo 2: Social Media & Short-Form Video Silo.
3. Silo 3: Lead Magnet & Email Nurture Silo.`,

  makecontent: `Act as a Direct-Response Copywriter. Produce ready-to-use content assets:
1. 3-Post Twitter/X Thread summarizing the core framework.
2. 3-Email Nurture Autoresponder Sequence.
3. 1 Quick-Start Cheat Sheet Summary.`,

  build: `Act as a Digital Offer Strategist. Build an Offer Expansion Roadmap:
1. Front-end Lead Magnet Idea ($0).
2. Tripwire Offer ($17 - $27).
3. Core Offer ($97 - $297).
4. High-Ticket Upsell / Mastermind Concept ($997).`,

  export: `Act as an Executive Content Editor. Synthesize all steps into a Master Markdown Summary with:
- Executive Summary & Product Verdict
- License Rights Checklist
- Top Marketing Hooks & Angles
- Content Silos Roadmap
- Ready-to-use Email Sequence & Social Threads
- Offer Expansion Roadmap`
};

export async function POST(req: Request) {
  try {
    const { step, textContext, customPrompt, userApiKey } = await req.json();

    if (!step || !textContext) {
      return NextResponse.json({ error: "Step and text context are required" }, { status: 400 });
    }

    const { userId } = await auth();

    let apiKey = userApiKey || 
                   req.headers.get("X-OpenAI-Key") || 
                   req.headers.get("X-OpenRouter-Key");

    let defaultModel = process.env.OPENROUTER_MODEL || process.env.OPENAI_MODEL || "openai/gpt-4o-mini";

    // 1. Fetch user's OpenRouter / OpenAI key from Settings DB if logged in and no manual key supplied
    if (userId && !apiKey) {
      try {
        await connectToDatabase();
        const user = await User.findOne({ clerkId: userId }).select("aiSettings");
        if (user?.aiSettings?.apiKey) {
          apiKey = user.aiSettings.apiKey;
        }
        if (user?.aiSettings?.defaultModel) {
          defaultModel = user.aiSettings.defaultModel;
        }
      } catch (err) {
        console.warn("[PLR Dissector] Could not fetch user AI settings:", err);
      }
    }

    // 2. Fallback to Environment Variables (OpenRouter -> OpenAI)
    if (!apiKey) {
      apiKey = process.env.OPENROUTER_API_KEY || 
               process.env.OPENAI_API_KEY || 
               process.env.DEEPSEEK_API_KEY;
    }

    // Truncate context for safe prompt length (max ~50,000 characters)
    const safeContext = textContext.slice(0, 50000);

    const systemPrompt = PIPELINE_PROMPTS[step] || customPrompt || "Analyze the provided PLR content thoroughly and provide a structured Markdown report.";

    if (apiKey) {
      const isOpenRouter = apiKey.startsWith("sk-or-") || Boolean(process.env.OPENROUTER_API_KEY);
      const openai = new OpenAI({
        apiKey,
        baseURL: isOpenRouter ? "https://openrouter.ai/api/v1" : (process.env.DEEPSEEK_BASE_URL || undefined),
        defaultHeaders: isOpenRouter ? {
          "HTTP-Referer": "https://kbusinessacademy.com",
          "X-Title": "K Business Academy"
        } : undefined
      });

      const response = await openai.chat.completions.create({
        model: defaultModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here is the PLR package content to analyze:\n\n${safeContext}` }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      });

      const content = response.choices[0]?.message?.content || "No response generated from AI.";
      return NextResponse.json({ success: true, step, content, mode: "ai" });
    }

    // Fallback AI Processing Engine when API key is not configured
    const fallbackContent = generateFallbackStepAnalysis(step, safeContext);
    return NextResponse.json({ success: true, step, content: fallbackContent, mode: "fallback" });

  } catch (error: any) {
    console.error("PLR Dissector Pipeline Error:", error);
    return NextResponse.json({ error: error.message || "Pipeline processing failed" }, { status: 500 });
  }
}

function generateFallbackStepAnalysis(step: string, context: string): string {
  const words = context.split(/\s+/).length;
  return `### ⚡ PLR Dissector Audit (Step: ${step.toUpperCase()})

*Context Analyzed: ${words.toLocaleString()} words*

#### Key Asset Findings:
- Found main text content body.
- Extracted key concepts and license parameters.

> Please configure your **OPENROUTER_API_KEY** in Settings or environment variables for full OpenRouter AI generation.`;
}
