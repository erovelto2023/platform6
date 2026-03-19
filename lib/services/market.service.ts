export interface MarketPulseData {
    searchIntent: string[];
    monthlyMomentum: number;
    businessDensity: Record<string, number>;
}

export class MarketService {
    /**
     * Get real-time search intent using Google Autocomplete (Free)
     */
    static async getSearchIntent(city: string, state: string): Promise<string[]> {
        const fetchIntent = async (q: string) => {
            try {
                const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(q)}`;
                const res = await fetch(url);
                const data = await res.json();
                return data[1] || [];
            } catch (e) { return []; }
        };

        const queries = [
            `best business to start in ${city} ${state}`,
            `${city} ${state} community events`,
            `${city} ${state} needed services`,
            `${city} ${state} problems`,
            `future of ${city} ${state}`
        ];

        const allResults = await Promise.all(queries.map(q => fetchIntent(q)));
        // Flatten, deduplicate, and filter for relevance
        const unified = Array.from(new Set(allResults.flat()))
            .filter(s => s.toLowerCase().includes(city.toLowerCase()));
            
        // If still thin, add one generic fallback
        if (unified.length < 3) {
            const fallback = await fetchIntent(`${city} ${state}`);
            unified.push(...fallback);
        }

        return Array.from(new Set(unified)).slice(0, 8);
    }

    /**
     * Get city momentum based on Wikipedia Pageviews (Free)
     */
    static async getCityMomentum(city: string, state: string): Promise<number> {
        const fetchViews = async (title: string) => {
            try {
                const article = encodeURIComponent(title.replace(/ /g, "_"));
                const end = new Date();
                const start = new Date();
                start.setDate(end.getDate() - 30);
                
                const formatDate = (d: Date) => d.toISOString().split('T')[0].replace(/-/g, '');
                const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${article}/daily/${formatDate(start)}/${formatDate(end)}`;
                
                const res = await fetch(url);
                if (!res.ok) return 0;
                const data = await res.json();
                
                if (data.items) {
                    return data.items.reduce((acc: number, item: any) => acc + item.views, 0);
                }
                return 0;
            } catch (e) { return 0; }
        };

        // Try City, State first
        let views = await fetchViews(`${city},_${state}`);
        // If 0, try just City
        if (views === 0) {
            views = await fetchViews(city);
        }
        return views;
    }

    /**
     * Get upcoming events via Ticketmaster (Free Tier)
     * Broadened to include craft fairs, parades, and conferences.
     */
    static async getUpcomingEvents(city: string, stateCode: string): Promise<any[]> {
        const apiKey = process.env.TICKETMASTER_API_KEY;
        if (!apiKey) {
            console.warn("[MarketService] No TICKETMASTER_API_KEY found in .env.local");
            return [];
        }

        try {
            // Search with keywords for community events
            const keywords = encodeURIComponent("craft fair parade festival conference");
            const url = `https://app.ticketmaster.com/discovery/v2/events.json?city=${encodeURIComponent(city)}&stateCode=${stateCode}&keyword=${keywords}&size=10&sort=date,asc&apikey=${apiKey}`;
            
            const res = await fetch(url);
            if (!res.ok) return [];
            const data = await res.json();
            
            if (data._embedded && data._embedded.events) {
                return data._embedded.events.map((e: any) => ({
                    name: e.name,
                    date: e.dates.start.localDate,
                    venue: e._embedded?.venues?.[0]?.name || "Local Venue",
                    url: e.url
                }));
            }
            return [];
        } catch (error) {
            console.error("[MarketService] Events fetch error:", error);
            return [];
        }
    }

    /**
     * Get business density counts via OpenStreetMap (Overpass API - Free)
     */
    static async getBusinessDensity(city: string, stateSuffix: string): Promise<Record<string, number>> {
        const categories = {
            "Gyms": "leisure=fitness_centre",
            "Cafes": "amenity=cafe",
            "Restaurants": "amenity=restaurant",
            "Retail": "shop=boutique"
        };
        
        const results: Record<string, number> = {};
        
        try {
            for (const [label, tag] of Object.entries(categories)) {
                // Try a very broad area search based on name alone if specific fails
                const query = `[out:json][timeout:15];
                    (
                      area["name"="${city}"]["ISO3166-2"="US-${stateSuffix}"];
                      area["name"="${city} city"]["ISO3166-2"="US-${stateSuffix}"];
                      area["name"="${city} village"]["ISO3166-2"="US-${stateSuffix}"];
                    )->.a;
                    (node[${tag}](area.a);way[${tag}](area.a););
                    out count;`;
                const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
                
                const res = await fetch(url).catch(() => null);
                if (!res || !res.ok) {
                    results[label] = 0;
                    continue;
                }
                
                const data = await res.json().catch(() => null);
                if (data && data.elements && data.elements[0]) {
                    results[label] = parseInt(data.elements[0].tags.total) || 0;
                } else {
                    results[label] = 0;
                }
            }
            return results;
        } catch (error) {
            console.error("[MarketService] Business density error:", error);
            return results;
        }
    }
    
    static async getMarketPulse(city: string, state: string, stateCode: string): Promise<MarketPulseData> {
        console.log(`[MarketService] Fetching pulse for ${city}, ${state} (${stateCode})`);
        const [searchIntent, monthlyMomentum, businessDensity] = await Promise.all([
            this.getSearchIntent(city, state),
            this.getCityMomentum(city, state),
            this.getBusinessDensity(city, stateCode)
        ]);
        
        console.log(`[MarketService] Results: 
          - Intent: ${searchIntent.length} 
          - Momentum: ${monthlyMomentum} 
          - Density: ${Object.keys(businessDensity).length} categories`);

        return { searchIntent, monthlyMomentum, businessDensity };
    }
}
