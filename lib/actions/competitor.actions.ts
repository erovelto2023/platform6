"use server";

export interface CompetitorKeyword {
    keyword: string;
    position: number;
    volume: number;
    difficulty: number;
    traffic: number;
    url: string;
}

export interface CompetitorPage {
    url: string;
    topKeyword: string;
    keywordsCount: number;
    estimatedTraffic: number;
}

export interface CompetitorAnalysisResult {
    domain: string;
    organicTraffic: number;
    organicKeywords: number;
    paidTraffic: number;
    paidKeywords: number;
    domainAuthority: number;
    topKeywords: CompetitorKeyword[];
    topPages: CompetitorPage[];
    trafficHistory: { date: string; organic: number; paid: number }[];
}

export interface KeywordGapResult {
    shared: CompetitorKeyword[];
    missing: CompetitorKeyword[]; // Keywords competitor has but you don't
    weak: CompetitorKeyword[]; // Keywords where you rank lower than competitor
    strong: CompetitorKeyword[]; // Keywords where you rank higher
    unique: CompetitorKeyword[]; // Keywords only you have
}

// Helper to generate consistent mock data based on a string seed
function pseudoRandom(seed: string) {
    let value = 0;
    for (let i = 0; i < seed.length; i++) {
        value += seed.charCodeAt(i);
    }
    return function () {
        value = (value * 9301 + 49297) % 233280;
        return value / 233280;
    };
}

export async function getCompetitorAnalysis(domain: string): Promise<CompetitorAnalysisResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const rng = pseudoRandom(domain);
    const baseVolume = Math.floor(rng() * 50000) + 5000;

    // Generate realistic-looking keywords based on domain parts
    const domainParts = domain.split('.')[0].replace(/-/g, ' ').split(' ');
    const coreTopic = domainParts[0] || "business";

    const keywords: CompetitorKeyword[] = [];
    const modifiers = ["best", "cheap", "guide", "review", "services", "tools", "software", "tips", "how to", "vs"];

    for (let i = 0; i < 20; i++) {
        const mod = modifiers[Math.floor(rng() * modifiers.length)];
        const vol = Math.floor(rng() * 10000) + 100;
        const pos = Math.floor(rng() * 20) + 1;
        keywords.push({
            keyword: `${mod} ${coreTopic} ${i > 10 ? 'online' : ''}`.trim(),
            position: pos,
            volume: vol,
            difficulty: Math.floor(rng() * 100),
            traffic: Math.floor(vol * (1 / pos) * 0.3), // Rough traffic est
            url: `https://${domain}/${coreTopic}-page-${i}`
        });
    }

    const pages: CompetitorPage[] = [];
    for (let i = 0; i < 5; i++) {
        pages.push({
            url: `https://${domain}/blog/${coreTopic}-guide-${i}`,
            topKeyword: keywords[i].keyword,
            keywordsCount: Math.floor(rng() * 500) + 50,
            estimatedTraffic: Math.floor(rng() * 5000) + 1000
        });
    }

    const history = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (const month of months) {
        history.push({
            date: `${month} 2024`,
            organic: Math.floor(baseVolume * (0.8 + rng() * 0.4)),
            paid: Math.floor(baseVolume * 0.1 * (0.8 + rng() * 0.4))
        });
    }

    return {
        domain,
        organicTraffic: Math.floor(baseVolume * 1.5),
        organicKeywords: Math.floor(baseVolume / 10),
        paidTraffic: Math.floor(baseVolume * 0.2),
        paidKeywords: Math.floor(baseVolume / 50),
        domainAuthority: Math.floor(rng() * 60) + 20,
        topKeywords: keywords.sort((a, b) => a.position - b.position),
        topPages: pages.sort((a, b) => b.estimatedTraffic - a.estimatedTraffic),
        trafficHistory: history
    };
}

export async function getKeywordGapAnalysis(myDomain: string, competitorDomain: string): Promise<KeywordGapResult> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const myData = await getCompetitorAnalysis(myDomain);
    const compData = await getCompetitorAnalysis(competitorDomain);

    // In a real scenario, we'd intersect real large datasets.
    // Here we'll artificially create the segments for demonstration.

    const rng = pseudoRandom(myDomain + competitorDomain);

    const generateList = (count: number, prefix: string) => {
        return Array.from({ length: count }).map((_, i) => ({
            keyword: `${prefix} keyword ${i}`,
            position: Math.floor(rng() * 20) + 1,
            volume: Math.floor(rng() * 5000) + 100,
            difficulty: Math.floor(rng() * 100),
            traffic: 0,
            url: `https://${competitorDomain}/page`
        }));
    };

    return {
        shared: generateList(15, "shared"),
        missing: generateList(20, "competitor-only"),
        weak: generateList(10, "opportunity"),
        strong: generateList(10, "winning"),
        unique: generateList(15, "my-unique")
    };
}
