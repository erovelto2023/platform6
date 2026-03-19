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
        const blocks = html.split(/<h3/);
        
        for (let i = 1; i < blocks.length; i++) {
            const block = blocks[i];
            
            // Extract title from the rest of the h3 tag
            const nameMatch = block.match(/.*?>(.*?)<\/h3>/);
            const name = nameMatch ? nameMatch[1].replace(/<[^>]*>?/gm, '').trim() : "";
            
            // Extract first link that isn't an internal/social link
            const linkMatch = block.match(/href="(http[^"]+)"/);
            const link = linkMatch ? linkMatch[1].trim() : "";
            
            // Extract first paragraph as description
            const descMatch = block.match(/<p.*?>(.*?)<\/p>/);
            const description = descMatch ? descMatch[1].replace(/<[^>]*>?/gm, '').trim() : "";
            
            if (name && link && !link.includes('allyoucanread') && !link.includes('facebook') && !link.includes('twitter')) {
                const lowerName = name.toLowerCase().trim();
                const blacklist = ["allyoucanread", "statewide media", "regional media", "national media", "copyright", "©", "2001 - 2026", "visit publication"];
                const isBlacklisted = blacklist.some(b => lowerName.includes(b));
                const isStateName = ALL_STATES.some(s => s.replace(/-/g, ' ') === lowerName);

                if (!isBlacklisted && !isStateName && name.length > 3) {
                    newspapers.push({ name, url: link, description });
                }
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
