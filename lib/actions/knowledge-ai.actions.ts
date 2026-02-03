"use server";

import { AIService } from "@/lib/ai-service";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
// import Article from "@/lib/db/models/Article"; // TODO: Create Article model
import { revalidatePath } from "next/cache";

interface SpokeData {
    title: string;
    shortAnswerGoal: string;
    relevantTool: string;
    affiliateResource: string;
    youtubeVideo: string;
}

interface HubData {
    title: string;
    outline: string[];
}

interface KBPlan {
    hub: HubData;
    spokes: SpokeData[];
}

export async function generateKnowledgePlan(mainKeyword: string): Promise<KBPlan | null> {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const prompt = `
Role: You are an expert Content Architect and SEO Strategist specializing in the Internet Marketing niche. Your goal is to design a robust, hierarchical Knowledge Base structure for "K Business Academy."

The Objective: Create a "Hub-and-Spoke" content map for the main keyword: "${mainKeyword}".

The Structure Requirements:

The Hub (The Pillar): Define a comprehensive "Ultimate Guide" title that targets the main keyword. Provide a 5-point outline for this guide.

The Spokes (The PAA Cluster): Generate 10 specific articles based on "People Also Asked" (PAA) style questions. these must be formatted as: Question Title -> Short Answer Goal -> Relevant Tool/Resource.

The Content Block Template: For each Spoke article, you must include a placeholder for:
1. An Internal K-Tool (choose from: Amazon Product Engine, Pinterest Pin Generator, Workbook Designer, Niche Business in a Box).
2. An External Affiliate Resource (e.g., Hosting, CRM, or Keyword Research software).
3. A YouTube Video Embed topic.

Interlinking Strategy: Describe exactly how the Spokes should link to the Hub and how they should "Cross-Pollinate" to other relevant categories to keep users on the site.

Tone & Voice: Professional, actionable, and "Guru-free." Focus on systems and execution over hype.

Specific Data to Integrate:
Company Name: K Business Academy.
Core Philosophy: Build once, profit repeatedly. Assets over trends.
Available Tools: Amazon Product Engine, Pinterest Pin Generator, Workbook Designer, Niche Business in a Box.

Output Format: 
You MUST return the response strictly as a VALID JSON object. No other text, no markdown formatting, no code blocks.
The JSON structure must be:
{
  "hub": {
    "title": "The Hub Title",
    "outline": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"]
  },
  "spokes": [
    {
      "title": "Question/Title",
      "shortAnswerGoal": "Goal description",
      "relevantTool": "Tool Name",
      "affiliateResource": "Resource Name",
      "youtubeVideo": "Video Topic"
    }
  ]
}
`;

    try {
        const response = await AIService.generate({
            prompt,
            model: "deepseek-r1"
        });

        const content = response.content;
        const jsonString = content.replace(/```json\n?|\n?```/g, "").trim();
        const plan: KBPlan = JSON.parse(jsonString);
        return plan;
    } catch (error) {
        console.error("Failed to generate plan:", error);
        return null;
    }
}


// TODO: Uncomment when Article model is created
/*
export async function saveKnowledgePlan(plan: KBPlan, mainKeyword: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    try {
        await connectDB();

        // 1. Create Hub
        const hub = await Article.create({
            title: plan.hub.title,
            type: 'hub',
            status: 'planned',
            seo: { keyword: mainKeyword },
            hubDetails: { outline: plan.hub.outline }
        });

        // 2. Create Spokes
        const spokes = await Promise.all(plan.spokes.map(spoke =>
            Article.create({
                title: spoke.title,
                type: 'spoke',
                status: 'planned',
                parentArticle: hub._id,
                seo: { keyword: spoke.title },
                spokeDetails: {
                    question: spoke.title,
                    answerGoal: spoke.shortAnswerGoal,
                    relevantTool: spoke.relevantTool,
                    affiliateResource: spoke.affiliateResource,
                    youtubeVideo: spoke.youtubeVideo
                }
            })
        ));

        revalidatePath("/admin/knowledge-base");
        return { success: true, hubId: hub._id };

    } catch (error) {
        console.error("Save plan error:", error);
        throw new Error("Failed to save plan");
    }
}
*/

export async function saveKnowledgePlan(plan: KBPlan, mainKeyword: string) {
    throw new Error("Article model not yet implemented");
}



// TODO: Uncomment when Article model is created
/*
export async function generateArticleContent(articleId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectDB();
    const article = await Article.findById(articleId);
    if (!article) throw new Error("Article not found");

    let prompt = "";
    const kp = article.knowledgePower || {};

    if (article.type === 'spoke') {
        const details = article.spokeDetails || {};

        const question = details.question || article.title;
        const answerGoal = details.answerGoal || kp.executiveSummary?.straightTruth || "Provide a direct answer";
        const relevantTool = details.relevantTool || kp.techStack?.requiredTools?.[0] || "Suggest a relevant tool";
        const affiliate = details.affiliateResource || kp.techStack?.communityForums?.[0] || "Suggest a resource";
        const video = details.youtubeVideo || kp.multimedia?.videoSearchTerms?.[0] || "Topic related to " + question;

        prompt = `
Role: You are an expert Content Architect and SEO Strategist for "K Business Academy".
Task: Write the full content for the article titled "${article.title}".

Context:
This article is a "Spoke" in a Hub-and-Spoke structure.
Target Keyword/Question: "${question}"
Short Answer Goal: "${answerGoal}"
Relevant Internal Tool to Mention: "${relevantTool}"
External Affiliate Resource to Suggest: "${affiliate}"
YouTube Video Topic to Embed: "${video}"

Content Requirements:
- Use the Content Block Template: Include placeholders/sections for the Internal K-Tool, External Affiliate Resource, and YouTube Video.
- Interlinking: Suggest links back to the Hub (if you don't know the hub title, just say "The Ultimate Guide").
- Tone & Voice: Professional, actionable, "Guru-free".
- Company: K Business Academy (Philosophy: Build once, profit repeatedly).
- Format: HTML/Markdown compatible. Use h2, h3, p, ul, li.
`;
    } else if (article.type === 'hub') {
        const details = article.hubDetails;
        prompt = `
Role: You are an expert Content Architect and SEO Strategist for "K Business Academy".
Task: Write the comprehensive "Ultimate Guide" (Hub) content for the article titled "${article.title}".

Outline to follow:
${details.outline?.join('\n')}

Content Requirements:
- Tone & Voice: Professional, actionable, "Guru-free".
- Company: K Business Academy.
- Format: HTML/Markdown compatible.
`;
    } else {
        return { error: "Not a Hub or Spoke" };
    }

    try {
        const response = await AIService.generate({
            prompt,
            model: "deepseek-r1",
            userId
        });

        // Update article
        article.content = response.content;
        await article.save();

        revalidatePath(`/admin/knowledge-base/${articleId}`);
        return { success: true, content: response.content };
    } catch (error: any) {
        console.error("Content gen error:", error);
        throw new Error(`Failed to generate content: ${error.message || "Unknown error"}`);
    }
}
*/

export async function generateArticleContent(articleId: string) {
    throw new Error("Article model not yet implemented");
}

