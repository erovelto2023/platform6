/**
 * US Census Bureau API Service
 * 
 * This service provides demographic and economic data for US States and Cities.
 * Datasets used:
 * - ACS 5-Year Estimates (Social and Economic characteristics)
 * - County Business Patterns (Business establishments)
 */

const CENSUS_API_BASE = "https://api.census.gov/data";
const API_KEY = process.env.CENSUS_API_KEY;

// State Name to FIPS Code mapping
export const STATE_FIPS: Record<string, string> = {
    "alabama": "01", "alaska": "02", "arizona": "04", "arkansas": "05", "california": "06",
    "colorado": "08", "connecticut": "09", "delaware": "10", "district of columbia": "11",
    "florida": "12", "georgia": "13", "hawaii": "15", "idaho": "16", "illinois": "17",
    "indiana": "18", "iowa": "19", "kansas": "20", "kentucky": "21", "louisiana": "22",
    "maine": "23", "maryland": "24", "massachusetts": "25", "michigan": "26", "minnesota": "27",
    "mississippi": "28", "missouri": "29", "montana": "30", "nebraska": "31", "nevada": "32",
    "new hampshire": "33", "new jersey": "34", "new mexico": "35", "new york": "36",
    "north carolina": "37", "north dakota": "38", "ohio": "39", "oklahoma": "40", "oregon": "41",
    "pennsylvania": "42", "rhode island": "44", "south carolina": "45", "south dakota": "46",
    "tennessee": "47", "texas": "48", "utah": "49", "vermont": "50", "virginia": "51",
    "washington": "53", "west virginia": "54", "wisconsin": "55", "wyoming": "56"
};

export interface OwnerStats {
    totalFirms: number;
    womenOwned: { count: number; pct: number };
    veteranOwned: { count: number; pct: number };
    minorityOwned: { count: number; pct: number };
    isStateLevel: boolean; // Flag to indicate if we're showing state averages
}

export interface NicheInsight {
    pottyTraining: { score: number; label: string };
    seniorCare: { score: number; label: string };
    luxuryLuxury: { score: number; label: string };
    pricingStrategy: { type: "high-ticket" | "standard" | "mass-market"; description: string };
}

export interface CityStats {
    population: number;
    medianIncome: number;
    gender: { male: number; female: number };
    ethnicity: { white: number; black: number; asian: number; hispanic: number };
    segments: {
        toddlers: number;
        seniors: number;
        highEarners: number;
    };
    ownerStats?: OwnerStats;
    nicheInsights?: NicheInsight;
    year: string;
}

export class CensusService {
    /**
     * Fetch demographic data for a specific city (place) within a state.
     */
    static async getCityDemographics(cityName: string, stateName: string): Promise<CityStats | null> {
        try {
            const stateFips = STATE_FIPS[stateName.toLowerCase()];
            if (!stateFips) return null;

            // Step 1: Resolve the Place FIPS code for the city name
            const vars = [
                "NAME", "B01003_001E", "B19013_001E", // 0, 1, 2
                "B01001_002E", "B01001_026E",         // 3, 4 (M/F total)
                "B03002_003E", "B03002_004E", "B03002_006E", "B03002_012E", // 5, 6, 7, 8 (eth)
                "B01001_003E", "B01001_027E",         // 9, 10 (<5)
                "B01001_020E", "B01001_021E", "B01001_022E", "B01001_023E", "B01001_024E", "B01001_025E", // 11-16 (M 65+)
                "B01001_044E", "B01001_045E", "B01001_046E", "B01001_047E", "B01001_048E", "B01001_049E", // 17-22 (F 65+)
                "B19001_017E"                         // 23 (200k+)
            ].join(",");

            const year = "2022";
            const url = `${CENSUS_API_BASE}/${year}/acs/acs5?get=${vars}&for=place:*&in=state:${stateFips}${API_KEY ? `&key=${API_KEY}` : ''}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Census API error: ${response.statusText}`);

            const data = await response.json();
            const matchingRow = data.find((row: string[]) => 
                row[0].toLowerCase().startsWith(cityName.toLowerCase())
            );

            if (!matchingRow) return null;

            const male65Plus = matchingRow.slice(11, 17).reduce((a: any, b: any) => a + (parseInt(b) || 0), 0);
            const female65Plus = matchingRow.slice(17, 23).reduce((a: any, b: any) => a + (parseInt(b) || 0), 0);

            const baseStats: CityStats = {
                population: parseInt(matchingRow[1]) || 0,
                medianIncome: parseInt(matchingRow[2]) || 0,
                gender: {
                    male: parseInt(matchingRow[3]) || 0,
                    female: parseInt(matchingRow[4]) || 0,
                },
                ethnicity: {
                    white: parseInt(matchingRow[5]) || 0,
                    black: parseInt(matchingRow[6]) || 0,
                    asian: parseInt(matchingRow[7]) || 0,
                    hispanic: parseInt(matchingRow[8]) || 0,
                },
                segments: {
                    toddlers: (parseInt(matchingRow[9]) || 0) + (parseInt(matchingRow[10]) || 0),
                    seniors: male65Plus + female65Plus,
                    highEarners: parseInt(matchingRow[23]) || 0
                },
                year: year
            };

            // Calculate Niche Insights
            baseStats.nicheInsights = this.calculateNicheInsights(baseStats);

            // Step 2: Fetch ABS Business Owner Stats
            const placeFips = matchingRow[matchingRow.length - 1]; // "place" is last column
            baseStats.ownerStats = await this.getBusinessOwnerStats(stateFips, placeFips);

            return baseStats;
        } catch (error) {
            console.error("Error fetching demographics:", error);
            return null;
        }
    }

    private static calculateNicheInsights(stats: CityStats): NicheInsight {
        const totalPop = stats.population || 1;
        const toddlerPct = (stats.segments.toddlers / totalPop) * 100;
        const seniorPct = (stats.segments.seniors / totalPop) * 100;
        const highEarnerPct = (stats.segments.highEarners / (totalPop / 2.5)) * 100; // Households est.

        const getScore = (pct: number, threshold: number) => {
            const score = Math.round((pct / threshold) * 8); 
            if (score > 10) return 10;
            return Math.max(1, score);
        };

        const pottyScore = getScore(toddlerPct, 6); // 6% is avg
        const seniorScore = getScore(seniorPct, 15); // 15% is avg
        const luxuryScore = getScore(highEarnerPct, 8); // 8% is high earner avg

        let pricing: NicheInsight["pricingStrategy"] = {
            type: "standard",
            description: "Market supports mid-range products ($100 - $1,000)."
        };

        if (stats.medianIncome > 110000 || highEarnerPct > 15) {
            pricing = {
                type: "high-ticket",
                description: "Premium capability ($2k - $10k+ courses/consulting)."
            };
        } else if (stats.medianIncome < 45000) {
            pricing = {
                type: "mass-market",
                description: "Focus on volume & accessibility ($20 - $100 products)."
            };
        }

        return {
            pottyTraining: { score: pottyScore, label: pottyScore > 7 ? "Hot Niche" : "Stable" },
            seniorCare: { score: seniorScore, label: seniorScore > 7 ? "Booming" : "Average" },
            luxuryLuxury: { score: luxuryScore, label: luxuryScore > 7 ? "Premium" : "Low" },
            pricingStrategy: pricing
        };
    }

    /**
     * Fetch detailed business owner demographics from ABS.
     * Includes fallback logic to State-level if Economic Place data is unavailable.
     */
    private static async getBusinessOwnerStats(stateFips: string, placeFips: string): Promise<OwnerStats | undefined> {
        try {
            const year = "2022";
            const baseUrl = `${CENSUS_API_BASE}/${year}/abscs?get=NAME,FIRMPDEMP&FIRMPDEMP_F=null&key=${API_KEY}`;
            
            // We need to fetch multiple groups: Total, Women, Veteran, Minority
            const fetchGroup = async (geoParam: string, sex = "001", vet = "001", race = "001") => {
                const url = `${baseUrl}&for=${geoParam}&SEX=${sex}&VET_GROUP=${vet}&RACE_GROUP=${race}`;
                const res = await fetch(url);
                if (!res.ok) return 0;
                const data = await res.json();
                return parseInt(data[1][1]) || 0;
            };

            // Strategy: 
            // 1. Try Economic Place (city level)
            // 2. If no data, Fallback to State level
            let geo = `economic%20place:${placeFips}&in=state:${stateFips}`;
            let total = await fetchGroup(geo);
            let isStateLevel = false;

            if (total === 0) {
                geo = `state:${stateFips}`;
                total = await fetchGroup(geo);
                isStateLevel = true;
            }

            if (total === 0) return undefined;

            const women = await fetchGroup(geo, "002");
            const veteran = await fetchGroup(geo, "001", "002");
            const minority = await fetchGroup(geo, "001", "001", "030");

            return {
                totalFirms: total,
                womenOwned: { count: women, pct: Math.round((women / total) * 100) },
                veteranOwned: { count: veteran, pct: Math.round((veteran / total) * 100) },
                minorityOwned: { count: minority, pct: Math.round((minority / total) * 100) },
                isStateLevel
            };

        } catch (error) {
            console.error("ABS fetch error:", error);
            return undefined;
        }
    }

    /**
     * Fetch business statistics for a city.
     * Note: CBP is primarily county-level. For city level, we use ZIP Code Business Patterns (ZBP).
     * This requires a ZIP code for the city, which we might not have in the simple states.txt.
     * For now, we'll return null or use a simplified county-level estimate if desired.
     */
    static async getCityBusinessStats(cityName: string, stateName: string): Promise<number | null> {
        // Implementation for ZBP would go here if we had ZIP codes.
        // For now, we stick to demographics as the core foundation.
        return null;
    }
}
