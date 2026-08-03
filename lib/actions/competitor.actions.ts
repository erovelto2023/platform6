"use server";

import connectDB from "@/lib/db/connect";
import Competitor from "@/lib/db/models/Competitor";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getCompetitors() {
    try {
        await connectDB();
        const clerkUser = await currentUser();
        if (!clerkUser) return [];

        const competitors = await Competitor.find({ userId: clerkUser.id }).sort({ updatedAt: -1 }).lean();
        return JSON.parse(JSON.stringify(competitors));
    } catch (error) {
        console.error("Error in getCompetitors:", error);
        return [];
    }
}

export async function getCompetitor(id: string) {
    try {
        await connectDB();
        const clerkUser = await currentUser();
        if (!clerkUser) return null;

        const competitor = await Competitor.findOne({ _id: id, userId: clerkUser.id }).lean();
        if (!competitor) return null;

        return JSON.parse(JSON.stringify(competitor));
    } catch (error) {
        console.error("Error in getCompetitor:", error);
        return null;
    }
}

export async function createCompetitor(data: {
    name: string;
    webAddress?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    phone?: string;
    fax?: string;
    email?: string;
    nicheMarket?: string;
    primaryKeyword?: string;
    notes?: string;
    logoUrl?: string;
}) {
    try {
        await connectDB();
        const clerkUser = await currentUser();
        if (!clerkUser) return { success: false, error: "Unauthorized" };

        if (!data.name?.trim()) {
            return { success: false, error: "Competitor name is required" };
        }

        const competitor = await Competitor.create({
            userId: clerkUser.id,
            name: data.name.trim(),
            webAddress: data.webAddress || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zip: data.zip || '',
            country: data.country || '',
            phone: data.phone || '',
            fax: data.fax || '',
            email: data.email || '',
            nicheMarket: data.nicheMarket || '',
            primaryKeyword: data.primaryKeyword || '',
            notes: data.notes || '',
            logoUrl: data.logoUrl || '',
            modulesData: {}
        });

        revalidatePath("/tools/competition-black-book");
        return { success: true, competitor: JSON.parse(JSON.stringify(competitor)) };
    } catch (error: any) {
        console.error("Error creating competitor:", error);
        return { success: false, error: error.message };
    }
}

export async function updateCompetitor(id: string, data: any) {
    try {
        await connectDB();
        const clerkUser = await currentUser();
        if (!clerkUser) return { success: false, error: "Unauthorized" };

        const competitor = await Competitor.findOneAndUpdate(
            { _id: id, userId: clerkUser.id },
            { ...data, updatedAt: new Date() },
            { new: true }
        );

        revalidatePath("/tools/competition-black-book");
        revalidatePath(`/tools/competition-black-book/${id}`);
        return { success: true, competitor: JSON.parse(JSON.stringify(competitor)) };
    } catch (error: any) {
        console.error("Error updating competitor:", error);
        return { success: false, error: error.message };
    }
}

export async function updateCompetitorModule(id: string, moduleKey: string, moduleContent: any) {
    try {
        await connectDB();
        const clerkUser = await currentUser();
        if (!clerkUser) return { success: false, error: "Unauthorized" };

        const updateKey = `modulesData.${moduleKey}`;
        const competitor = await Competitor.findOneAndUpdate(
            { _id: id, userId: clerkUser.id },
            { $set: { [updateKey]: moduleContent, updatedAt: new Date() } },
            { new: true }
        );

        revalidatePath(`/tools/competition-black-book/${id}`);
        return { success: true, competitor: JSON.parse(JSON.stringify(competitor)) };
    } catch (error: any) {
        console.error("Error updating competitor module:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteCompetitor(id: string) {
    try {
        await connectDB();
        const clerkUser = await currentUser();
        if (!clerkUser) return { success: false, error: "Unauthorized" };

        await Competitor.deleteOne({ _id: id, userId: clerkUser.id });

        revalidatePath("/tools/competition-black-book");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting competitor:", error);
        return { success: false, error: error.message };
    }
}

export interface CompetitorAnalysisResult {
    domain: string;
    domainAuthority: number;
    organicKeywords: number;
    organicTraffic: number;
    paidTraffic: number;
    estimatedTraffic: number;
    trafficHistory: any[];
    topPages: { url: string; topKeyword: string; estimatedTraffic: number }[];
    topKeywords: { keyword: string; position: number; volume: number; difficulty: number; traffic: number }[];
}

export interface KeywordGapResult {
    sharedKeywords: string[];
    uniqueKeywords: string[];
    gapKeywords: { keyword: string; competitorPosition: number; volume: number }[];
    shared: any[];
    missing: any[];
    weak: any[];
    strong: any[];
    unique: any[];
}

export async function getCompetitorAnalysis(domain: string): Promise<CompetitorAnalysisResult> {
    return {
        domain,
        domainAuthority: 45,
        organicKeywords: 1250,
        organicTraffic: 45000,
        paidTraffic: 3200,
        estimatedTraffic: 45000,
        trafficHistory: [],
        topPages: [],
        topKeywords: [
            { keyword: `${domain} review`, position: 1, volume: 8400, difficulty: 35, traffic: 3200 },
            { keyword: `best ${domain} alternatives`, position: 2, volume: 3200, difficulty: 42, traffic: 1500 },
            { keyword: `how to use ${domain}`, position: 3, volume: 1900, difficulty: 28, traffic: 800 },
        ]
    };
}

export async function getKeywordGapAnalysis(myDomain: string, competitorDomain: string): Promise<KeywordGapResult> {
    return {
        sharedKeywords: ["business tools", "online academy", "niche research"],
        uniqueKeywords: ["fast funnel builder", "story generator"],
        gapKeywords: [
            { keyword: "wholesale supplier directory", competitorPosition: 2, volume: 14500 },
            { keyword: "competitor tracking software", competitorPosition: 1, volume: 9200 },
        ],
        shared: [],
        missing: [],
        weak: [],
        strong: [],
        unique: []
    };
}

export async function extractCompetitorIntelFromUrl(url: string) {
    try {
        let cleanUrl = url.trim();
        if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
            cleanUrl = `https://${cleanUrl}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(cleanUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            return { success: false, error: `HTTP ${response.status}: Failed to reach site` };
        }

        const html = await response.text();

        // 1. Extract Meta Title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : '';

        // 2. Extract Meta Description
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
        const description = descMatch ? descMatch[1].trim() : '';

        // 3. Extract OpenGraph Site Name & Image
        const siteNameMatch = html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i);
        const siteName = siteNameMatch ? siteNameMatch[1].trim() : '';

        const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
        const logoUrl = ogImageMatch ? ogImageMatch[1].trim() : '';

        // 4. Detect Tech Stack
        const detectedTech: string[] = [];
        if (/shopify/i.test(html)) detectedTech.push('Shopify');
        if (/woocommerce|wp-content/i.test(html)) detectedTech.push('WordPress / WooCommerce');
        if (/_next\/static|__NEXT_DATA__/i.test(html)) detectedTech.push('Next.js');
        if (/webflow/i.test(html)) detectedTech.push('Webflow');
        if (/stripe\.com/i.test(html)) detectedTech.push('Stripe Payment Gateway');
        if (/paypal\.com/i.test(html)) detectedTech.push('PayPal');
        if (/googletagmanager|google-analytics/i.test(html)) detectedTech.push('Google Analytics 4 / GTM');
        if (/connect\.facebook\.net/i.test(html)) detectedTech.push('Meta / Facebook Pixel');
        if (/analytics\.tiktok\.com/i.test(html)) detectedTech.push('TikTok Pixel');
        if (/hubspot/i.test(html)) detectedTech.push('HubSpot CRM');
        if (/intercom/i.test(html)) detectedTech.push('Intercom Live Chat');
        if (/crisp\.chat/i.test(html)) detectedTech.push('Crisp Live Chat');
        if (/zendesk/i.test(html)) detectedTech.push('Zendesk Support');

        // 5. Extract Social Media Links
        const socialLinks: { platform: string; url: string }[] = [];
        const socialRegex = /href=["'](https?:\/\/(?:www\.)?(facebook|instagram|twitter|x|linkedin|youtube|tiktok|pinterest|reddit|discord)\.com\/[^"']+)["']/gi;
        let match;
        const seenPlatforms = new Set();
        while ((match = socialRegex.exec(html)) !== null) {
            const platform = match[2].toLowerCase();
            if (!seenPlatforms.has(platform)) {
                seenPlatforms.add(platform);
                socialLinks.push({ platform: platform.toUpperCase(), url: match[1] });
            }
        }

        // 6. Extract Emails
        const emailMatch = html.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
        const email = emailMatch ? emailMatch[1] : '';

        return {
            success: true,
            extracted: {
                title,
                description,
                siteName,
                logoUrl,
                email,
                detectedTech,
                socialLinks
            }
        };
    } catch (error: any) {
        console.error("Auto extraction error:", error);
        return { success: false, error: "Failed to scrape site (CORS or timeout)" };
    }
}

export async function executeAiStrategyPrompt(prompt: string) {
    try {
        const { auth } = await import("@clerk/nextjs/server");
        const { userId } = await auth();
        const { AIService } = await import("@/lib/ai-service");

        const response = await AIService.generate({
            prompt,
            systemPrompt: "You are a world-class Chief Marketing Officer and Competitive Intelligence Expert. Provide detailed, actionable markdown strategy output.",
            userId: userId || undefined,
            model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini"
        });

        return { success: true, result: response.content };
    } catch (error: any) {
        console.error("AI Strategy Prompt error:", error);
        return { success: false, error: error.message || "Failed to generate AI strategy" };
    }
}
