const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "us-states.p.rapidapi.com";

export interface RapidStateMetadata {
    name: string;
    abbreviation: string;
    capital: {
        name: string;
        latitude?: string;
        longitude?: string;
    };
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
            throw new Error(errorMessage);
        }

        try {
            // Use the cleaner /name/{stateName} endpoint for better specificity
            const url = `https://${RAPIDAPI_HOST}/name/${encodeURIComponent(stateName)}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': RAPIDAPI_HOST
                },
                cache: 'no-store'
            });

            if (!response.ok) {
                console.error("RapidAPI fetch failed:", response.status, response.statusText);
                return null;
            }

            const data = await response.json();
            console.log(`[RapidAPI] Raw metadata response for ${stateName}:`, JSON.stringify(data).substring(0, 200));
            
            // Handle various response wrappers
            let result = data;
            if (data.results && Array.isArray(data.results)) result = data.results[0];
            else if (Array.isArray(data)) result = data[0];
            else if (data.data) result = data.data;
            
            if (!result || typeof result !== 'object') {
                console.warn(`[RapidAPI] No valid result object found in response for ${stateName}`);
                return null;
            }

            // Capital can be a string or an object
            const rawCapital = result.capital || result.Capital;
            const capital = typeof rawCapital === 'string' 
                ? { name: rawCapital } 
                : { 
                    name: rawCapital?.name || "Unknown", 
                    latitude: rawCapital?.latitude?.toString(), 
                    longitude: rawCapital?.longitude?.toString() 
                };

            return {
                name: result.name || result.Name || "Unknown",
                abbreviation: (result.abbreviation || result.Abbreviation || result.abbr || "").toUpperCase(),
                capital,
                statehood_date: (result.statehood_date || result.statehoodDate || result.date_of_statehood || "").toString(),
                population: Number(result.population || result.Population || 0),
                nickname: result.nickname || result.Nickname || "",
                fips_code: result.fips_code || result.fipsCode || "",
                demonym: result.demonym || result.Demonym || "",
                elevation_max_feet: Number(result.elevation_max_feet || result.elevationMaxFeet || result.max_elevation || 0),
                elevation_min_feet: Number(result.elevation_min_feet || result.elevationMinFeet || result.min_elevation || 0),
                timezone: result.timezone || result.timeZone || result.time_zone || "",
                region: result.region || result.Region || "",
                division: result.division || result.Division || ""
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
        if (!RAPIDAPI_KEY || !abbr || RAPIDAPI_KEY.includes("REPLACE_WITH")) return null;

        try {
            const url = `https://${RAPIDAPI_HOST}/symbols/${abbr.toUpperCase()}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': RAPIDAPI_HOST
                },
                cache: 'no-store'
            });

            if (!response.ok) return null;
            const data = await response.json();
            console.log(`[RapidAPI] Raw symbols response for ${abbr}:`, JSON.stringify(data).substring(0, 200));

            let result = data;
            if (data.results && Array.isArray(data.results)) result = data.results[0];
            else if (Array.isArray(data)) result = data[0];
            else if (data.data) result = data.data;

            if (!result || typeof result !== 'object') {
                console.warn(`[RapidAPI] No valid symbols object found for ${abbr}`);
                return null;
            }

            return {
                bird: result.bird || result.Bird || result.state_bird || "",
                flower: result.flower || result.Flower || result.state_flower || "",
                tree: result.tree || result.Tree || result.state_tree || "",
                motto: result.motto || result.Motto || result.state_motto || "",
                song: result.song || result.Song || result.state_song || ""
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
        if (!RAPIDAPI_KEY || !abbr || RAPIDAPI_KEY.includes("REPLACE_WITH")) return null;

        try {
            const url = `https://${RAPIDAPI_HOST}/subdivisions/${abbr.toUpperCase()}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': RAPIDAPI_HOST
                },
                cache: 'no-store'
            });

            if (!response.ok) return null;
            const data = await response.json();
            console.log(`[RapidAPI] Raw subdivisions response for ${abbr}:`, JSON.stringify(data).substring(0, 200));

            let list = data;
            if (data.results && Array.isArray(data.results)) list = data.results;
            else if (data.subdivisions && Array.isArray(data.subdivisions)) list = data.subdivisions;
            else if (data.data && Array.isArray(data.data)) list = data.data;
            
            if (Array.isArray(list)) {
                return list.map((item: any) => typeof item === 'string' ? item : (item.name || item.text || item.label));
            }
            return null;
        } catch (error) {
            console.error("Error fetching subdivisions:", error);
            return null;
        }
    }
}
