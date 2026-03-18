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
    gender: {
        male: number;
        female: number;
    };
    ethnicity: {
        white: number;
        black: number;
        asian: number;
        hispanic: number;
    };
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

            // Variables: 
            // NAME, Total Pop, Median Income, 
            // Male, Female, 
            // White (non-hispanic), Black (non-hispanic), Asian (non-hispanic), Hispanic
            const vars = "NAME,B01003_001E,B19013_001E,B01001_002E,B01001_026E,B03002_003E,B03002_004E,B03002_006E,B03002_012E";
            
            const year = "2022";
            const url = `${CENSUS_API_BASE}/${year}/acs/acs5?get=${vars}&for=place:*&in=state:${stateFips}${API_KEY ? `&key=${API_KEY}` : ''}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Census API error: ${response.statusText}`);

            const data = await response.json();
            // headers: ["NAME", "B01003_001E", "B19013_001E", "B01001_002E", "B01001_026E", "B03002_003E", "B03002_004E", "B03002_006E", "B03002_012E", "state", "place"]

            const matchingRow = data.find((row: string[]) => 
                row[0].toLowerCase().startsWith(cityName.toLowerCase())
            );

            if (!matchingRow) return null;

            return {
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
