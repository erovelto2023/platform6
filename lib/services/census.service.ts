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

export interface AudienceStats {
    medianAge: number;
    under18Pct: number;
    over65Pct: number;
    householdsWithChildrenPct: number;
    avgHouseholdSize: number;
}

export interface AffordabilityStats {
    povertyRate: number;
    perCapitaIncome: number;
    homeownershipRate: number;
    medianRent: number;
    medianMortgage: number;
    costBurdenedPct: number; // Households spending >30% on housing
    incomeBrackets: {
        under25k: number;
        k25_50: number;
        k50_75: number;
        over75k: number;
    };
}

export interface CityStats {
    population: number;
    medianIncome: number;
    gender: { male: number; female: number };
    ethnicity: { white: number; black: number; asian: number; hispanic: number };
    audience: AudienceStats;
    affordability: AffordabilityStats;
    digital: {
        broadbandPct: number;
        smartphoneOnlyPct: number;
        workFromHomePct: number;
        meanCommuteMinutes: number;
    };
    logistics: {
        bachelorsDegreePct: number;
        speakSpanishPct: number;
    };
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

            // Massive Variable List (Phase 1 & 2)
            const vars = [
                "NAME", "B01003_001E", "B19013_001E", // 0, 1, 2 (Pop, MedInc)
                "B01001_002E", "B01001_026E",         // 3, 4 (M/F total)
                "B03002_003E", "B03002_004E", "B03002_006E", "B03002_012E", // 5-8 (eth)
                "B01002_001E",                        // 9 (MedAge)
                "B11005_001E", "B11005_002E",         // 10, 11 (HH, HH w/ children)
                "B25010_001E",                        // 12 (Avg HH Size)
                "B17001_001E", "B17001_002E",         // 13, 14 (Poverty total, below)
                "B19301_001E",                        // 15 (Per Capita)
                "B25003_001E", "B25003_002E",         // 16, 17 (Housing total, owner)
                "B25058_001E", "B25088_002E",         // 18, 19 (Rent, Mortgage)
                // Cost Burden Renter (30-34.9, 35-39.9, 40-49.9, 50+) - B25070_007 to 010
                "B25070_007E", "B25070_008E", "B25070_009E", "B25070_010E", // 20-23
                // Cost Burden Owner - B25091_008 to 011
                "B25091_008E", "B25091_009E", "B25091_010E", "B25091_011E", // 24-27
                // Income Brackets B19001 (02-17)
                "B19001_002E", "B19001_003E", "B19001_004E", "B19001_005E",
                "B19001_006E", "B19001_007E", "B19001_008E", "B19001_009E", "B19001_010E",
                "B19001_011E", "B19001_012E",
                "B19001_013E", "B19001_014E", "B19001_015E", "B19001_016E", "B19001_017E", // 28-43
                // Age segments for under 18 & 65+
                "B01001_003E", "B01001_004E", "B01001_005E", "B01001_006E", // 44-47 (M 0-17)
                "B01001_027E", "B01001_028E", "B01001_029E", "B01001_030E", // 48-51 (F 0-17)
                "B01001_020E", "B01001_021E", "B01001_022E", "B01001_023E", "B01001_024E", "B01001_025E", // 52-57 (M 65+)
                "B01001_044E", "B01001_045E", "B01001_046E", "B01001_047E", "B01001_048E", "B01001_049E", // 58-63 (F 65+)
                // Phase 3 & 4: Digital & Logistics
                "B28002_001E", "B28002_002E",         // 64, 65 (Internet Total, Has Internet)
                "B28001_011E",                        // 66 (Smartphone Only)
                "B08006_001E", "B08006_017E",         // 67, 68 (Workers total, Worked at home)
                "B08303_001E",                        // 69 (Aggregate Commute)
                "B15003_001E", "B15003_022E", "B15003_023E", "B15003_024E", "B15003_025E", // 70-74 (Edu)
                "B16001_001E", "B16001_003E",         // 75, 76 (Language Total, Spanish)
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

            const totalPop = parseInt(matchingRow[1]) || 0;
            const toddlers = (parseInt(matchingRow[44]) || 0) + (parseInt(matchingRow[48]) || 0); // Strictly <5
            const under18 = matchingRow.slice(44, 48).concat(matchingRow.slice(48, 52)).reduce((a: number, b: string) => a + (parseInt(b) || 0), 0);
            const over65 = matchingRow.slice(52, 58).concat(matchingRow.slice(58, 64)).reduce((a: number, b: string) => a + (parseInt(b) || 0), 0);

            // Income Brackets Summation
            const inc20 = matchingRow.slice(28, 32).reduce((a: number, b: string) => a + (parseInt(b) || 0), 0); // <25k
            const inc25 = matchingRow.slice(32, 37).reduce((a: number, b: string) => a + (parseInt(b) || 0), 0); // 25-50k
            const inc50 = matchingRow.slice(37, 39).reduce((a: number, b: string) => a + (parseInt(b) || 0), 0); // 50-75k
            const inc75 = matchingRow.slice(39, 44).reduce((a: number, b: string) => a + (parseInt(b) || 0), 0); // 75k+

            // Cost Burden Summation
            const burdenedCount = matchingRow.slice(20, 24).concat(matchingRow.slice(24, 28)).reduce((a: number, b: string) => a + (parseInt(b) || 0), 0);
            const totalHH = parseInt(matchingRow[10]) || 1;

            const baseStats: CityStats = {
                population: totalPop,
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
                audience: {
                    medianAge: parseFloat(matchingRow[9]) || 0,
                    under18Pct: Math.round((under18 / totalPop) * 100) || 0,
                    over65Pct: Math.round((over65 / totalPop) * 100) || 0,
                    householdsWithChildrenPct: Math.round((parseInt(matchingRow[11]) / totalHH) * 100) || 0,
                    avgHouseholdSize: parseFloat(matchingRow[12]) || 0,
                },
                affordability: {
                    povertyRate: Math.round((parseInt(matchingRow[14]) / parseInt(matchingRow[13])) * 100) || 0,
                    perCapitaIncome: parseInt(matchingRow[15]) || 0,
                    homeownershipRate: Math.round((parseInt(matchingRow[17]) / parseInt(matchingRow[16])) * 100) || 0,
                    medianRent: parseInt(matchingRow[18]) || 0,
                    medianMortgage: parseInt(matchingRow[19]) || 0,
                    costBurdenedPct: Math.round((burdenedCount / totalHH) * 100) || 0,
                    incomeBrackets: {
                        under25k: Math.round((inc20 / totalHH) * 100),
                        k25_50: Math.round((inc25 / totalHH) * 100),
                        k50_75: Math.round((inc50 / totalHH) * 100),
                        over75k: Math.round((inc75 / totalHH) * 100),
                    }
                },
                segments: {
                    toddlers: toddlers,
                    seniors: over65,
                    highEarners: parseInt(matchingRow[43]) || 0
                },
                digital: {
                    broadbandPct: Math.round((parseInt(matchingRow[65]) / (parseInt(matchingRow[64]) || 1)) * 100),
                    smartphoneOnlyPct: Math.round((parseInt(matchingRow[66]) / (parseInt(matchingRow[64]) || 1)) * 100),
                    workFromHomePct: Math.round((parseInt(matchingRow[68]) / (parseInt(matchingRow[67]) || 1)) * 100),
                    meanCommuteMinutes: Math.round(parseInt(matchingRow[69]) / ((parseInt(matchingRow[67]) - parseInt(matchingRow[68])) || 1))
                },
                logistics: {
                    bachelorsDegreePct: Math.round(((parseInt(matchingRow[71]) + parseInt(matchingRow[72]) + parseInt(matchingRow[73]) + parseInt(matchingRow[74])) / (parseInt(matchingRow[70]) || 1)) * 100),
                    speakSpanishPct: Math.round((parseInt(matchingRow[76]) / (parseInt(matchingRow[75]) || 1)) * 100)
                },
                year: year
            };

            // Calculate Niche Insights
            baseStats.nicheInsights = this.calculateNicheInsights(baseStats);

            // Step 2: Fetch ABS Business Owner Stats
            const placeFips = matchingRow[matchingRow.length - 1]; 
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
