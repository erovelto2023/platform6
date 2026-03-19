import { MarketService } from "../lib/services/market.service";

async function test() {
    const city = "Bellevue";
    const stateSuffix = "KY";
    console.log(`Searching Market Dominance for ${city}, ${stateSuffix}...`);
    
    const dominance = await MarketService.getMarketDominance(city, stateSuffix);
    if (dominance && Object.keys(dominance).length > 0) {
        console.log("Success! Found", Object.keys(dominance).length, "categories.");
        const total = Object.values(dominance).reduce((acc, d) => acc + d.count, 0);
        console.log("Total businesses found:", total);
        if (total === 0) {
            console.log("Warning: Total businesses found is 0.");
        }
    } else {
        console.log("Failed to find dominance data or returned empty object.");
    }
}
test();
