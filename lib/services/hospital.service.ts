const HOSPITAL_SAFETY_GRADE_BASE_URL = "https://www.hospitalsafetygrade.org";

export interface HospitalSafetyGradeData {
    name: string;
    city: string;
    state: string;
    type?: string;
    beds?: number;
    safetyGrade?: string;
    url?: string;
    address?: string;
    phone?: string;
    website?: string; // Hospital's own website
    safetyGradeUrl?: string; // Direct link to their safety grade page
}

export interface HospitalStats {
    count: number;
    staffedBeds: number;
    totalDischarges: number;
    patientDays: number;
    grossRevenue: string;
}

export class HospitalService {
    /**
     * Fetch hospital data for a specific state from Hospital Safety Grade API
     */
    static async fetchHospitalsByState(stateAbbr: string): Promise<{
        hospitals: HospitalSafetyGradeData[];
        stats?: HospitalStats;
    } | null> {
        try {
            console.log(`[HospitalService] Fetching hospitals for state: ${stateAbbr}`);
            
            // First, try to get the search results page
            const searchUrl = `${HOSPITAL_SAFETY_GRADE_BASE_URL}/search?findBy=state&zip_code=&city=&state_prov=${stateAbbr}&hospital=`;
            
            const response = await fetch(searchUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                },
                cache: 'no-store'
            });

            if (!response.ok) {
                console.error(`[HospitalService] Failed to fetch hospitals: ${response.status} ${response.statusText}`);
                return null;
            }

            const html = await response.text();
            
            // Parse HTML to extract hospital data
            let hospitals = this.parseHospitalDataFromHTML(html);
            
            // If no hospitals found, try the all-hospitals page
            if (hospitals.length === 0) {
                console.log(`[HospitalService] No hospitals found in search, trying all-hospitals page...`);
                const allHospitalsData = await this.fetchFromAllHospitalsPage(stateAbbr);
                if (allHospitalsData && allHospitalsData.length > 0) {
                    hospitals = allHospitalsData;
                }
            }
            
            // Fetch detailed information for each hospital (including website URLs)
            const enrichedHospitals = await this.enrichHospitalData(hospitals);
            
            console.log(`[HospitalService] Found ${enrichedHospitals.length} hospitals for ${stateAbbr}`);
            
            // Calculate stats
            const stats: HospitalStats = {
                count: enrichedHospitals.length,
                staffedBeds: enrichedHospitals.reduce((sum, h) => sum + (h.beds || 0), 0),
                totalDischarges: 0, // Not available from this API
                patientDays: 0, // Not available from this API
                grossRevenue: "Not Available" // Not available from this API
            };

            return { hospitals: enrichedHospitals, stats };
            
        } catch (error) {
            console.error("[HospitalService] Error fetching hospital data:", error);
            return null;
        }
    }

    /**
     * Fetch hospitals from the all-hospitals page
     */
    private static async fetchFromAllHospitalsPage(stateAbbr: string): Promise<HospitalSafetyGradeData[]> {
        try {
            const allHospitalsUrl = `${HOSPITAL_SAFETY_GRADE_BASE_URL}/all-hospitals`;
            
            const response = await fetch(allHospitalsUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                },
                cache: 'no-store'
            });

            if (!response.ok) {
                console.error(`[HospitalService] Failed to fetch all-hospitals page: ${response.status}`);
                return [];
            }

            const html = await response.text();
            return this.parseAllHospitalsPage(html, stateAbbr);
            
        } catch (error) {
            console.error("[HospitalService] Error fetching from all-hospitals page:", error);
            return [];
        }
    }

    /**
     * Enrich hospital data with detailed information including website URLs
     */
    private static async enrichHospitalData(hospitals: HospitalSafetyGradeData[]): Promise<HospitalSafetyGradeData[]> {
        const enrichedHospitals = await Promise.all(
            hospitals.map(async (hospital) => {
                try {
                    // If we have a safety grade URL, fetch detailed information
                    if (hospital.safetyGradeUrl) {
                        const details = await this.fetchHospitalDetails(hospital.safetyGradeUrl);
                        return { ...hospital, ...details };
                    }
                    return hospital;
                } catch (error) {
                    console.warn(`[HospitalService] Failed to enrich data for ${hospital.name}:`, error);
                    return hospital;
                }
            })
        );
        
        return enrichedHospitals;
    }

    /**
     * Fetch detailed information for a specific hospital
     */
    private static async fetchHospitalDetails(hospitalUrl: string): Promise<Partial<HospitalSafetyGradeData>> {
        try {
            const response = await fetch(`${HOSPITAL_SAFETY_GRADE_BASE_URL}${hospitalUrl}`, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                },
                cache: 'no-store'
            });

            if (!response.ok) {
                console.warn(`[HospitalService] Failed to fetch hospital details: ${response.status}`);
                return {};
            }

            const html = await response.text();
            return this.parseHospitalDetails(html);
            
        } catch (error) {
            console.error("[HospitalService] Error fetching hospital details:", error);
            return {};
        }
    }

    /**
     * Parse hospital data from HTML response
     * This is a simplified parser - in production, you'd want a more robust HTML parser
     */
    private static parseHospitalDataFromHTML(html: string): HospitalSafetyGradeData[] {
        const hospitals: HospitalSafetyGradeData[] = [];
        
        // Look for hospital data patterns in the HTML
        // This is a basic implementation - you may need to adjust based on actual HTML structure
        const hospitalRegex = /<div[^>]*class="hospital-card[^>]*>([\s\S]*?)<\/div>/gi;
        const matches = html.match(hospitalRegex);
        
        if (matches) {
            matches.forEach(match => {
                const nameMatch = match.match(/<h3[^>]*>([^<]+)<\/h3>/i);
                const cityMatch = match.match(/<span[^>]*class="city[^>]*>([^<]+)<\/span>/i);
                const typeMatch = match.match(/<span[^>]*class="type[^>]*>([^<]+)<\/span>/i);
                const bedsMatch = match.match(/(\d+)\s*(?:beds|bed)/i);
                const gradeMatch = match.match(/grade["\s]*:[\s]*["\s]*([A-F])["\s]*[}\s]*]/i);
                const urlMatch = match.match(/href=["\']([^"\']+)["\']/i);
                
                if (nameMatch) {
                    hospitals.push({
                        name: nameMatch[1].trim(),
                        city: cityMatch ? cityMatch[1].trim() : 'Unknown',
                        state: '', // Will be set by caller
                        type: typeMatch ? typeMatch[1].trim() : 'General',
                        beds: bedsMatch ? parseInt(bedsMatch[1]) : undefined,
                        safetyGrade: gradeMatch ? gradeMatch[1] : undefined,
                        safetyGradeUrl: urlMatch ? urlMatch[1] : undefined
                    });
                }
            });
        }
        
        // Fallback: If no structured data found, return empty array
        if (hospitals.length === 0) {
            console.log('[HospitalService] No hospital data found in HTML, may need to adjust parsing logic');
        }
        
        return hospitals;
    }

    /**
     * Parse hospitals from the all-hospitals page
     */
    private static parseAllHospitalsPage(html: string, stateAbbr: string): HospitalSafetyGradeData[] {
        const hospitals: HospitalSafetyGradeData[] = [];
        
        // Look for hospital entries in the all-hospitals page
        // This would need to be adapted based on the actual HTML structure
        const hospitalEntryRegex = /<a[^>]*href=["\']([^"\']*hospital[^"\']*)["\'][^>]*>([\s\S]*?)<\/a>/gi;
        const matches = html.match(hospitalEntryRegex);
        
        if (matches) {
            matches.forEach(match => {
                const urlMatch = match.match(/href=["\']([^"\']+)["\']/i);
                const nameMatch = match.match(/>([^<]+)</i);
                
                if (urlMatch && nameMatch) {
                    // Extract city from name or URL if possible
                    const name = nameMatch[1].trim();
                    const cityMatch = name.match(/,\s*([^,]+)$/);
                    const city = cityMatch ? cityMatch[1] : 'Unknown';
                    
                    hospitals.push({
                        name: name.replace(/,\s*[^,]+$/, '').trim(), // Remove city from name
                        city: city,
                        state: stateAbbr,
                        type: 'General',
                        safetyGradeUrl: urlMatch[1]
                    });
                }
            });
        }
        
        return hospitals;
    }

    /**
     * Parse detailed hospital information from individual hospital page
     */
    private static parseHospitalDetails(html: string): Partial<HospitalSafetyGradeData> {
        const details: Partial<HospitalSafetyGradeData> = {};
        
        // Extract website URL
        const websiteMatch = html.match(/<a[^>]*href=["\']([^"\']*http[^"\']*)["\'][^>]*>[\s\S]*?website[\s\S]*?<\/a>/i);
        if (websiteMatch) {
            details.website = websiteMatch[1];
        }
        
        // Extract address
        const addressMatch = html.match(/<address[^>]*>([\s\S]*?)<\/address>/i);
        if (addressMatch) {
            details.address = addressMatch[1].replace(/<[^>]*>/g, '').trim();
        }
        
        // Extract phone number
        const phoneMatch = html.match(/(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/);
        if (phoneMatch) {
            details.phone = phoneMatch[1];
        }
        
        // Extract bed count if not already available
        const bedsMatch = html.match(/(\d+)\s*(?:beds|bed)/i);
        if (bedsMatch && !details.beds) {
            details.beds = parseInt(bedsMatch[1]);
        }
        
        // Extract hospital type
        const typeMatch = html.match(/<span[^>]*class="type[^>]*>([^<]+)<\/span>/i);
        if (typeMatch) {
            details.type = typeMatch[1].trim();
        }
        
        return details;
    }

    /**
     * Get sample hospital data for testing/fallback
     */
    static getSampleHospitalData(stateAbbr: string): {
        hospitals: HospitalSafetyGradeData[];
        stats: HospitalStats;
    } {
        const sampleHospitals: HospitalSafetyGradeData[] = [
            {
                name: `${stateAbbr} General Hospital`,
                city: 'Capital City',
                state: stateAbbr,
                type: 'General Medical & Surgical',
                beds: 250,
                safetyGrade: 'B',
                website: `https://www.${stateAbbr.toLowerCase()}generalhospital.org`,
                safetyGradeUrl: `${HOSPITAL_SAFETY_GRADE_BASE_URL}/hospital/sample`
            },
            {
                name: `${stateAbbr} Medical Center`,
                city: 'Major City',
                state: stateAbbr,
                type: 'Regional Referral',
                beds: 400,
                safetyGrade: 'A',
                website: `https://www.${stateAbbr.toLowerCase()}medicalcenter.org`,
                safetyGradeUrl: `${HOSPITAL_SAFETY_GRADE_BASE_URL}/hospital/sample2`
            },
            {
                name: `${stateAbbr} Community Hospital`,
                city: 'Small Town',
                state: stateAbbr,
                type: 'Community',
                beds: 100,
                safetyGrade: 'C',
                website: `https://www.${stateAbbr.toLowerCase()}communityhospital.org`,
                safetyGradeUrl: `${HOSPITAL_SAFETY_GRADE_BASE_URL}/hospital/sample3`
            }
        ];

        const stats: HospitalStats = {
            count: sampleHospitals.length,
            staffedBeds: sampleHospitals.reduce((sum, h) => sum + (h.beds || 0), 0),
            totalDischarges: 15000,
            patientDays: 45000,
            grossRevenue: "$2.5B"
        };

        return { hospitals: sampleHospitals, stats };
    }
}
