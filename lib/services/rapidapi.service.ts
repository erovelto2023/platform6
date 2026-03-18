const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "us-states.p.rapidapi.com";

export interface RapidStateMetadata {
    name: string;
    abbreviation: string;
    capital: string;
    statehood_date: string;
    population: number;
    nickname: string;
    fips_code: string;
    demonym: string;
    elevation_max_feet: number;
    elevation_min_feet: number;
    timezone: string;
    region: string;
    division: string;
}

export class RapidApiService {
    /**
     * Fetch detailed state metadata from RapidAPI.
     */
    static async fetchStateMetadata(stateName: string): Promise<RapidStateMetadata | null> {
        if (!RAPIDAPI_KEY || RAPIDAPI_KEY.includes("REPLACE_WITH")) {
            const errorMessage = "RapidAPI key is missing or not configured. Please set RAPIDAPI_KEY environment variable.";
            console.error(errorMessage);
            throw new Error(errorMessage); // Throw an error to indicate a critical configuration issue
        }

        try {
            // The API expects the state name or abbreviation. 
            // Endpoint: /basic?name=California
            const url = `https://${RAPIDAPI_HOST}/basic?name=${encodeURIComponent(stateName)}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': RAPIDAPI_HOST
                }
            });

            if (!response.ok) {
                console.error("RapidAPI fetch failed:", response.status, response.statusText);
                return null;
            }

            const data = await response.json();
            
            // The API usually returns an array or a single object.
            // Based on research, it's likely an array of results if using a query.
            const result = Array.isArray(data) ? data[0] : data;
            
            if (!result) return null;

            return {
                name: result.name,
                abbreviation: result.abbreviation,
                capital: result.capital,
                statehood_date: result.statehood_date,
                population: result.population,
                nickname: result.nickname,
                fips_code: result.fips_code,
                demonym: result.demonym,
                elevation_max_feet: result.elevation_max_feet,
                elevation_min_feet: result.elevation_min_feet,
                timezone: result.timezone,
                region: result.region,
                division: result.division
            };

        } catch (error) {
            console.error("Error in RapidApiService.fetchStateMetadata:", error);
            return null;
        }
    }

    /**
     * Fetch state symbols (bird, flower, etc.)
     */
    static async fetchStateSymbols(abbr: string) {
        if (!RAPIDAPI_KEY || RAPIDAPI_KEY.includes("REPLACE_WITH")) return null;

        try {
            const url = `https://${RAPIDAPI_HOST}/symbols/${abbr.toUpperCase()}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': RAPIDAPI_HOST
                }
            });

            if (!response.ok) return null;
            const data = await response.json();
            const result = Array.isArray(data) ? data[0] : data;
            
            return {
                bird: result.bird,
                flower: result.flower,
                tree: result.tree,
                motto: result.motto,
                song: result.song
            };
        } catch (error) {
            console.error("Error fetching state symbols:", error);
            return null;
        }
    }

    /**
     * Fetch state subdivisions (counties)
     */
    static async fetchStateSubdivisions(abbr: string) {
        if (!RAPIDAPI_KEY || RAPIDAPI_KEY.includes("REPLACE_WITH")) return null;

        try {
            const url = `https://${RAPIDAPI_HOST}/subdivisions/${abbr.toUpperCase()}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': RAPIDAPI_HOST
                }
            });

            if (!response.ok) return null;
            const data = await response.json();
            
            // Expected format: Array of strings or objects with a 'name' property
            if (Array.isArray(data)) {
                return data.map((item: any) => typeof item === 'string' ? item : item.name);
            }
            return null;
        } catch (error) {
            console.error("Error fetching subdivisions:", error);
            return null;
        }
    }
}
