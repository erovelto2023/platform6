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

export interface NicheCandidate {
    id: string;
    label: string;
    score: number;
    sublabel: string;
    description: string;
}

export interface NicheInsight {
    candidates: NicheCandidate[];
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

            // Census API has a limit of 50 variables per request. We'll split into two batches.
            const batch1 = [
                "NAME", "B01001_001E", "B19013_001E", "B01001_002E", "B01001_026E", // 0-4 (NAME, Total Pop, MedInc, Male Pop, Female Pop)
                "B02001_002E", "B02001_003E", "B02001_005E", "B03001_003E", // 5-8 (White, Black, Asian, Hispanic)
                "B01002_001E", "B11001_001E", "B11005_001E", "B25010_001E", // 9-12 (MedAge, Total HH, HH w/ children, Avg HH Size)
                "B17001_001E", "B17001_002E", "B19301_001E", // 13-15 (Poverty Total, Poverty Below, Per Capita Income)
                "B25003_001E", "B25003_002E", "B25058_001E", "B25088_002E", // 16-19 (Housing Total, Owner Occupied, Median Rent, Median Mortgage)
                // Cost Burden Renter (30-34.9, 35-39.9, 40-49.9, 50+) - B25070_007 to 010
                "B25070_007E", "B25070_008E", "B25070_009E", "B25070_010E", // 20-23
                // Cost Burden Owner - B25091_008 to 011
                "B25091_008E", "B25091_009E", "B25091_010E", "B25091_011E", // 24-27
                // Income Brackets B19001 (02-17)
                "B19001_002E", "B19001_003E", "B19001_004E", "B19001_005E", // 28-31 (<10k, 10-14k, 15-19k, 20-24k)
                "B19001_006E", "B19001_007E", "B19001_008E", "B19001_009E", // 32-35 (25-29k, 30-34k, 35-39k, 40-44k)
                "B19001_010E", "B19001_011E", "B19001_012E", // 36-38 (45-49k, 50-59k, 60-74k)
                "B19001_013E", "B19001_014E", "B19001_015E", "B19001_016E", "B19001_017E", // 39-43 (75-99k, 100-124k, 125-149k, 150-199k, 200k+)
            ].join(",");

            const batch2 = [
                "NAME", // 0 (NAME - for matching)
                "B01001_003E", "B01001_004E", "B01001_005E", "B01001_006E", // 1-4 (M 0-4, M 5-9, M 10-14, M 15-17)
                "B01001_027E", "B01001_028E", "B01001_029E", "B01001_030E", // 5-8 (F 0-4, F 5-9, F 10-14, F 15-17)
                "B01001_020E", "B01001_021E", "B01001_022E", "B01001_023E", "B01001_024E", "B01001_025E", // 9-14 (M 65-69, M 70-74, M 75-79, M 80-84, M 85+)
                "B01001_044E", "B01001_045E", "B01001_046E", "B01001_047E", "B01001_048E", "B01001_049E", // 15-20 (F 65-69, F 70-74, F 75-79, F 80-84, F 85+)
                // Phase 3 & 4: Digital & Logistics
                "B28002_001E", "B28002_002E", // 21, 22 (Internet Total, Has Internet)
                "B28001_011E", // 23 (Smartphone Only)
                "B08006_001E", "B08006_017E", // 24, 25 (Workers total, Worked at home)
                "B08303_001E", // 26 (Aggregate Commute)
                "B15003_001E", "B15003_022E", "B15003_023E", "B15003_024E", "B15003_025E", // 27-31 (Edu Total, Bachelors, Masters, Prof, Doctorate)
                "B16001_001E", "B16001_003E", // 32, 33 (Language Total, Spanish)
            ].join(",");

            const year = "2022";
            const baseUrl = `${CENSUS_API_BASE}/${year}/acs/acs5?for=place:*&in=state:${stateFips}${API_KEY ? `&key=${API_KEY}` : ''}`;

            const [res1, res2] = await Promise.all([
                fetch(`${baseUrl}&get=${batch1}`),
                fetch(`${baseUrl}&get=${batch2}`)
            ]);

            if (!res1.ok || !res2.ok) {
                console.error("Census API fetch failed", { status1: res1.status, status2: res2.status });
                return null;
            }

            const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

            const findMatchingRow = (rows: string[][], name: string, state: string) => {
                const searchLower = name.toLowerCase();
                const stateLower = state.toLowerCase();
                
                // Try exact match first (e.g., "Boise city, Idaho")
                let match = rows.find(row => {
                    const rowLower = row[0].toLowerCase();
                    return rowLower === `${searchLower} city, ${stateLower}` || 
                           rowLower === `${searchLower} town, ${stateLower}` ||
                           rowLower === `${searchLower} cdp, ${stateLower}` ||
                           rowLower === `${searchLower}, ${stateLower}`;
                });

                // If no exact match, try broad containment
                if (!match) {
                    match = rows.find(row => {
                        const rowLower = row[0].toLowerCase();
                        return rowLower.includes(searchLower) && rowLower.includes(stateLower);
                    });
                }

                return match;
            };

            const matchingRow1 = findMatchingRow(data1, cityName, stateName);
            const matchingRow2 = findMatchingRow(data2, cityName, stateName);

            if (!matchingRow1 || !matchingRow2) return null;

            const sanitizeValue = (val: string | number) => {
                const num = typeof val === 'string' ? parseFloat(val) : val;
                if (isNaN(num) || num <= -666666666) return 0;
                return num;
            };

            const totalPop = sanitizeValue(matchingRow1[1]) || 1;
            const malePop = sanitizeValue(matchingRow1[3]);
            const femalePop = sanitizeValue(matchingRow1[4]);

            const under18 = (
                (parseInt(matchingRow2[1]) || 0) + (parseInt(matchingRow2[2]) || 0) + (parseInt(matchingRow2[3]) || 0) + (parseInt(matchingRow2[4]) || 0) +
                (parseInt(matchingRow2[5]) || 0) + (parseInt(matchingRow2[6]) || 0) + (parseInt(matchingRow2[7]) || 0) + (parseInt(matchingRow2[8]) || 0)
            );

            const over65 = (
                (parseInt(matchingRow2[9]) || 0) + (parseInt(matchingRow2[10]) || 0) + (parseInt(matchingRow2[11]) || 0) + (parseInt(matchingRow2[12]) || 0) + (parseInt(matchingRow2[13]) || 0) + (parseInt(matchingRow2[14]) || 0) +
                (parseInt(matchingRow2[15]) || 0) + (parseInt(matchingRow2[16]) || 0) + (parseInt(matchingRow2[17]) || 0) + (parseInt(matchingRow2[18]) || 0) + (parseInt(matchingRow2[19]) || 0) + (parseInt(matchingRow2[20]) || 0)
            );

            const toddlers = (sanitizeValue(matchingRow2[1]) + sanitizeValue(matchingRow2[5]));
            
            const totalHH = parseInt(matchingRow1[10]) || 1;
            const burdenedCount = 
                (parseInt(matchingRow1[20]) || 0) + (parseInt(matchingRow1[21]) || 0) + (parseInt(matchingRow1[22]) || 0) + (parseInt(matchingRow1[23]) || 0) +
                (parseInt(matchingRow1[24]) || 0) + (parseInt(matchingRow1[25]) || 0) + (parseInt(matchingRow1[26]) || 0) + (parseInt(matchingRow1[27]) || 0);

            const inc20 = (parseInt(matchingRow1[28]) || 0) + (parseInt(matchingRow1[29]) || 0) + (parseInt(matchingRow1[30]) || 0) + (parseInt(matchingRow1[31]) || 0); // <25k
            const inc25 = (parseInt(matchingRow1[32]) || 0) + (parseInt(matchingRow1[33]) || 0) + (parseInt(matchingRow1[34]) || 0) + (parseInt(matchingRow1[35]) || 0) + (parseInt(matchingRow1[36]) || 0); // 25-59k
            const inc50 = (parseInt(matchingRow1[37]) || 0) + (parseInt(matchingRow1[38]) || 0); // 60-74k
            const inc75 = (parseInt(matchingRow1[39]) || 0) + (parseInt(matchingRow1[40]) || 0) + (parseInt(matchingRow1[41]) || 0) + (parseInt(matchingRow1[42]) || 0) + (parseInt(matchingRow1[43]) || 0); // 75k+

            const baseStats: CityStats = {
                population: totalPop,
                medianIncome: sanitizeValue(matchingRow1[2]),
                gender: {
                    male: malePop,
                    female: femalePop
                },
                ethnicity: {
                    white: parseInt(matchingRow1[5]) || 0,
                    black: parseInt(matchingRow1[6]) || 0,
                    asian: parseInt(matchingRow1[7]) || 0,
                    hispanic: parseInt(matchingRow1[8]) || 0
                },
                audience: {
                    medianAge: sanitizeValue(matchingRow1[9]),
                    under18Pct: Math.round((under18 / totalPop) * 100),
                    over65Pct: Math.round((over65 / totalPop) * 100),
                    householdsWithChildrenPct: Math.round(((parseInt(matchingRow1[11]) || 0) / totalHH) * 100),
                    avgHouseholdSize: parseFloat(matchingRow1[12]) || 0,
                },
                affordability: {
                    povertyRate: Math.round(((parseInt(matchingRow1[14]) || 0) / (parseInt(matchingRow1[13]) || 1)) * 100),
                    perCapitaIncome: sanitizeValue(matchingRow1[15]),
                    homeownershipRate: Math.round(((parseInt(matchingRow1[17]) || 0) / (parseInt(matchingRow1[16]) || 1)) * 100),
                    medianRent: sanitizeValue(matchingRow1[18]),
                    medianMortgage: sanitizeValue(matchingRow1[19]),
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
                    highEarners: (parseInt(matchingRow1[43]) || 0) // B19001_017E is 200k+
                },
                digital: {
                    broadbandPct: Math.round(((parseInt(matchingRow2[22]) || 0) / (parseInt(matchingRow2[21]) || 1)) * 100),
                    smartphoneOnlyPct: Math.round(((parseInt(matchingRow2[23]) || 0) / (parseInt(matchingRow2[21]) || 1)) * 100),
                    workFromHomePct: Math.round(((parseInt(matchingRow2[25]) || 0) / (parseInt(matchingRow2[24]) || 1)) * 100),
                    meanCommuteMinutes: Math.round((parseInt(matchingRow2[26]) || 0) / ((parseInt(matchingRow2[24]) || 0) - (parseInt(matchingRow2[25]) || 0) || 1))
                },
                logistics: {
                    bachelorsDegreePct: Math.round((((parseInt(matchingRow2[28]) || 0) + (parseInt(matchingRow2[29]) || 0) + (parseInt(matchingRow2[30]) || 0) + (parseInt(matchingRow2[31]) || 0)) / (parseInt(matchingRow2[27]) || 1)) * 100),
                    speakSpanishPct: Math.round(((parseInt(matchingRow2[33]) || 0) / (parseInt(matchingRow2[32]) || 1)) * 100)
                },
                year: year
            };

            // Calculate Niche Insights
            baseStats.nicheInsights = this.calculateNicheInsights(baseStats);

            // Step 2: Fetch ABS Business Owner Stats
            const placeFips = matchingRow1[matchingRow1.length - 1]; 
            baseStats.ownerStats = await this.getBusinessOwnerStats(stateFips, placeFips);

            return baseStats;
        } catch (error) {
            console.error("Error fetching demographics:", error);
            return null;
        }
    }

    private static calculateNicheInsights(stats: CityStats): NicheInsight {
        const totalPop = stats.population || 1;
        const candidates: NicheCandidate[] = [];

        const getScore = (val: number, threshold: number, max = 10) => {
            const s = Math.round((val / threshold) * 8);
            return Math.min(max, Math.max(1, s));
        };

        // 1. Parenting & Kids
        const toddlerPct = (stats.segments.toddlers / totalPop) * 100;
        const pScore = getScore(toddlerPct, 6);
        candidates.push({
            id: "parenting",
            label: "Parenting & Kids",
            score: pScore,
            sublabel: pScore > 7 ? "High Demand" : "Steady Market",
            description: "Potty training, early learning, and toddler safety products."
        });

        // 2. Senior Services
        const seniorPct = (stats.segments.seniors / totalPop) * 100;
        const sScore = getScore(seniorPct, 15);
        candidates.push({
            id: "seniors",
            label: "Senior Services",
            score: sScore,
            sublabel: sScore > 7 ? "Booming Demographic" : "Average Demand",
            description: "Assisted living, mobility aids, and senior health coaching."
        });

        // 3. Remote Work & Tech
        const wfhPct = stats.digital.workFromHomePct;
        const rScore = getScore(wfhPct, 15);
        if (wfhPct > 10) {
            candidates.push({
                id: "remote-work",
                label: "Remote Professional",
                score: rScore,
                sublabel: wfhPct > 20 ? "Tech Hub Potential" : "Growing Segment",
                description: "Home office ergonomics, async productivity, and remote-first gear."
            });
        }

        // 4. Luxury & High-Ticket
        const highEarnerPct = (stats.segments.highEarners / (totalPop / 2.5)) * 100;
        const lScore = getScore(highEarnerPct, 10);
        if (stats.medianIncome > 85000 || highEarnerPct > 12) {
            candidates.push({
                id: "luxury",
                label: "Premium Hobbies",
                score: lScore,
                sublabel: lScore > 8 ? "High Luxury" : "Premium Tier",
                description: "High-ticket courses, luxury goods, and specialized hobby coaching."
            });
        }

        // 5. Bilingual / Multicultural
        const spanishPct = stats.logistics.speakSpanishPct;
        if (spanishPct > 15) {
            const bScore = getScore(spanishPct, 25);
            candidates.push({
                id: "multicultural",
                label: "Hispanic Market",
                score: bScore,
                sublabel: "Hyper-Localized",
                description: "Bilingual education, cultural goods, and Spanish-first digital services."
            });
        }

        // 6. Home Services
        const homeScore = getScore(stats.affordability.homeownershipRate, 65);
        candidates.push({
            id: "home-office",
            label: "Home Optimization",
            score: homeScore,
            sublabel: stats.affordability.homeownershipRate > 70 ? "Homeowner Dense" : "Stable",
            description: "Smart home, DIY maintenance, and family-oriented home office gear."
        });

        // Sort by score
        candidates.sort((a, b) => b.score - a.score);

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
            candidates: candidates.slice(0, 3), // Keep top 3 for UI
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
