import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const ALL_STATES = [
    "alabama", "alaska", "arizona", "arkansas", "california", "colorado", "connecticut", "delaware", "florida", "georgia",
    "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana", "maine", "maryland",
    "massachusetts", "michigan", "minnesota", "mississippi", "missouri", "montana", "nebraska", "nevada", "new-hampshire", "new-jersey",
    "new-mexico", "new-york", "north-carolina", "north-dakota", "ohio", "oklahoma", "oregon", "pennsylvania", "rhode-island", "south-carolina",
    "south-dakota", "tennessee", "texas", "utah", "vermont", "virginia", "washington", "west-virginia", "wisconsin", "wyoming"
];

async function fetchStateNewspapers(stateSlug: string) {
    const url = `https://allyoucanread.com/us/${stateSlug}/`;
    try {
        const response = await fetch(url);
        const html = await response.text();
        
        const newspapers: any[] = [];
        
        // 1. Find all H3 headers (Potential Newspapers)
        const h3Matches = Array.from(html.matchAll(/<h3.*?>\s*([\s\S]*?)\s*<\/h3>/g));
        
        // 2. Find all Links with their display text (Potential publication URLs)
        const linkMatches = Array.from(html.matchAll(/<a.*?href="(http[^"]+)".*?>\s*([\s\S]*?)\s*<\/a>/g));
        
        // 3. Find all Paragraphs (Descriptions)
        const pMatches = Array.from(html.matchAll(/<p.*?>\s*([\s\S]*?)\s*<\/p>/g));

        for (const h3 of h3Matches) {
            const rawName = h3[1].replace(/<[^>]*>?/gm, '').trim();
            if (!rawName) continue;

            const lowerName = rawName.toLowerCase();
            const blacklist = ["allyoucanread", "statewide media", "regional media", "national media", "copyright", "©", "2001 - 2026", "visit publication"];
            if (blacklist.some(b => lowerName.includes(b))) continue;
            if (ALL_STATES.some(s => s.replace(/-/g, ' ') === lowerName)) continue;
            if (rawName.length < 3) continue;

            // Find the URL: Look for a link whose text matches the name, OR the first link that appears after this H3
            const matchingLink = linkMatches.find(l => {
                const linkText = l[2].replace(/<[^>]*>?/gm, '').trim().toLowerCase();
                const linkUrl = l[1];
                return (linkText === lowerName || lowerName.includes(linkText)) && 
                       !linkUrl.includes('allyoucanread') && 
                       !linkUrl.includes('facebook') && 
                       !linkUrl.includes('twitter');
            });

            const url = matchingLink ? matchingLink[1] : null;
            
            const h3Index = h3.index || 0;
            const descriptionMatch = pMatches.find(p => (p.index || 0) > h3Index);
            const description = descriptionMatch ? descriptionMatch[1].replace(/<[^>]*>?/gm, '').trim() : "";

            if (url && rawName) {
                newspapers.push({ name: rawName, url, description });
            }
        }
        
        return newspapers;
    } catch (e) {
        console.error(`Failed to fetch ${stateSlug}:`, e);
        return [];
    }
}

async function debug() {
    console.log("Fetching Connecticut newspapers with NEW logic...");
    const news = await fetchStateNewspapers("connecticut");
    console.log(`Found ${news.length} newspapers:`);
    news.forEach((n, i) => console.log(`${i+1}. ${n.name} (${n.url})`));
}

debug();
