"use server";

type KeywordOptions = {
    deep?: boolean;
    questions?: boolean;
    prepositions?: boolean;
    matchType?: 'broad' | 'phrase' | 'exact';
    apiKey?: string;
}

// --- Helper Functions for Intent & Metrics ---

// --- Helper Functions for Intent & Metrics ---

function analyzeKeywordIntent(keyword: string) {
    const lower = keyword.toLowerCase();

    // Intent Classification
    let intent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational' = 'Informational';
    let funnelStage: 'Awareness' | 'Consideration' | 'Decision' = 'Awareness';
    let contentType: 'Blog Post' | 'Video' | 'Comparison Page' | 'Product Page' = 'Blog Post';

    if (lower.match(/\b(buy|price|cost|cheap|discount|coupon|deal|sale|order|purchase)\b/)) {
        intent = 'Transactional';
        funnelStage = 'Decision';
        contentType = 'Product Page';
    } else if (lower.match(/\b(best|top|vs|versus|review|comparison|review|guide|best of)\b/)) {
        intent = 'Commercial';
        funnelStage = 'Consideration';
        contentType = 'Comparison Page';
    } else if (lower.match(/\b(how|what|who|where|why|when|tutorial|tips|ideas|examples|learn|meaning|definition)\b/)) {
        intent = 'Informational';
        funnelStage = 'Awareness';
        contentType = 'Blog Post';
    }

    return { intent, funnelStage, contentType };
}

function calculateDerivedMetrics(volume: number, cpc: number, competition: number, intent: string) {
    // Simple heuristics for demonstration

    // CTR Estimate (Position 1 approx)
    const ctrEstimate = 32.0; // 32%
    const trafficPotential = Math.round(volume * (ctrEstimate / 100));

    // Buyer Intent Score (0-100)
    let buyerIntentScore = 20; // Base
    if (intent === 'Transactional') buyerIntentScore += 60;
    if (intent === 'Commercial') buyerIntentScore += 40;
    if (cpc > 2.0) buyerIntentScore += 10;
    if (cpc > 5.0) buyerIntentScore += 10;
    buyerIntentScore = Math.min(100, buyerIntentScore);

    // Monetization Potential (0-100)
    // High CPC + High Volume = High Potential
    let monetizationScore = Math.min(100, (cpc * 10) + (volume > 1000 ? 20 : 0));

    return {
        ctrEstimate,
        trafficPotential,
        buyerIntentScore,
        monetizationScore
    };
}

// --- Main Actions ---

async function fetchSuggestions(query: string) {
    try {
        const response = await fetch(`http://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`, {
            cache: 'no-store'
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data[1] || [];
    } catch (error) {
        return [];
    }
}

async function fetchRealMetrics(keywords: string[], apiKey: string) {
    try {
        const formData = new URLSearchParams();
        formData.append('country', 'us');
        formData.append('currency', 'USD');
        formData.append('dataSource', 'gkp');
        keywords.forEach(kw => formData.append('kw[]', kw));

        const response = await fetch('https://api.keywordseverywhere.com/v1/get_keyword_data', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: formData
        });

        if (!response.ok) {
            console.error("KE API Error:", await response.text());
            return null;
        }

        const data = await response.json();
        return data.data; // Returns array of { vol, cpc, competition, trend }
    } catch (error) {
        console.error("Failed to fetch real metrics:", error);
        return null;
    }
}

export async function getKeywordSuggestions(seedInput: string, options: KeywordOptions = {}) {
    try {
        if (!seedInput) return [];

        const seeds = seedInput.split(',').map(s => s.trim()).filter(s => s);
        let allKeywords = new Set<string>();

        const questionModifiers = ["who", "what", "where", "when", "why", "how", "can", "do", "does", "is", "are", "will"];
        const prepositionModifiers = ["for", "with", "without", "near", "to", "vs", "versus", "like", "and", "or"];
        const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789".split("");

        // Process each seed
        for (const seed of seeds) {
            const queriesToFetch: string[] = [seed];

            // 1. Deep Search (Alphabet Soup)
            if (options.deep) {
                alphabet.forEach(char => {
                    queriesToFetch.push(`${seed} ${char}`);
                });
            }

            // 2. Questions
            if (options.questions) {
                questionModifiers.forEach(mod => {
                    queriesToFetch.push(`${mod} ${seed}`);
                    queriesToFetch.push(`${seed} ${mod}`);
                });
            }

            // 3. Prepositions
            if (options.prepositions) {
                prepositionModifiers.forEach(mod => {
                    queriesToFetch.push(`${seed} ${mod}`);
                });
            }

            // Execute fetches
            const promises = queriesToFetch.map(q => fetchSuggestions(q));
            const results = await Promise.all(promises);

            results.flat().forEach((k: string) => allKeywords.add(k));
        }

        let uniqueKeywords = Array.from(allKeywords);

        // 4. Match Type Filtering
        if (options.matchType === 'phrase') {
            uniqueKeywords = uniqueKeywords.filter(k => seeds.some(seed => k.toLowerCase().includes(seed.toLowerCase())));
        } else if (options.matchType === 'exact') {
            uniqueKeywords = uniqueKeywords.filter(k => seeds.some(seed => k.toLowerCase() === seed.toLowerCase()));
        }

        // 5. Fetch Real Metrics if API Key provided
        let realMetricsMap = new Map();
        if (options.apiKey && uniqueKeywords.length > 0) {
            const batches = [];
            for (let i = 0; i < uniqueKeywords.length; i += 50) {
                batches.push(uniqueKeywords.slice(i, i + 50));
            }

            for (const batch of batches) {
                const metrics = await fetchRealMetrics(batch, options.apiKey);
                if (metrics) {
                    metrics.forEach((m: any) => {
                        realMetricsMap.set(m.keyword, m);
                    });
                }
            }
        }

        // 6. Map to final format with Advanced Metrics & Intent
        return uniqueKeywords.map((keyword: string) => {
            const real = realMetricsMap.get(keyword);
            const analysis = analyzeKeywordIntent(keyword);

            // Explicitly extract and cast to ensure primitives
            const intent = String(analysis.intent);
            const funnelStage = String(analysis.funnelStage);
            const contentType = String(analysis.contentType);

            if (typeof intent !== 'string') {
                console.error("CRITICAL ERROR: intent is not a string:", intent);
            }

            let volume = 0;
            let difficulty = 0;
            let cpc = 0;
            let trend = [];

            if (real) {
                volume = real.vol;
                difficulty = Math.round(real.competition * 100);
                cpc = parseFloat(real.cpc.currency === '$' ? real.cpc.value : real.cpc.value);
                trend = real.trend.map((t: any) => t.value);
            }

            const derived = calculateDerivedMetrics(volume, cpc, difficulty, intent);

            return {
                keyword,
                volume,
                difficulty,
                cpc: cpc.toFixed(2),
                results: 0,
                trend,
                // New Fields
                intent,
                funnelStage,
                contentType,
                trafficPotential: derived.trafficPotential,
                buyerIntentScore: derived.buyerIntentScore,
                monetizationScore: derived.monetizationScore,
                ctrEstimate: derived.ctrEstimate
            };
        });

    } catch (error) {
        console.error("Keyword fetch error:", error);
        return [];
    }
}

import { AIService } from "@/lib/ai-service";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db/connect";
import KeywordAnalysis from "@/lib/db/models/KeywordAnalysis";

export async function analyzeKeywordWithAI(keyword: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const prompt = `
    Analyze the keyword: "${keyword}" for SEO and Content Strategy.
    
    Provide the following in a structured JSON format (do not use markdown code blocks, just raw text that can be parsed as JSON):
    {
        "searchIntent": "Detailed explanation of what the user is looking for",
        "targetAudience": "Who is searching for this?",
        "contentIdeas": [
            { "title": "Idea 1", "type": "Blog Post" },
            { "title": "Idea 2", "type": "Video" },
            { "title": "Idea 3", "type": "Guide" }
        ],
        "secondaryKeywords": ["kw1", "kw2", "kw3"],
        "difficultyAnalysis": "Why is this easy/hard to rank for?",
        "monetizationIdeas": ["Affiliate", "AdSense", "Product"]
    }
    `;

    try {
        const response = await AIService.generate({
            prompt: prompt,
            systemPrompt: "You are an expert SEO strategist. You MUST return ONLY valid JSON. Do not include any introductory text, markdown formatting, or explanations. Just the JSON object.",
            userId: userId,
            model: "llama2:latest" // Use the available model
        });

        // Clean up response if it contains markdown code blocks
        let cleanContent = response.content.trim();
        if (cleanContent.startsWith("```json")) {
            cleanContent = cleanContent.replace(/^```json\n/, "").replace(/\n```$/, "");
        } else if (cleanContent.startsWith("```")) {
            cleanContent = cleanContent.replace(/^```\n/, "").replace(/\n```$/, "");
        }

        let result;
        try {
            result = JSON.parse(cleanContent);
        } catch (e) {
            console.warn("JSON Parse failed, attempting to fix common errors...");
            // Attempt to fix common JSON errors (trailing commas, etc)

            const fixedContent = cleanContent.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
            result = JSON.parse(fixedContent);
        }

        // Save to DB
        try {
            await connectToDatabase();
            await KeywordAnalysis.create({
                userId,
                keyword,
                ...result
            });
        } catch (dbError) {
            console.error("Failed to save keyword analysis to DB:", dbError);
            // We continue to return the result even if saving fails
        }

        return result;
    } catch (error: any) {
        console.error("AI Analysis failed. Error details:", error);
        console.error("Prompt used:", prompt);
        if (error.response) {
            console.error("AI Response:", error.response);
        }
        // Return a fallback mock result if AI fails completely, to prevent UI crash
        // This is a temporary measure to allow the user to see *something* while debugging
        if (error.message.includes("JSON")) {
            return {
                searchIntent: "Could not parse AI response. Try again.",
                targetAudience: "Unknown",
                contentIdeas: [],
                secondaryKeywords: [],
                difficultyAnalysis: "Analysis failed",
                monetizationIdeas: []
            };
        }
        throw new Error(`Failed to analyze keyword with AI: ${error.message}`);
    }
}

export async function generateMoreContentIdeas(keyword: string, existingIdeas: string[]) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const prompt = `
    I have the following content ideas for the keyword "${keyword}":
    ${existingIdeas.map(idea => `- ${idea}`).join('\n')}

    Generate 3 NEW, UNIQUE content ideas that are different from the ones above.
    
    Provide the output in this structured JSON format:
    {
        "contentIdeas": [
            { "title": "New Idea 1", "type": "Blog Post" },
            { "title": "New Idea 2", "type": "Video" },
            { "title": "New Idea 3", "type": "Guide" }
        ]
    }
    `;

    try {
        const response = await AIService.generate({
            prompt: prompt,
            systemPrompt: "You are an expert SEO strategist. You MUST return ONLY valid JSON. Do not include any introductory text. Just the JSON object.",
            userId: userId,
            model: "llama2:latest"
        });

        let cleanContent = response.content.trim();
        if (cleanContent.startsWith("```json")) {
            cleanContent = cleanContent.replace(/^```json\n/, "").replace(/\n```$/, "");
        } else if (cleanContent.startsWith("```")) {
            cleanContent = cleanContent.replace(/^```\n/, "").replace(/\n```$/, "");
        }

        let result;
        try {
            result = JSON.parse(cleanContent);
        } catch (e) {
            console.warn("JSON Parse failed, attempting to fix...", e);
            const fixedContent = cleanContent.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
            result = JSON.parse(fixedContent);
        }

        return result.contentIdeas || [];
    } catch (error: any) {
        console.error("Failed to generate more ideas:", error);
        // Fallback
        return [
            { title: `Guide to ${keyword}`, type: "Blog Post" },
            { title: `${keyword} Explained`, type: "Video" },
            { title: `Top 10 ${keyword} Tips`, type: "Listicle" }
        ];
    }
}

