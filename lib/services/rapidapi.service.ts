const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "us-states.p.rapidapi.com";

export interface RapidStateMetadata {
    [key: string]: any;
}

export class RapidApiService {
    /**
     * Fetch detailed state metadata from RapidAPI.
     */
    static async fetchStateMetadata(stateName: string): Promise<any | null> {
        if (!RAPIDAPI_KEY || RAPIDAPI_KEY.includes("REPLACE_WITH")) {
            const errorMessage = "RapidAPI key is missing or not configured. Please set RAPIDAPI_KEY environment variable.";
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        try {
            // Use the cleaner /name/{stateName} endpoint for better specificity
            const url = `https://${RAPIDAPI_HOST}/name/${encodeURIComponent(stateName)}`;
            
            console.log(`[RapidAPI] Fetching metadata for ${stateName} from: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': RAPIDAPI_HOST
                },
                cache: 'no-store'
            });

            console.log(`[RapidAPI] Response status: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const msg = errorData.message || response.statusText;
                console.error("RapidAPI fetch failed:", response.status, msg);
                throw new Error(`RapidAPI Error ${response.status}: ${msg}. Please check your RapidAPI key subscription or quota.`);
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
                throw new Error("No valid data object found in RapidAPI response.");
            }

            console.log(`[RapidAPI] Successfully parsed metadata for ${stateName}`);
            return result;

        } catch (error) {
            console.error("Error in RapidApiService.fetchStateMetadata:", error);
            throw error;
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
