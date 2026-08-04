"use server";

import { AIService } from '@/lib/ai-service';

export async function generateAiActivityContent(
    activityType: string,
    topic: string
) {
    try {
        if (!topic.trim()) {
            return { success: false, error: "Topic is required" };
        }

        let prompt = "";

        if (activityType === "wordsearch" || activityType === "scramble" || activityType === "missing") {
            prompt = `Generate 15 uppercase single-word terms related to the topic "${topic}".
Output ONLY the words, one per line. No numbers, no spaces, no punctuation, no bullet points. All uppercase.`;
        } else if (activityType === "crossword") {
            prompt = `Generate 8 crossword puzzle items related to the topic "${topic}".
Output each item on a new line in the format: WORD : Clue hint
Example:
GALAXY : A massive system of stars and solar systems
ORBIT : The curved path of a celestial object`;
        } else if (activityType === "fillin") {
            prompt = `Generate 5 fill-in-the-blank sentences related to the topic "${topic}".
Mark the blank target word inside square brackets like [word].
Example:
The Earth revolves around the [Sun] every year.
Photosynthesis requires [sunlight] and water.`;
        } else {
            prompt = `Generate 10 relevant educational vocabulary words or facts for the topic "${topic}".
Output as clean text, one item per line.`;
        }

        const response = await AIService.generate({
            prompt,
            systemPrompt: "You are an expert educational workbook content creator.",
            temperature: 0.7
        });

        return { success: true, text: (response.content || "").trim() };
    } catch (error: any) {
        console.error("generateAiActivityContent error:", error);
        return { success: false, error: error.message || "Failed to generate AI content" };
    }
}

export async function generateAiFullWorkbookPlan(
    topic: string,
    pageCount: number = 3
) {
    try {
        const prompt = `Create a ${pageCount}-page educational printable workbook outline for topic: "${topic}".
Return a JSON array where each object represents a page:
[
  {
    "pageTitle": "Page Title",
    "activityType": "wordsearch" | "crossword" | "fillin" | "scramble",
    "instructions": "Simple instructions for students",
    "content": "Raw content text formatted for that activity"
  }
]
Output ONLY valid JSON.`;

        const response = await AIService.generate({
            prompt,
            systemPrompt: "You are an expert workbook designer API. Respond ONLY with valid JSON array.",
            temperature: 0.7
        });

        const raw = response.content || "";
        const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        const pages = JSON.parse(cleaned);

        return { success: true, pages };
    } catch (error: any) {
        console.error("generateAiFullWorkbookPlan error:", error);
        return { success: false, error: error.message || "Failed to generate full workbook" };
    }
}
