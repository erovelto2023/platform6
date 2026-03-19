import { MARKET_CATEGORIES } from "../constants/market-categories";

export interface MarketPulseData {
    searchIntent: string[];
    monthlyMomentum: number;
    competitors?: {
        parenting: string[];
        seniors: string[];
        home: string[];
    };
    dominance?: Record<string, { count: number; sector: string }>;
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
            "Gyms": "fitness_centre",
            "Cafes": "cafe",
            "Restaurants": "restaurant",
            "Retail": "boutique"
        };
        
        const results: Record<string, number> = {};
        
        try {
            const coords = await this.resolveCityCoords(city, stateSuffix);
            const latLonFilter = coords ? `(around:16000,${coords.lat},${coords.lon})` : `area["name"="${city}"]["ISO3166-2"="US-${stateSuffix}"];->.a; (around.a:10000)`;

            for (const [label, tag] of Object.entries(categories)) {
                const tagFilter = label === "Retail" ? `shop=${tag}` : `amenity=${tag}`;
                const query = `[out:json][timeout:15];
                    (nwr[${tagFilter}]${latLonFilter};);
                    out count;`;
                const url = `https://lz4.overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
                
                const res = await fetch(url).catch(() => null);
                if (res && res.ok) {
                    const data = await res.json().catch(() => null);
                    if (data?.elements?.[0]?.tags?.total) {
                        results[label] = parseInt(data.elements[0].tags.total);
                        continue;
                    }
                }
                results[label] = 0;
            }
            return results;
        } catch (error) {
            console.error("[MarketService] Business density error:", error);
            return results;
        }
    }
    
    static async getCompetitorLandscape(city: string, stateSuffix: string): Promise<MarketPulseData['competitors']> {
        const queries = {
            parenting: '["amenity"~"kindergarten|school"]',
            seniors: '["amenity"="social_facility"]["social_facility:for"="senior"]',
            home: '["shop"~"hardware|doityourself"]'
        };
        
        const results = { parenting: [] as string[], seniors: [] as string[], home: [] as string[] };
        
        try {
            const coords = await this.resolveCityCoords(city, stateSuffix);
            if (!coords) return results;

            const latLonFilter = `(around:16000,${coords.lat},${coords.lon})`;
            const OVERPASS_MIRROR = "https://lz4.overpass-api.de/api/interpreter";

            for (const [key, tag] of Object.entries(queries)) {
                const query = `[out:json][timeout:15];
                    nwr${tag}${latLonFilter};
                    out body 10;`;
                const url = `${OVERPASS_MIRROR}?data=${encodeURIComponent(query)}`;
                const res = await fetch(url).catch(() => null);
                if (res && res.ok) {
                    const data = await res.json().catch(() => null);
                    if (data?.elements) {
                        results[key as keyof typeof results] = data.elements
                            .map((e: any) => e.tags.name)
                            .filter((name: string) => !!name);
                    }
                }
            }
            return results;
        } catch (error) {
            console.error("[MarketService] Competitor fetch error:", error);
            return results;
        }
    }

    private static async resolveCityCoords(city: string, stateSuffix: string): Promise<{lat: number, lon: number} | null> {
        try {
            const query = `[out:json][timeout:15];
                area["ISO3166-2"="US-${stateSuffix}"]->.s;
                (
                  node["name"="${city}"][place](area.s);
                  relation["name"="${city}"][boundary=administrative](area.s);
                  node["name"="${city} city"][place](area.s);
                  relation["name"="${city} city"][boundary=administrative](area.s);
                );
                out center 1;`;
            
            const res = await fetch(`https://lz4.overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
            if (!res.ok) return null;
            const data = await res.json();
            const el = data.elements?.[0];
            if (el) {
                return {
                    lat: el.lat || el.center?.lat,
                    lon: el.lon || el.center?.lon
                };
            }
            return null;
        } catch { return null; }
    }
    
    static async getMarketDominance(city: string, stateSuffix: string): Promise<MarketPulseData['dominance']> {
        try {
            const coords = await this.resolveCityCoords(city, stateSuffix);
            const OVERPASS_MIRROR = "https://lz4.overpass-api.de/api/interpreter";
            
            if (!coords) {
                // Last ditch: try area-based count if coordinates fail
                return this.getBusinessDensity(city, stateSuffix)
                    .then(res => {
                        const dominance: any = {};
                        Object.entries(res).forEach(([label, count]) => {
                            dominance[label] = { count, sector: "General Retail" };
                        });
                        return dominance;
                    });
            }

            const latLonFilter = `(around:16000,${coords.lat},${coords.lon})`;

            // Step 2: Bulk fetch all 50 categories using proximity
            // Combine tags for efficiency
            const amenityTags = MARKET_CATEGORIES.filter(c => c.tag.startsWith('amenity=')).map(c => c.tag.split('=')[1]).join('|');
            const shopTags = MARKET_CATEGORIES.filter(c => c.tag.startsWith('shop=')).map(c => c.tag.split('=')[1]).join('|');
            const officeTags = MARKET_CATEGORIES.filter(c => c.tag.startsWith('office=')).map(c => c.tag.split('=')[1]).join('|');
            const craftTags = MARKET_CATEGORIES.filter(c => c.tag.startsWith('craft=')).map(c => c.tag.split('=')[1]).join('|');
            const tourismTags = MARKET_CATEGORIES.filter(c => c.tag.startsWith('tourism=')).map(c => c.tag.split('=')[1]).join('|');

            const bulkQuery = `[out:json][timeout:30];
                (
                  node["amenity"~"${amenityTags}"]${latLonFilter};
                  node["shop"~"${shopTags}"]${latLonFilter};
                  node["office"~"${officeTags}"]${latLonFilter};
                  node["craft"~"${craftTags}"]${latLonFilter};
                  node["tourism"~"${tourismTags}"]${latLonFilter};
                  way["amenity"~"${amenityTags}"]${latLonFilter};
                  way["shop"~"${shopTags}"]${latLonFilter};
                );
                out tags;`;
            
            const bulkUrl = `${OVERPASS_MIRROR}?data=${encodeURIComponent(bulkQuery)}`;
            const bulkRes = await fetch(bulkUrl).catch(() => null);
            
            const counts: Record<string, { count: number; sector: string }> = {};
            // Initialize counts
            MARKET_CATEGORIES.forEach(c => {
                counts[c.label] = { count: 0, sector: c.sector };
            });

            if (bulkRes && bulkRes.ok) {
                const text = await bulkRes.text();
                if (!text.includes("<?xml") && !text.includes("<html")) {
                    const data = JSON.parse(text);
                    if (data.elements) {
                        data.elements.forEach((e: any) => {
                            const tags = e.tags || {};
                            // Match tags to categories
                            MARKET_CATEGORIES.forEach(cat => {
                                const [key, val] = cat.tag.split('=');
                                if (tags[key] === val || (cat.label === "Pizza" && tags.amenity === "pizzeria")) {
                                    counts[cat.label].count++;
                                }
                            });
                        });
                    }
                }
            }
            return counts;
        } catch (error) {
            console.error("[MarketService] Market dominance error:", error);
            return {};
        }
    }
    
    static async getMarketPulse(city: string, state: string, stateCode: string): Promise<MarketPulseData> {
        console.log(`[MarketService] Fetching pulse for ${city}, ${state} (${stateCode})`);
        const [searchIntent, monthlyMomentum, competitors, dominance] = await Promise.all([
            this.getSearchIntent(city, state),
            this.getCityMomentum(city, state),
            this.getCompetitorLandscape(city, stateCode),
            this.getMarketDominance(city, stateCode)
        ]);
        
        console.log(`[MarketService] Results: 
          - Intent: ${searchIntent.length} 
          - Momentum: ${monthlyMomentum}
          - Competitors: Ready
          - Dominance: Found ${Object.keys(dominance || {}).length} categories`);

        return { searchIntent, monthlyMomentum, competitors, dominance };
    }
}
