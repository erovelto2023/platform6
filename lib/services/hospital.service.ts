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
            const hospitals = this.parseHospitalDataFromHTML(html);
            
            console.log(`[HospitalService] Found ${hospitals.length} hospitals for ${stateAbbr}`);
            
            // Calculate stats
            const stats: HospitalStats = {
                count: hospitals.length,
                staffedBeds: hospitals.reduce((sum, h) => sum + (h.beds || 0), 0),
                totalDischarges: 0, // Not available from this API
                patientDays: 0, // Not available from this API
                grossRevenue: "Not Available" // Not available from this API
            };

            return { hospitals, stats };
            
        } catch (error) {
            console.error("[HospitalService] Error fetching hospital data:", error);
            return null;
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
                        url: urlMatch ? urlMatch[1] : undefined
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
                url: `${HOSPITAL_SAFETY_GRADE_BASE_URL}/hospital/sample`
            },
            {
                name: `${stateAbbr} Medical Center`,
                city: 'Major City',
                state: stateAbbr,
                type: 'Regional Referral',
                beds: 400,
                safetyGrade: 'A',
                url: `${HOSPITAL_SAFETY_GRADE_BASE_URL}/hospital/sample2`
            },
            {
                name: `${stateAbbr} Community Hospital`,
                city: 'Small Town',
                state: stateAbbr,
                type: 'Community',
                beds: 100,
                safetyGrade: 'C',
                url: `${HOSPITAL_SAFETY_GRADE_BASE_URL}/hospital/sample3`
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
