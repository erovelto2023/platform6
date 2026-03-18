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

export interface CityStats {
    population: number;
    medianIncome: number;
    businessCount?: number;
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
            // We search in the ACS 5-year data for all places in the state
            const year = "2022"; // Latest stable ACS 5-year dataset
            const url = `${CENSUS_API_BASE}/${year}/acs/acs5?get=NAME,B01003_001E,B19013_001E&for=place:*&in=state:${stateFips}${API_KEY ? `&key=${API_KEY}` : ''}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Census API error: ${response.statusText}`);

            const data = await response.json();
            // data format: [ [header], [row1], [row2], ... ]
            // headers: ["NAME", "B01003_001E", "B19013_001E", "state", "place"]

            // Step 2: Find the matching city row
            // City names in Census often look like "Birmingham city, Alabama" or "Anchorage municipality, Alaska"
            const matchingRow = data.find((row: string[]) => 
                row[0].toLowerCase().startsWith(cityName.toLowerCase())
            );

            if (!matchingRow) return null;

            return {
                population: parseInt(matchingRow[1]) || 0,
                medianIncome: parseInt(matchingRow[2]) || 0,
                year: year
            };
        } catch (error) {
            console.error("Error fetching city demographics:", error);
            return null;
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
