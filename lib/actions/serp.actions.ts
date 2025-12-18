"use server";

export interface SerpResult {
    position: number;
    title: string;
    url: string;
    description: string;
    da: number; // Domain Authority
    pa: number; // Page Authority
    backlinks: number;
    wordCount: number;
    keywordInTitle: boolean;
    keywordInUrl: boolean;
    keywordInMeta: boolean;
}

export interface SerpAnalysisResult {
    keyword: string;
    results: SerpResult[];
    features: {
        featuredSnippet: boolean;
        peopleAlsoAsk: string[];
        videoCarousel: boolean;
        imagePack: boolean;
    };
    difficultyScore: number;
}

export async function getSerpAnalysis(keyword: string): Promise<SerpAnalysisResult> {
    // In a real app, this would call a SERP API like DataForSEO, SerpApi, or similar.
    // For this demonstration, we will generate realistic mock data based on the keyword.

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockTitles = [
        `The Ultimate Guide to ${keyword}`,
        `Best ${keyword} in 2025: Reviews & Buying Guide`,
        `What is ${keyword}? Everything You Need to Know`,
        `Top 10 ${keyword} for Beginners`,
        `${keyword} - Wikipedia`,
        `How to Choose the Right ${keyword}`,
        `${keyword} vs. Competitor: Which is Better?`,
        `The Truth About ${keyword} (Don't Buy Until You Read This)`,
        `Affordable ${keyword} Deals & Discounts`,
        `Professional ${keyword} Services`
    ];

    const mockDomains = [
        "www.example.com", "www.wikipedia.org", "www.nytimes.com", "www.techradar.com",
        "www.reddit.com", "www.medium.com", "www.youtube.com", "www.amazon.com",
        "www.healthline.com", "www.forbes.com"
    ];

    const results: SerpResult[] = mockTitles.map((title, index) => {
        const domain = mockDomains[index % mockDomains.length];
        const da = Math.floor(Math.random() * 60) + 20 + (10 - index) * 2; // Higher rank usually higher DA

        return {
            position: index + 1,
            title: title,
            url: `https://${domain}/${keyword.replace(/ /g, "-")}`,
            description: `Looking for ${keyword}? This comprehensive guide covers everything about ${keyword}, including tips, tricks, and expert advice. Read more to find out...`,
            da: da,
            pa: da - Math.floor(Math.random() * 10),
            backlinks: Math.floor(Math.random() * 1000) * (10 - index),
            wordCount: Math.floor(Math.random() * 2000) + 800,
            keywordInTitle: Math.random() > 0.2, // 80% chance
            keywordInUrl: Math.random() > 0.3, // 70% chance
            keywordInMeta: Math.random() > 0.1, // 90% chance
        };
    });

    return {
        keyword,
        results,
        features: {
            featuredSnippet: Math.random() > 0.7,
            peopleAlsoAsk: [
                `What is the best ${keyword}?`,
                `How much does ${keyword} cost?`,
                `Is ${keyword} worth it?`,
                `Can you do ${keyword} at home?`
            ],
            videoCarousel: Math.random() > 0.5,
            imagePack: Math.random() > 0.4
        },
        difficultyScore: Math.round(results.reduce((acc, curr) => acc + curr.da, 0) / results.length)
    };
}
