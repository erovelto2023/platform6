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
    signals: string[];
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

export interface IndustryStat {
    name: string;
    pct: number;
}

export interface OccupationStat {
    name: string;
    pct: number;
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
    economy: {
        topIndustries: IndustryStat[];
        topOccupations: OccupationStat[];
        employmentType: {
            private: number;
            public: number;
            selfEmployed: number;
        };
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

            const batch3 = [
                "NAME", // 0
                // Occupations (DP03_0027PE to DP03_0031PE)
                "DP03_0027PE", // 1: Management, business, science, and arts
                "DP03_0028PE", // 2: Service
                "DP03_0029PE", // 3: Sales and office
                "DP03_0030PE", // 4: Natural resources, construction, and maintenance
                "DP03_0031PE", // 5: Production, transportation, and material moving
                // Industries (DP03_0033PE to DP03_0045PE)
                "DP03_0033PE", "DP03_0034PE", "DP03_0035PE", "DP03_0036PE", "DP03_0037PE", // 6-10
                "DP03_0038PE", "DP03_0039PE", "DP03_0040PE", "DP03_0041PE", "DP03_0042PE", // 11-15
                "DP03_0043PE", "DP03_0044PE", "DP03_0045PE", // 16-18
                // Employment Type
                "DP03_0047PE", "DP03_0048PE", "DP03_0049PE" // 19-21: Private, Public, Self-employed
            ].join(",");

            const year = "2022";
            const geoTypes = ["place", "county subdivision"];
            let matchingRow1: string[] | null | undefined = null;
            let matchingRow2: string[] | null | undefined = null;
            let matchingRow3: string[] | null | undefined = null;

            for (const geoType of geoTypes) {
                const acsUrl = `${CENSUS_API_BASE}/${year}/acs/acs5?for=${encodeURIComponent(geoType)}:*&in=state:${stateFips}${API_KEY ? `&key=${API_KEY}` : ''}`;
                const dpUrl = `${CENSUS_API_BASE}/${year}/acs/acs5/profile?for=${encodeURIComponent(geoType)}:*&in=state:${stateFips}${API_KEY ? `&key=${API_KEY}` : ''}`;
                
                const [res1, res2, res3] = await Promise.all([
                    fetch(`${acsUrl}&get=${batch1}`),
                    fetch(`${acsUrl}&get=${batch2}`),
                    fetch(`${dpUrl}&get=${batch3}`)
                ]);

                if (!res1.ok || !res2.ok || !res3.ok) continue;

                const data1 = await res1.json();
                const data2 = await res2.json();
                const data3 = await res3.json();
                
                matchingRow1 = this.findMatchingRow(data1, cityName, stateName);
                matchingRow2 = this.findMatchingRow(data2, cityName, stateName);
                matchingRow3 = this.findMatchingRow(data3, cityName, stateName);

                if (matchingRow1 && matchingRow2 && matchingRow3) {
                    console.log(`[CensusService] Found match for ${cityName} as ${geoType}`);
                    break;
                }
            }

            if (!matchingRow1 || !matchingRow2 || !matchingRow3) {
                console.warn(`[CensusService] No match found for ${cityName}, ${stateName} in any geo table.`);
                return null;
            }

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
                economy: {
                    topOccupations: [
                        { name: "Management/Arts", pct: sanitizeValue(matchingRow3[1]) },
                        { name: "Service", pct: sanitizeValue(matchingRow3[2]) },
                        { name: "Sales/Office", pct: sanitizeValue(matchingRow3[3]) },
                        { name: "Natural Resources/Construction", pct: sanitizeValue(matchingRow3[4]) },
                        { name: "Production/Transport", pct: sanitizeValue(matchingRow3[5]) }
                    ].sort((a, b) => b.pct - a.pct),
                    topIndustries: [
                        { name: "Agri/Mining", pct: sanitizeValue(matchingRow3[6]) },
                        { name: "Construction", pct: sanitizeValue(matchingRow3[7]) },
                        { name: "Manufacturing", pct: sanitizeValue(matchingRow3[8]) },
                        { name: "Wholesale", pct: sanitizeValue(matchingRow3[9]) },
                        { name: "Retail", pct: sanitizeValue(matchingRow3[10]) },
                        { name: "Transport/Utilities", pct: sanitizeValue(matchingRow3[11]) },
                        { name: "Information", pct: sanitizeValue(matchingRow3[12]) },
                        { name: "Finance/Real Estate", pct: sanitizeValue(matchingRow3[13]) },
                        { name: "Prof/Admin", pct: sanitizeValue(matchingRow3[14]) },
                        { name: "Education/Health", pct: sanitizeValue(matchingRow3[15]) },
                        { name: "Arts/Food", pct: sanitizeValue(matchingRow3[16]) },
                        { name: "Other Services", pct: sanitizeValue(matchingRow3[17]) },
                        { name: "Public Admin", pct: sanitizeValue(matchingRow3[18]) }
                    ].sort((a, b) => b.pct - a.pct).slice(0, 5),
                    employmentType: {
                        private: sanitizeValue(matchingRow3[19]),
                        public: sanitizeValue(matchingRow3[20]),
                        selfEmployed: sanitizeValue(matchingRow3[21])
                    }
                },
                year: year
            };

            // Calculate Niche Insights
            baseStats.nicheInsights = this.calculateNicheInsights(baseStats);

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
            description: "Potty training, early learning, and toddler safety products.",
            signals: [
                `Toddler population at ${toddlerPct.toFixed(1)}%`,
                `High density of young families`
            ]
        });

        // 2. Senior Services
        const seniorPct = (stats.segments.seniors / totalPop) * 100;
        const sScore = getScore(seniorPct, 15);
        candidates.push({
            id: "seniors",
            label: "Senior Services",
            score: sScore,
            sublabel: sScore > 7 ? "Booming Demographic" : "Average Demand",
            description: "Assisted living, mobility aids, and senior health coaching.",
            signals: [
                `Senior population at ${seniorPct.toFixed(1)}%`,
                `Aging market above 15% threshold`
            ]
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
                description: "Home office ergonomics, async productivity, and remote-first gear.",
                signals: [
                    `${wfhPct}% work from home`,
                    `High digital connectivity demand`
                ]
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
                description: "High-ticket courses, luxury goods, and specialized hobby coaching.",
                signals: [
                    `Median income at $${stats.medianIncome.toLocaleString()}`,
                    `${highEarnerPct.toFixed(1)}% high-earner density`
                ]
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
                description: "Bilingual education, cultural goods, and Spanish-first digital services.",
                signals: [
                    `${spanishPct}% Spanish speaking households`,
                    `Strong cultural market potential`
                ]
            });
        }

        // 6. Home Services
        const homeScore = getScore(stats.affordability.homeownershipRate, 65);
        candidates.push({
            id: "home-office",
            label: "Home Optimization",
            score: homeScore,
            sublabel: stats.affordability.homeownershipRate > 70 ? "Homeowner Dense" : "Stable",
            description: "Smart home, DIY maintenance, and family-oriented home office gear.",
            signals: [
                `Homeownership at ${stats.affordability.homeownershipRate}%`,
                `Stable residential asset base`
            ]
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

    private static findMatchingRow(rows: string[][], name: string, state: string) {
        if (!rows || !Array.isArray(rows)) return null;
        const searchLower = name.toLowerCase().trim();
        const stateLower = state.toLowerCase().trim();
        
        // Suffixes we want to ignore or match against
        const suffixes = [" city", " town", " cdp", " village", " borough", " (part)"];
        
        // Exact match check
        let match = rows.find(row => {
            if (!row[0]) return false;
            const rowLower = row[0].toLowerCase();
            
            // Check variations: "Boise city, Idaho", "Barkhamsted town, Connecticut", etc.
            if (rowLower === `${searchLower}, ${stateLower}`) return true;
            for (const s of suffixes) {
                if (rowLower === `${searchLower}${s}, ${stateLower}`) return true;
                // Some COUSUBs have deeper grouping: "Barkhamsted town, Northwest Hills Planning Region, Connecticut"
                if (rowLower.startsWith(`${searchLower}${s},`) && rowLower.endsWith(stateLower)) return true;
            }
            return false;
        });

        // If no refined match, try broad containment as a last resort
        if (!match) {
            match = rows.find(row => {
                if (!row[0]) return false;
                const rowLower = row[0].toLowerCase();
                return rowLower.includes(searchLower) && rowLower.endsWith(stateLower);
            });
        }

        return match;
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
