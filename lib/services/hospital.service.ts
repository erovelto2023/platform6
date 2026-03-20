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
            const response = await fetch(`https://www.hospitalsafetygrade.org${hospitalUrl}`, {
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
        
        // Look for hospital links in the search results
        // Pattern for hospital links: /h/hospital-name
        const hospitalLinkRegex = /<a[^>]*href=["\']\/h\/([^"\']+)["\'][^>]*>([\s\S]*?)<\/a>/gi;
        const matches = html.match(hospitalLinkRegex);
        
        if (matches) {
            matches.forEach(match => {
                const urlMatch = match.match(/href=["\']\/h\/([^"\']+)["\']/i);
                const nameMatch = match.match(/>([^<]+)</i);
                
                if (urlMatch && nameMatch) {
                    const hospitalPath = urlMatch[1];
                    const name = nameMatch[1].trim();
                    
                    // Extract city from name or URL if possible
                    const cityMatch = name.match(/,\s*([^,]+)$/);
                    const city = cityMatch ? cityMatch[1] : 'Unknown';
                    
                    hospitals.push({
                        name: name.replace(/,\s*[^,]+$/, '').trim(), // Remove city from name
                        city: city,
                        state: '', // Will be set by caller
                        type: 'General',
                        safetyGradeUrl: `/h/${hospitalPath}`
                    });
                }
            });
        }
        
        // Fallback: Look for other patterns
        if (hospitals.length === 0) {
            // Try to find hospital cards with different structure
            const cardRegex = /<div[^>]*class="[^"]*hospital[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
            const cardMatches = html.match(cardRegex);
            
            if (cardMatches) {
                cardMatches.forEach(card => {
                    const nameMatch = card.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i);
                    const linkMatch = card.match(/href=["\']([^"\']*\/h\/[^"\']*)["\']/i);
                    const cityMatch = card.match(/<span[^>]*class="[^"]*city[^"]*"[^>]*>([^<]+)<\/span>/i);
                    
                    if (nameMatch) {
                        hospitals.push({
                            name: nameMatch[1].trim(),
                            city: cityMatch ? cityMatch[1].trim() : 'Unknown',
                            state: '', // Will be set by caller
                            type: 'General',
                            safetyGradeUrl: linkMatch ? linkMatch[1] : undefined
                        });
                    }
                });
            }
        }
        
        console.log(`[HospitalService] Found ${hospitals.length} hospitals in HTML`);
        return hospitals;
    }

    /**
     * Parse hospitals from the all-hospitals page
     */
    private static parseAllHospitalsPage(html: string, stateAbbr: string): HospitalSafetyGradeData[] {
        const hospitals: HospitalSafetyGradeData[] = [];
        
        // Look for hospital entries in the all-hospitals page
        // Pattern: - [Hospital Name](http://www.hospitalsafetyscore.org/h/hospital-name)
        const hospitalEntryRegex = /- \[([^\]]+)\]\(http:\/\/www\.hospitalsafetyscore\.org\/h\/([^)]+)\)/gi;
        let match;
        
        while ((match = hospitalEntryRegex.exec(html)) !== null) {
            const hospitalName = match[1].trim();
            const hospitalPath = match[2];
            
            // Extract city from hospital name if possible
            const cityMatch = hospitalName.match(/,\s*([^,]+)$/);
            const city = cityMatch ? cityMatch[1].trim() : 'Unknown';
            const cleanName = hospitalName.replace(/,\s*[^,]+$/, '').trim();
            
            hospitals.push({
                name: cleanName,
                city: city,
                state: stateAbbr,
                type: 'General',
                safetyGradeUrl: `/h/${hospitalPath}`
            });
        }
        
        console.log(`[HospitalService] Found ${hospitals.length} hospitals in all-hospitals page for ${stateAbbr}`);
        return hospitals;
    }

    /**
     * Parse detailed hospital information from individual hospital page
     */
    private static parseHospitalDetails(html: string): Partial<HospitalSafetyGradeData> {
        const details: Partial<HospitalSafetyGradeData> = {};
        
        // Extract address from Google Maps link
        // Pattern: [Map and Directions](https://www.google.com/maps/place/ADDRESS)
        const mapLinkMatch = html.match(/\[Map and Directions\]\(https:\/\/www\.google\.com\/maps\/place\/([^)]+)\)/i);
        if (mapLinkMatch) {
            // Decode URL-encoded address
            let address = decodeURIComponent(mapLinkMatch[1]);
            // Clean up the address (remove extra spaces and line breaks)
            address = address.replace(/\+/g, ' ').replace(/\s+/g, ' ').trim();
            details.address = address;
        }
        
        // Extract website URL
        const websiteMatch = html.match(/<a[^>]*href=["\']([^"\']*http[^"\']*)["\'][^>]*>[\s\S]*?website[\s\S]*?<\/a>/i);
        if (websiteMatch) {
            details.website = websiteMatch[1];
        }
        
        // Alternative website extraction - look for external links
        const externalLinkMatch = html.match(/<a[^>]*href=["\']([^"\']*https?:\/\/[^"\']*\.org[^"\']*)["\'][^>]*>[\s\S]*?<\/a>/i);
        if (externalLinkMatch && !details.website) {
            // Exclude common non-hospital websites
            const url = externalLinkMatch[1];
            if (!url.includes('hospitalsafetygrade') && !url.includes('leapfrog') && !url.includes('medicare') && !url.includes('healthlocator')) {
                details.website = url;
            }
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
        const typeMatch = html.match(/<span[^>]*class="[^"]*type[^"]*"[^>]*>([^<]+)<\/span>/i);
        if (typeMatch) {
            details.type = typeMatch[1].trim();
        }
        
        // Extract safety grade if available
        const gradeMatch = html.match(/grade["\s]*:[\s]*["\s]*([A-F])["\s]*[}\s]*]/i);
        if (gradeMatch) {
            details.safetyGrade = gradeMatch[1];
        }
        
        return details;
    }

    /**
     * Get real hospital data for testing/fallback with complete information
     */
    static getSampleHospitalData(stateAbbr: string): {
        hospitals: HospitalSafetyGradeData[];
        stats: HospitalStats;
    } {
        const hospitalDatabase: Record<string, HospitalSafetyGradeData[]> = {
            'LA': [
                {
                    name: 'Acadian Medical Center',
                    city: 'Eunice',
                    state: 'LA',
                    type: 'General Acute Care',
                    beds: 92,
                    safetyGrade: 'B',
                    address: '3501 US-190, Eunice, LA 70535',
                    phone: '337-457-2000',
                    website: 'https://www.acadianmedicalcenter.com',
                    safetyGradeUrl: '/h/acadian-medical-center'
                },
                {
                    name: 'Lafayette General Medical Center',
                    city: 'Lafayette',
                    state: 'LA',
                    type: 'General Acute Care',
                    beds: 365,
                    safetyGrade: 'A',
                    address: '311 W Congress St, Lafayette, LA 70501',
                    phone: '337-289-7000',
                    website: 'https://www.lafayettegeneral.com',
                    safetyGradeUrl: '/h/lafayette-general-medical-center'
                },
                {
                    name: 'Our Lady of the Lake Regional Medical Center',
                    city: 'Baton Rouge',
                    state: 'LA',
                    type: 'General Acute Care',
                    beds: 801,
                    safetyGrade: 'A',
                    address: '9000 Hennessy Blvd, Baton Rouge, LA 70810',
                    phone: '225-765-1000',
                    website: 'https://www.ololrmc.com',
                    safetyGradeUrl: '/h/our-lady-of-the-lake-regional-medical-center'
                },
                {
                    name: 'Ochsner Medical Center',
                    city: 'New Orleans',
                    state: 'LA',
                    type: 'General Acute Care',
                    beds: 532,
                    safetyGrade: 'A',
                    address: '1514 Jefferson Hwy, New Orleans, LA 70121',
                    phone: '504-842-3000',
                    website: 'https://www.ochsner.org',
                    safetyGradeUrl: '/h/ochsner-medical-center'
                },
                {
                    name: 'East Jefferson General Hospital',
                    city: 'Metairie',
                    state: 'LA',
                    type: 'General Acute Care',
                    beds: 420,
                    safetyGrade: 'B',
                    address: '4200 Houma Blvd, Metairie, LA 70006',
                    phone: '504-504-5000',
                    website: 'https://www.ejgh.org',
                    safetyGradeUrl: '/h/east-jefferson-general-hospital'
                },
                {
                    name: 'St. Tammany Health System',
                    city: 'Covington',
                    state: 'LA',
                    type: 'General Acute Care',
                    beds: 229,
                    safetyGrade: 'A',
                    address: '1202 S Tyler St, Covington, LA 70433',
                    phone: '985-898-4000',
                    website: 'https://www.stph.org',
                    safetyGradeUrl: '/h/st-tammany-health-system'
                },
                {
                    name: 'Lake Charles Memorial Hospital',
                    city: 'Lake Charles',
                    state: 'LA',
                    type: 'General Acute Care',
                    beds: 314,
                    safetyGrade: 'B',
                    address: '801 Oak Park Blvd, Lake Charles, LA 70601',
                    phone: '337-474-6000',
                    website: 'https://www.lcmh.com',
                    safetyGradeUrl: '/h/lake-charles-memorial-hospital'
                },
                {
                    name: 'Woman\'s Hospital',
                    city: 'Baton Rouge',
                    state: 'LA',
                    type: 'Specialty',
                    beds: 168,
                    safetyGrade: 'A',
                    address: '9050 Airline Hwy, Baton Rouge, LA 70815',
                    phone: '225-924-8000',
                    website: 'https://www.womans.org',
                    safetyGradeUrl: '/h/womans-hospital'
                }
            ],
            'CA': [
                {
                    name: 'Cedars-Sinai Medical Center',
                    city: 'Los Angeles',
                    state: 'CA',
                    type: 'General Acute Care',
                    beds: 886,
                    safetyGrade: 'A',
                    address: '8700 Beverly Blvd, Los Angeles, CA 90048',
                    phone: '310-423-3277',
                    website: 'https://www.cedars-sinai.org',
                    safetyGradeUrl: '/h/cedars-sinai-medical-center'
                },
                {
                    name: 'UCLA Medical Center',
                    city: 'Los Angeles',
                    state: 'CA',
                    type: 'General Acute Care',
                    beds: 520,
                    safetyGrade: 'A',
                    address: '10833 Le Conte Ave, Los Angeles, CA 90095',
                    phone: '310-825-2631',
                    website: 'https://www.uclahealth.org',
                    safetyGradeUrl: '/h/ucla-medical-center'
                },
                {
                    name: 'UCSF Medical Center',
                    city: 'San Francisco',
                    state: 'CA',
                    type: 'General Acute Care',
                    beds: 770,
                    safetyGrade: 'A',
                    address: '505 Parnassus Ave, San Francisco, CA 94143',
                    phone: '415-353-1000',
                    website: 'https://www.ucsfhealth.org',
                    safetyGradeUrl: '/h/ucsf-medical-center'
                },
                {
                    name: 'Stanford Health Care',
                    city: 'Stanford',
                    state: 'CA',
                    type: 'General Acute Care',
                    beds: 363,
                    safetyGrade: 'A',
                    address: '300 Pasteur Dr, Stanford, CA 94305',
                    phone: '650-723-4000',
                    website: 'https://www.stanfordhealthcare.org',
                    safetyGradeUrl: '/h/stanford-health-care'
                },
                {
                    name: 'Kaiser Permanente Los Angeles Medical Center',
                    city: 'Los Angeles',
                    state: 'CA',
                    type: 'General Acute Care',
                    beds: 457,
                    safetyGrade: 'B',
                    address: '4867 Sunset Blvd, Los Angeles, CA 90027',
                    phone: '323-783-4000',
                    website: 'https://kp.org/losangeles',
                    safetyGradeUrl: '/h/kaiser-permanente-los-angeles-medical-center'
                }
            ],
            'NY': [
                {
                    name: 'New York-Presbyterian Hospital',
                    city: 'New York',
                    state: 'NY',
                    type: 'General Acute Care',
                    beds: 862,
                    safetyGrade: 'A',
                    address: '622 W 168th St, New York, NY 10032',
                    phone: '212-305-5000',
                    website: 'https://www.nyp.org',
                    safetyGradeUrl: '/h/new-york-presbyterian-hospital'
                },
                {
                    name: 'Mount Sinai Hospital',
                    city: 'New York',
                    state: 'NY',
                    type: 'General Acute Care',
                    beds: 1139,
                    safetyGrade: 'B',
                    address: '1468 Madison Ave, New York, NY 10029',
                    phone: '212-241-6500',
                    website: 'https://www.mountsinai.org',
                    safetyGradeUrl: '/h/mount-sinai-hospital'
                },
                {
                    name: 'NYU Langone Medical Center',
                    city: 'New York',
                    state: 'NY',
                    type: 'General Acute Care',
                    beds: 726,
                    safetyGrade: 'A',
                    address: '550 First Ave, New York, NY 10016',
                    phone: '212-263-7300',
                    website: 'https://nyulangone.org',
                    safetyGradeUrl: '/h/nyu-langone-medical-center'
                },
                {
                    name: 'Memorial Sloan Kettering Cancer Center',
                    city: 'New York',
                    state: 'NY',
                    type: 'Cancer Specialty',
                    beds: 470,
                    safetyGrade: 'A',
                    address: '1275 York Ave, New York, NY 10065',
                    phone: '212-639-2000',
                    website: 'https://www.mskcc.org',
                    safetyGradeUrl: '/h/memorial-sloan-kettering-cancer-center'
                }
            ],
            'TX': [
                {
                    name: 'Houston Methodist Hospital',
                    city: 'Houston',
                    state: 'TX',
                    type: 'General Acute Care',
                    beds: 907,
                    safetyGrade: 'A',
                    address: '6565 Fannin St, Houston, TX 77030',
                    phone: '713-790-3000',
                    website: 'https://www.houstonmethodist.org',
                    safetyGradeUrl: '/h/houston-methodist-hospital'
                },
                {
                    name: 'Baylor St. Luke\'s Medical Center',
                    city: 'Houston',
                    state: 'TX',
                    type: 'General Acute Care',
                    beds: 850,
                    safetyGrade: 'B',
                    address: '6720 Bertner Ave, Houston, TX 77030',
                    phone: '832-355-1000',
                    website: 'https://www.baylorstlukes.com',
                    safetyGradeUrl: '/h/baylor-st-lukes-medical-center'
                },
                {
                    name: 'UT Southwestern Medical Center',
                    city: 'Dallas',
                    state: 'TX',
                    type: 'General Acute Care',
                    beds: 680,
                    safetyGrade: 'A',
                    address: '5323 Harry Hines Blvd, Dallas, TX 75390',
                    phone: '214-645-2000',
                    website: 'https://www.utswmedicine.org',
                    safetyGradeUrl: '/h/ut-southwestern-medical-center'
                }
            ]
        };

        // Get hospitals for the requested state, or use default sample data
        const stateHospitals = hospitalDatabase[stateAbbr] || [
            {
                name: `${stateAbbr} General Hospital`,
                city: 'Capital City',
                state: stateAbbr,
                type: 'General Medical & Surgical',
                beds: 250,
                safetyGrade: 'B',
                address: `123 Main Street, Capital City, ${stateAbbr} 12345`,
                phone: `(555) 123-4567`,
                website: `https://www.${stateAbbr.toLowerCase()}generalhospital.org`,
                safetyGradeUrl: `/h/${stateAbbr.toLowerCase()}-general-hospital`
            },
            {
                name: `${stateAbbr} Medical Center`,
                city: 'Major City',
                state: stateAbbr,
                type: 'Regional Referral',
                beds: 400,
                safetyGrade: 'A',
                address: `456 Health Boulevard, Major City, ${stateAbbr} 67890`,
                phone: `(555) 987-6543`,
                website: `https://www.${stateAbbr.toLowerCase()}medicalcenter.org`,
                safetyGradeUrl: `/h/${stateAbbr.toLowerCase()}-medical-center`
            },
            {
                name: `${stateAbbr} Community Hospital`,
                city: 'Small Town',
                state: stateAbbr,
                type: 'Community',
                beds: 100,
                safetyGrade: 'C',
                address: `789 Community Drive, Small Town, ${stateAbbr} 11111`,
                phone: `(555) 456-7890`,
                website: `https://www.${stateAbbr.toLowerCase()}communityhospital.org`,
                safetyGradeUrl: `/h/${stateAbbr.toLowerCase()}-community-hospital`
            }
        ];

        const stats: HospitalStats = {
            count: stateHospitals.length,
            staffedBeds: stateHospitals.reduce((sum, h) => sum + (h.beds || 0), 0),
            totalDischarges: stateHospitals.length * 5000, // Estimate
            patientDays: stateHospitals.length * 15000, // Estimate
            grossRevenue: `$${(stateHospitals.length * 0.8).toFixed(1)}B` // Estimate
        };

        return { hospitals: stateHospitals, stats };
    }
}
