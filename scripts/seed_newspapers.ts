import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
import connectToDatabase from "../lib/db/connect";
import Location from "../lib/db/models/Location";

const ALL_STATES = [
    "alabama", "alaska", "arizona", "arkansas", "california", "colorado", "connecticut", "delaware", "florida", "georgia",
    "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana", "maine", "maryland",
    "massachusetts", "michigan", "minnesota", "mississippi", "missouri", "montana", "nebraska", "nevada", "new-hampshire", "new-jersey",
    "new-mexico", "new-york", "north-carolina", "north-dakota", "ohio", "oklahoma", "oregon", "pennsylvania", "rhode-island", "south-carolina",
    "south-dakota", "tennessee", "texas", "utah", "vermont", "virginia", "washington", "west-virginia", "wisconsin", "wyoming"
];

const STATES = [
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

            // Filter out fluff headers
            const lowerName = rawName.toLowerCase();
            const blacklist = ["allyoucanread", "statewide media", "regional media", "national media", "copyright", "©", "2001 - 2026", "visit publication", "top ", " newspapers"];
            if (blacklist.some(b => lowerName.includes(b))) continue;
            
            // Exact state name check + DC
            const stateNames = [...ALL_STATES, "d.c.", "district of columbia"];
            if (stateNames.some(s => s.replace(/-/g, ' ') === lowerName)) continue;
            
            if (rawName.length < 3) continue;

            // Find the URL
            const matchingLink = linkMatches.find(l => {
                const linkText = l[2].replace(/<[^>]*>?/gm, '').trim().toLowerCase();
                const linkUrl = l[1];
                return (linkText === lowerName || lowerName.includes(linkText)) && 
                       !linkUrl.includes('allyoucanread') && 
                       !linkUrl.includes('facebook') && 
                       !linkUrl.includes('twitter') &&
                       !linkUrl.includes('statcounter');
            });

            const url = matchingLink ? matchingLink[1] : null;
            
            // Find description: The first paragraph after this H3's position in the HTML
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

async function seed() {
    try {
        await connectToDatabase();
        console.log("Connected to database. Starting newspaper seed...");

        for (const stateSlug of STATES) {
            console.log(`Processing ${stateSlug}...`);
            const newspapers = await fetchStateNewspapers(stateSlug);
            if (newspapers.length === 0) continue;

            const cities = await Location.find({ stateSlug, type: 'city' });
            
            for (const city of cities) {
                const cityNews = newspapers.filter(n => 
                    n.name.toLowerCase().includes(city.name.toLowerCase()) || 
                    n.description?.toLowerCase().includes(city.name.toLowerCase())
                );

                if (cityNews.length > 0) {
                    await Location.findByIdAndUpdate(city._id, {
                        $set: { newspapers: cityNews.map(n => ({ ...n, type: 'Local' })) }
                    });
                }
            }

            // Also attach all to the state itself as 'Regional/Statewide'
            await Location.findOneAndUpdate({ slug: stateSlug, type: 'state' }, {
                $set: { newspapers: newspapers.map(n => ({ ...n, type: 'Statewide' })) }
            });

            console.log(`  Done with ${stateSlug}. Found ${newspapers.length} newspapers.`);
            await new Promise(r => setTimeout(r, 1000));
        }

        console.log("Newspaper seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
