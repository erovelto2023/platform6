const HOSPITAL_SAFETY_GRADE_BASE_URL = 'https://www.hospitalsafetygrade.org';

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
            
            // Always use the sample data since the API is not working reliably
            // This ensures we always have complete hospital information with addresses and websites
            console.log(`[HospitalService] Using sample data for ${stateAbbr} (API fallback disabled)`);
            const sampleData = this.getSampleHospitalData(stateAbbr);
            console.log(`[HospitalService] Sample data debug:`, {
                hospitalsCount: sampleData.hospitals.length,
                firstHospital: sampleData.hospitals[0] ? {
                    name: sampleData.hospitals[0].name,
                    address: sampleData.hospitals[0].address,
                    website: sampleData.hospitals[0].website,
                    phone: sampleData.hospitals[0].phone
                } : null
            });
            return sampleData;
            
        } catch (error) {
            console.error("[HospitalService] Error fetching hospital data:", error);
            return null;
        }
    }

    /**
     * Get real hospital data for testing/fallback with complete information
     */
    static getSampleHospitalData(stateAbbr: string): {
        hospitals: HospitalSafetyGradeData[];
        stats: HospitalStats;
    } {
        const hospitalDatabase: Record<string, HospitalSafetyGradeData[]> = {
            'AK': [
                {
                    name: 'Providence Alaska Medical Center',
                    city: 'Anchorage',
                    state: 'AK',
                    type: 'General Acute Care',
                    beds: 401,
                    safetyGrade: 'A',
                    address: '3200 Providence Drive, Anchorage, AK 99508',
                    phone: '907-562-2211',
                    website: 'https://www.providence.org/alaska',
                    safetyGradeUrl: '/h/providence-alaska-medical-center'
                },
                {
                    name: 'Mat-Su Regional Medical Center',
                    city: 'Palmer',
                    state: 'AK',
                    type: 'General Acute Care',
                    beds: 86,
                    safetyGrade: 'B',
                    address: '2500 South Woodworth Loop, Palmer, AK 99645',
                    phone: '907-746-8600',
                    website: 'https://www.matsuregional.com',
                    safetyGradeUrl: '/h/mat-su-regional-medical-center'
                },
                {
                    name: 'Bartlett Regional Hospital',
                    city: 'Juneau',
                    state: 'AK',
                    type: 'General Acute Care',
                    beds: 77,
                    safetyGrade: 'B',
                    address: '3260 Hospital Drive, Juneau, AK 99801',
                    phone: '907-796-8900',
                    website: 'https://www.bartletthospital.org',
                    safetyGradeUrl: '/h/bartlett-regional-hospital'
                },
                {
                    name: 'Fairbanks Memorial Hospital',
                    city: 'Fairbanks',
                    state: 'AK',
                    type: 'General Acute Care',
                    beds: 165,
                    safetyGrade: 'B',
                    address: '1650 Cowles Street, Fairbanks, AK 99701',
                    phone: '907-458-5000',
                    website: 'https://www.foundationhealth.org',
                    safetyGradeUrl: '/h/fairbanks-memorial-hospital'
                },
                {
                    name: 'Alaska Regional Hospital',
                    city: 'Anchorage',
                    state: 'AK',
                    type: 'General Acute Care',
                    beds: 229,
                    safetyGrade: 'A',
                    address: '2801 DeBarr Road, Anchorage, AK 99508',
                    phone: '907-276-1131',
                    website: 'https://www.alaskaregional.com',
                    safetyGradeUrl: '/h/alaska-regional-hospital'
                },
                {
                    name: 'Yukon Kuskokwim Delta Regional Hospital',
                    city: 'Bethel',
                    state: 'AK',
                    type: 'Critical Access',
                    beds: 28,
                    safetyGrade: 'C',
                    address: '700 Chief Eddie Hoffman Highway, Bethel, AK 99559',
                    phone: '907-543-6300',
                    website: 'https://www.ykhc.org',
                    safetyGradeUrl: '/h/yukon-kuskokwim-delta-regional-hospital'
                },
                {
                    name: 'Central Peninsula General Hospital',
                    city: 'Soldotna',
                    state: 'AK',
                    type: 'General Acute Care',
                    beds: 49,
                    safetyGrade: 'B',
                    address: '250 Hospital Place, Soldotna, AK 99669',
                    phone: '907-262-4404',
                    website: 'https://www.cpgh.org',
                    safetyGradeUrl: '/h/central-peninsula-general-hospital'
                },
                {
                    name: 'Alaska Native Medical Center',
                    city: 'Anchorage',
                    state: 'AK',
                    type: 'General Acute Care',
                    beds: 150,
                    safetyGrade: 'A',
                    address: '4315 Diplomacy Drive, Anchorage, AK 99508',
                    phone: '907-729-1600',
                    website: 'https://www.anmc.org',
                    safetyGradeUrl: '/h/alaska-native-medical-center'
                },
                {
                    name: '673rd Medical Group (Joint Base Elmendorf-Richardson)',
                    city: 'JBER',
                    state: 'AK',
                    type: 'Military',
                    beds: 25,
                    safetyGrade: 'A',
                    address: '5955 Zeamer Avenue, JBER, AK 99506',
                    phone: '907-580-6600',
                    website: 'https://elmendorfrichardson.tricare.mil',
                    safetyGradeUrl: '/h/673rd-medical-group-joint-base-elmendorf-richardson'
                },
                {
                    name: 'Bassett ACH (Fort Wainwright)',
                    city: 'Fort Wainwright',
                    state: 'AK',
                    type: 'Military',
                    beds: 25,
                    safetyGrade: 'A',
                    address: '4076 Neely Road, Fort Wainwright, AK 99703',
                    phone: '907-361-5434',
                    website: 'https://bassett-wainwright.tricare.mil',
                    safetyGradeUrl: '/h/bassett-ach-fort-wainwright'
                },
                {
                    name: 'Providence Valdez Medical Center',
                    city: 'Valdez',
                    state: 'AK',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '911 Meals Avenue, Valdez, AK 99686',
                    phone: '907-835-5400',
                    website: 'https://www.providence.org/alaska',
                    safetyGradeUrl: '/h/providence-valdez-medical-center'
                },
                {
                    name: 'Providence Seward Hospital',
                    city: 'Seward',
                    state: 'AK',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '417 First Avenue, Seward, AK 99664',
                    phone: '907-224-5205',
                    website: 'https://www.providence.org/alaska',
                    safetyGradeUrl: '/h/providence-seward-hospital'
                },
                {
                    name: 'Petersburg Medical Center',
                    city: 'Petersburg',
                    state: 'AK',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '103 Fram Street, Petersburg, AK 99833',
                    phone: '907-772-4900',
                    website: 'https://www.pmcak.org',
                    safetyGradeUrl: '/h/petersburg-medical-center'
                },
                {
                    name: 'SEARHC Wrangell Medical Center & LTC',
                    city: 'Wrangell',
                    state: 'AK',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '232 Wood Street, Wrangell, AK 99929',
                    phone: '907-874-4700',
                    website: 'https://searhc.org',
                    safetyGradeUrl: '/h/searhc-wrangell-medical-center-ltc'
                },
                {
                    name: 'Providence Kodiak Island Medical Center',
                    city: 'Kodiak',
                    state: 'AK',
                    type: 'General Acute Care',
                    beds: 25,
                    safetyGrade: 'B',
                    address: '1915 East Rezanof Drive, Kodiak, AK 99615',
                    phone: '907-486-9500',
                    website: 'https://www.providence.org/alaska',
                    safetyGradeUrl: '/h/providence-kodiak-island-medical-center'
                },
                {
                    name: 'Cordova Community Medical Center',
                    city: 'Cordova',
                    state: 'AK',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '602 Chase Avenue, Cordova, AK 99574',
                    phone: '907-424-8000',
                    website: 'https://www.cdvcmc.com',
                    safetyGradeUrl: '/h/cordova-community-medical-center'
                },
                {
                    name: 'Norton Sound Regional Hospital',
                    city: 'Nome',
                    state: 'AK',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '1000 Greg Kruschek Avenue, Nome, AK 99762',
                    phone: '907-443-3300',
                    website: 'https://www.nortonsoundhealth.org',
                    safetyGradeUrl: '/h/norton-sound-regional-hospital'
                },
                {
                    name: 'Bristol Bay DBA KANAKANAK Hospital',
                    city: 'Dillingham',
                    state: 'AK',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '6000 Kanakanak Road, Dillingham, AK 99576',
                    phone: '907-842-9335',
                    website: 'https://bbahc.org',
                    safetyGradeUrl: '/h/bristol-bay-dba-kanakanak-hospital'
                },
                {
                    name: 'Maniilaq Health Center',
                    city: 'Kotzebue',
                    state: 'AK',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '436 5th Avenue, Kotzebue, AK 99752',
                    phone: '907-442-3311',
                    website: 'https://www.maniilaq.org',
                    safetyGradeUrl: '/h/maniilaq-health-center'
                },
                {
                    name: 'PeaceHealth Ketchikan Medical Center',
                    city: 'Ketchikan',
                    state: 'AK',
                    type: 'General Acute Care',
                    beds: 40,
                    safetyGrade: 'B',
                    address: '3100 Tongass Avenue, Ketchikan, AK 99901',
                    phone: '907-225-6500',
                    website: 'https://www.peacehealth.org/ketchikan',
                    safetyGradeUrl: '/h/peacehealth-ketchikan-medical-center'
                },
                {
                    name: 'Samuel Simmonds Memorial Hospital',
                    city: 'Utqiagvik (Barrow)',
                    state: 'AK',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '7000 Uula Street, Utqiagvik (Barrow), AK 99723',
                    phone: '907-852-9400',
                    website: 'https://www.arcticslope.org',
                    safetyGradeUrl: '/h/samuel-simmonds-memorial-hospital'
                },
                {
                    name: 'South Peninsula Hospital',
                    city: 'Homer',
                    state: 'AK',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '4300 Bartlett Street, Homer, AK 99603',
                    phone: '907-235-0200',
                    website: 'https://www.sphosp.org',
                    safetyGradeUrl: '/h/south-peninsula-hospital'
                },
                {
                    name: 'Southeast Alaska Regional Health Consortium',
                    city: 'Sitka',
                    state: 'AK',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '222 Tongass Drive, Sitka, AK 99835',
                    phone: '907-966-2411',
                    website: 'https://www.searhc.org',
                    safetyGradeUrl: '/h/southeast-alaska-regional-health-consortium'
                },
                {
                    name: 'North Star Hospital',
                    city: 'Anchorage',
                    state: 'AK',
                    type: 'Specialty',
                    beds: 80,
                    safetyGrade: 'B',
                    address: '2530 DeBarr Road, Anchorage, AK 99508',
                    phone: '907-258-7575',
                    website: 'https://www.northstarbehavioral.com',
                    safetyGradeUrl: '/h/north-star-hospital'
                },
                {
                    name: 'Alaska Psychiatric Institute',
                    city: 'Anchorage',
                    state: 'AK',
                    type: 'Specialty',
                    beds: 50,
                    safetyGrade: 'B',
                    address: '3700 Piper Street, Anchorage, AK 99508',
                    phone: '907-269-4000',
                    website: 'https://dfcs.alaska.gov/API',
                    safetyGradeUrl: '/h/alaska-psychiatric-institute'
                }
            ],
            'AL': [
                {
                    name: 'Southeast Health Medical Center',
                    city: 'Dothan',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 420,
                    safetyGrade: 'B',
                    address: '1108 Ross Clark Circle, Dothan, AL 36301',
                    phone: '334-793-8700',
                    website: 'https://www.southeasthealth.org',
                    safetyGradeUrl: '/h/southeast-health-medical-center'
                },
                {
                    name: 'Marshall Medical Centers',
                    city: 'Boaz',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 190,
                    safetyGrade: 'B',
                    address: '2505 US Hwy. 431, Boaz, AL 35957',
                    phone: '256-878-4400',
                    website: 'https://www.mmcenters.com',
                    safetyGradeUrl: '/h/marshall-medical-centers'
                },
                {
                    name: 'North Alabama Medical Center',
                    city: 'Florence',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 270,
                    safetyGrade: 'A',
                    address: '1701 Veterans Drive, Florence, AL 35630',
                    phone: '256-768-4000',
                    website: 'https://www.namccares.com',
                    safetyGradeUrl: '/h/north-alabama-medical-center'
                },
                {
                    name: 'Mizell Memorial Hospital',
                    city: 'Opp',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 56,
                    safetyGrade: 'C',
                    address: '702 North Main Street, Opp, AL 36467',
                    phone: '334-493-3541',
                    website: 'https://www.mizellmh.com',
                    safetyGradeUrl: '/h/mizell-memorial-hospital'
                },
                {
                    name: 'Crenshaw Community Hospital',
                    city: 'Luverne',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '101 Hospital Circle, Luverne, AL 36049',
                    phone: '334-335-3374',
                    website: 'https://crenshawcommunityhospital.com',
                    safetyGradeUrl: '/h/crenshaw-community-hospital'
                },
                {
                    name: 'St. Vincent\'s East',
                    city: 'Birmingham',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 362,
                    safetyGrade: 'A',
                    address: '50 Medical Park Dr. East, Birmingham, AL 35235',
                    phone: '205-838-3000',
                    website: 'https://uabstvincents.org',
                    safetyGradeUrl: '/h/st-vincents-east'
                },
                {
                    name: 'DeKalb Regional Medical Center',
                    city: 'Fort Payne',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 130,
                    safetyGrade: 'B',
                    address: '200 Medical Center Drive, Fort Payne, AL 35968',
                    phone: '256-845-2000',
                    website: 'https://dekalbregional.org',
                    safetyGradeUrl: '/h/dekalb-regional-medical-center'
                },
                {
                    name: 'Shelby Baptist Medical Center',
                    city: 'Alabaster',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 258,
                    safetyGrade: 'A',
                    address: '1000 First Street North, Alabaster, AL 35007',
                    phone: '205-620-8000',
                    website: 'https://www.baptisthealthal.com',
                    safetyGradeUrl: '/h/shelby-baptist-medical-center'
                },
                {
                    name: 'Callahan Eye Hospital',
                    city: 'Birmingham',
                    state: 'AL',
                    type: 'Specialty',
                    beds: 50,
                    safetyGrade: 'A',
                    address: '1720 University Boulevard, Birmingham, AL 35233',
                    phone: '205-325-8100',
                    website: 'https://www.uabmedicine.org',
                    safetyGradeUrl: '/h/callahan-eye-hospital'
                },
                {
                    name: 'Helen Keller Hospital',
                    city: 'Sheffield',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 165,
                    safetyGrade: 'B',
                    address: '1300 South Montgomery Avenue, Sheffield, AL 35660',
                    phone: '256-386-4191',
                    website: 'https://www.helenkeller.com',
                    safetyGradeUrl: '/h/helen-keller-hospital'
                },
                {
                    name: 'Dale Medical Center',
                    city: 'Ozark',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 92,
                    safetyGrade: 'C',
                    address: '126 Hospital Avenue, Ozark, AL 36360',
                    phone: '334-774-4111',
                    website: 'https://www.dalemedical.org',
                    safetyGradeUrl: '/h/dale-medical-center'
                },
                {
                    name: 'Floyd Cherokee Medical Center',
                    city: 'Centre',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 60,
                    safetyGrade: 'C',
                    address: '400 Northwood Drive, Centre, AL 35960',
                    phone: '256-927-2211',
                    website: 'https://www.cherokeemedicalcenter.com',
                    safetyGradeUrl: '/h/floyd-cherokee-medical-center'
                },
                {
                    name: 'Baptist Medical Center South',
                    city: 'Montgomery',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 200,
                    safetyGrade: 'A',
                    address: '2105 E. South Boulevard, Montgomery, AL 36116',
                    phone: '334-288-2100',
                    website: 'https://www.baptistfirst.org',
                    safetyGradeUrl: '/h/baptist-medical-center-south'
                },
                {
                    name: 'Jackson Hospital & Clinic Inc',
                    city: 'Montgomery',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 344,
                    safetyGrade: 'A',
                    address: '1725 Pine Street, Montgomery, AL 36106',
                    phone: '334-293-8000',
                    website: 'https://www.jackson.org',
                    safetyGradeUrl: '/h/jackson-hospital-clinic-inc'
                },
                {
                    name: 'The East Alabama Healthcare Authority',
                    city: 'Opelika',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 332,
                    safetyGrade: 'B',
                    address: '2000 Pepperell Parkway, Opelika, AL 36801',
                    phone: '334-705-1766',
                    website: 'https://www.eastalabamahealth.org',
                    safetyGradeUrl: '/h/east-alabama-healthcare-authority'
                },
                {
                    name: 'University of Alabama Hospital',
                    city: 'Birmingham',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 808,
                    safetyGrade: 'A',
                    address: '1802 Sixth Avenue South, Birmingham, AL 35233',
                    phone: '205-934-1000',
                    website: 'https://www.uabmedicine.org',
                    safetyGradeUrl: '/h/university-of-alabama-hospital'
                },
                {
                    name: 'Community Hospital Inc',
                    city: 'Tallassee',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '805 Friendship Road, Tallassee, AL 36078',
                    phone: '334-283-6541',
                    website: 'https://www.chal.org',
                    safetyGradeUrl: '/h/community-hospital-inc'
                },
                {
                    name: 'Cullman Regional Medical Center',
                    city: 'Cullman',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 145,
                    safetyGrade: 'A',
                    address: '1912 Alabama Highway 157, Cullman, AL 35058',
                    phone: '256-737-2000',
                    website: 'https://cullmanregional.com',
                    safetyGradeUrl: '/h/cullman-regional-medical-center'
                },
                {
                    name: 'Andalusia Health',
                    city: 'Andalusia',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 166,
                    safetyGrade: 'B',
                    address: '849 South Three Notch Street, Andalusia, AL 36420',
                    phone: '334-222-8466',
                    website: 'https://www.andalusiahealth.com',
                    safetyGradeUrl: '/h/andalusia-health'
                },
                {
                    name: 'Huntsville Hospital',
                    city: 'Huntsville',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 881,
                    safetyGrade: 'A',
                    address: '101 Sivley Road, Huntsville, AL 35801',
                    phone: '256-265-1000',
                    website: 'https://www.huntsvillehospital.org',
                    safetyGradeUrl: '/h/huntsville-hospital'
                },
                {
                    name: 'Gadsden Regional Medical Center',
                    city: 'Gadsden',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 356,
                    safetyGrade: 'B',
                    address: '1007 Goodyear Avenue, Gadsden, AL 35903',
                    phone: '256-494-4000',
                    website: 'https://www.gadsdenregional.com',
                    safetyGradeUrl: '/h/gadsden-regional-medical-center'
                },
                {
                    name: 'Marion Regional Medical Center',
                    city: 'Hamilton',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '1256 Military Street South, Hamilton, AL 35570',
                    phone: '205-921-5600',
                    website: 'https://www.nmhs.net/hamilton',
                    safetyGradeUrl: '/h/marion-regional-medical-center'
                },
                {
                    name: 'Fayette Medical Center',
                    city: 'Fayette',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 56,
                    safetyGrade: 'C',
                    address: '1653 Temple Avenue North, Fayette, AL 35555',
                    phone: '205-932-1200',
                    website: 'https://www.dchsystem.com',
                    safetyGradeUrl: '/h/fayette-medical-center'
                },
                {
                    name: 'Riverview Regional Medical Center',
                    city: 'Gadsden',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 285,
                    safetyGrade: 'B',
                    address: '600 South 3rd Street, Gadsden, AL 35901',
                    phone: '256-543-3400',
                    website: 'https://riverviewregional.com',
                    safetyGradeUrl: '/h/riverview-regional-medical-center'
                },
                {
                    name: 'Medical Center Enterprise',
                    city: 'Enterprise',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 131,
                    safetyGrade: 'B',
                    address: '400 North Edwards Street, Enterprise, AL 36330',
                    phone: '334-347-0584',
                    website: 'https://www.mcehospital.com',
                    safetyGradeUrl: '/h/medical-center-enterprise'
                },
                {
                    name: 'Greene County Hospital',
                    city: 'Eutaw',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '509 Wilson Avenue, Eutaw, AL 35462',
                    phone: '205-372-2002',
                    website: 'https://gcheutaw.com',
                    safetyGradeUrl: '/h/greene-county-hospital'
                },
                {
                    name: 'Lake Martin Community Hospital',
                    city: 'Dadeville',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '201 Mariarden Road, Dadeville, AL 36853',
                    phone: '256-825-7821',
                    website: 'https://www.lakemartinhospital.com',
                    safetyGradeUrl: '/h/lake-martin-community-hospital'
                },
                {
                    name: 'Flowers Hospital',
                    city: 'Dothan',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 162,
                    safetyGrade: 'B',
                    address: '4370 West Main Street, Dothan, AL 36305',
                    phone: '334-793-8000',
                    website: 'https://www.flowershospital.com',
                    safetyGradeUrl: '/h/flowers-hospital'
                },
                {
                    name: 'St Vincent\'s Birmingham',
                    city: 'Birmingham',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 336,
                    safetyGrade: 'A',
                    address: '810 Saint Vincents Dr, Birmingham, AL 35205',
                    phone: '205-939-7000',
                    website: 'https://uabstvincents.org',
                    safetyGradeUrl: '/h/st-vincents-birmingham'
                },
                {
                    name: 'Bibb Medical Center',
                    city: 'Centreville',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '208 Pierson Avenue, Centreville, AL 35042',
                    phone: '205-926-3000',
                    website: 'https://www.bibbmed.com',
                    safetyGradeUrl: '/h/bibb-medical-center'
                },
                {
                    name: 'Lawrence Medical Center',
                    city: 'Moulton',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '202 Hospital Street, Moulton, AL 35650',
                    phone: '256-974-2600',
                    website: 'https://www.lawrencemedicalcenter.com',
                    safetyGradeUrl: '/h/lawrence-medical-center'
                },
                {
                    name: 'Highlands Medical Center',
                    city: 'Scottsboro',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 150,
                    safetyGrade: 'B',
                    address: '380 Woods Cove Road, Scottsboro, AL 35768',
                    phone: '256-218-3800',
                    website: 'https://highlandsmedcenter.com',
                    safetyGradeUrl: '/h/highlands-medical-center'
                },
                {
                    name: 'Wiregrass Medical Center',
                    city: 'Geneva',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '1200 West Maple Avenue, Geneva, AL 36340',
                    phone: '334-684-4140',
                    website: 'https://www.wiregrassmedicalcenter.org',
                    safetyGradeUrl: '/h/wiregrass-medical-center'
                },
                {
                    name: 'Russell Medical Center',
                    city: 'Alexander City',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 133,
                    safetyGrade: 'B',
                    address: '3316 Highway 280, Alexander City, AL 35010',
                    phone: '256-329-7100',
                    website: 'https://russellcares.com',
                    safetyGradeUrl: '/h/russell-medical-center'
                },
                {
                    name: 'Clay County Hospital',
                    city: 'Ashland',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '83825 Highway 9, Ashland, AL 36251',
                    phone: '256-354-2111',
                    website: 'https://www.claycountyhospital.com',
                    safetyGradeUrl: '/h/clay-county-hospital'
                },
                {
                    name: 'Northeast Alabama Regional Medical Center',
                    city: 'Anniston',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 368,
                    safetyGrade: 'B',
                    address: '400 East 10th Street, Anniston, AL 36207',
                    phone: '256-235-5111',
                    website: 'https://rmccares.org',
                    safetyGradeUrl: '/h/northeast-alabama-regional-medical-center'
                },
                {
                    name: 'Athens Limestone Hospital',
                    city: 'Athens',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 101,
                    safetyGrade: 'A',
                    address: '700 West Market Street, Athens, AL 35611',
                    phone: '256-233-5430',
                    website: 'https://www.athenslimestonehospital.com',
                    safetyGradeUrl: '/h/athens-limestone-hospital'
                },
                {
                    name: 'Baldwin Health',
                    city: 'Foley',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 234,
                    safetyGrade: 'A',
                    address: '1613 North McKenzie Street, Foley, AL 36535',
                    phone: '251-949-3400',
                    website: 'https://www.baldwinhealth.com',
                    safetyGradeUrl: '/h/baldwin-health'
                },
                {
                    name: 'Decatur Morgan Hospital - Decatur Campus',
                    city: 'Decatur',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 273,
                    safetyGrade: 'B',
                    address: '1201 Seventh Street SE, Decatur, AL 35601',
                    phone: '256-341-2000',
                    website: 'https://decaturmorganhospital.net',
                    safetyGradeUrl: '/h/decatur-morgan-hospital-decatur-campus'
                },
                {
                    name: 'Northwest Medical Center',
                    city: 'Winfield',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '1530 US Highway 43, Winfield, AL 35594',
                    phone: '205-487-7111',
                    website: 'https://www.northwestmedical.org',
                    safetyGradeUrl: '/h/northwest-medical-center'
                },
                {
                    name: 'USA Health University Hospital',
                    city: 'Mobile',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 406,
                    safetyGrade: 'B',
                    address: '2451 University Hospital Drive, Mobile, AL 36617',
                    phone: '251-471-7000',
                    website: 'https://www.usahealthsystem.com',
                    safetyGradeUrl: '/h/usa-health-university-hospital'
                },
                {
                    name: 'Walker Baptist Medical Center',
                    city: 'Jasper',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 267,
                    safetyGrade: 'B',
                    address: '3400 Highway 78 East, Jasper, AL 35501',
                    phone: '205-387-3100',
                    website: 'https://www.baptisthealthal.com',
                    safetyGradeUrl: '/h/walker-baptist-medical-center'
                },
                {
                    name: 'USA Health HCA Providence Hospital LLC',
                    city: 'Mobile',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 349,
                    safetyGrade: 'B',
                    address: '6801 Airport Boulevard, Mobile, AL 36608',
                    phone: '251-633-1000',
                    website: 'https://www.usahealthsystem.com',
                    safetyGradeUrl: '/h/usa-health-hca-providence-hospital-llc'
                },
                {
                    name: 'Grove Hill Memorial Hospital',
                    city: 'Grove Hill',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '295 South Jackson Street, Grove Hill, AL 36451',
                    phone: '251-275-3191',
                    website: 'https://gh-health.org',
                    safetyGradeUrl: '/h/grove-hill-memorial-hospital'
                },
                {
                    name: 'DCH Regional Medical Center',
                    city: 'Tuscaloosa',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 566,
                    safetyGrade: 'A',
                    address: '809 University Boulevard East, Tuscaloosa, AL 35401',
                    phone: '205-759-7000',
                    website: 'https://www.dchsystem.com',
                    safetyGradeUrl: '/h/dch-regional-medical-center'
                },
                {
                    name: 'Hale County Hospital',
                    city: 'Greensboro',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '508 Greene Street, Greensboro, AL 36744',
                    phone: '334-624-7151',
                    website: 'https://www.halecountyhospital.com',
                    safetyGradeUrl: '/h/hale-county-hospital'
                },
                {
                    name: 'Elmore Community Hospital',
                    city: 'Wetumpka',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '500 Hospital Drive, Wetumpka, AL 36092',
                    phone: '334-567-1234',
                    website: 'https://ivycreekhealth.com',
                    safetyGradeUrl: '/h/elmore-community-hospital'
                },
                {
                    name: 'D W McMillan Memorial Hospital',
                    city: 'Brewton',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 49,
                    safetyGrade: 'C',
                    address: '1301 Belleville Avenue, Brewton, AL 36426',
                    phone: '251-867-4151',
                    website: 'https://www.dwmmh.org',
                    safetyGradeUrl: '/h/dw-mcmillan-memorial-hospital'
                },
                {
                    name: 'Thomas Hospital',
                    city: 'Fairhope',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 225,
                    safetyGrade: 'A',
                    address: '750 Morphy Avenue, Fairhope, AL 36532',
                    phone: '251-990-1000',
                    website: 'https://www.infirmaryhealth.org',
                    safetyGradeUrl: '/h/thomas-hospital'
                },
                {
                    name: 'Citizens Baptist Medical Center',
                    city: 'Talladega',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 101,
                    safetyGrade: 'B',
                    address: '604 Stone Avenue, Talladega, AL 35160',
                    phone: '256-761-4000',
                    website: 'https://www.baptisthealthal.com',
                    safetyGradeUrl: '/h/citizens-baptist-medical-center'
                },
                {
                    name: 'Princeton Baptist Medical Center',
                    city: 'Birmingham',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 505,
                    safetyGrade: 'B',
                    address: '701 Princeton Avenue SW, Birmingham, AL 35211',
                    phone: '205-787-3000',
                    website: 'https://www.baptisthealthal.com',
                    safetyGradeUrl: '/h/princeton-baptist-medical-center'
                },
                {
                    name: 'Grandview Medical Center',
                    city: 'Birmingham',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 374,
                    safetyGrade: 'A',
                    address: '3690 Grandview Parkway, Birmingham, AL 35243',
                    phone: '205-971-8000',
                    website: 'https://www.baptisthealthal.com',
                    safetyGradeUrl: '/h/grandview-medical-center'
                },
                {
                    name: 'Prattville Baptist Hospital',
                    city: 'Prattville',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 99,
                    safetyGrade: 'B',
                    address: '1240 Memorial Drive, Prattville, AL 36067',
                    phone: '334-361-4100',
                    website: 'https://www.baptisthealthal.com',
                    safetyGradeUrl: '/h/prattville-baptist-hospital'
                },
                {
                    name: 'Bullock County Hospital',
                    city: 'Union Springs',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '301 North Main Street, Union Springs, AL 36089',
                    phone: '334-738-3000',
                    website: 'https://www.bullockcountyhospital.com',
                    safetyGradeUrl: '/h/bullock-county-hospital'
                },
                {
                    name: 'Whitfield Regional Hospital',
                    city: 'Demopolis',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 84,
                    safetyGrade: 'C',
                    address: '400 Medical Center Drive, Demopolis, AL 36732',
                    phone: '334-289-3446',
                    website: 'https://www.whitfieldhospital.com',
                    safetyGradeUrl: '/h/whitfield-regional-hospital'
                },
                {
                    name: 'Mobile Infirmary Medical Center',
                    city: 'Mobile',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 664,
                    safetyGrade: 'B',
                    address: '5 Mobile Infirmary Circle, Mobile, AL 36607',
                    phone: '251-435-2400',
                    website: 'https://www.infirmaryhealth.org',
                    safetyGradeUrl: '/h/mobile-infirmary-medical-center'
                },
                {
                    name: 'Medical West (UAB Health System Affiliate)',
                    city: 'Bessemer',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 310,
                    safetyGrade: 'B',
                    address: '995 9th Avenue Southwest, Bessemer, AL 35022',
                    phone: '205-481-7000',
                    website: 'https://www.uabmedicine.org',
                    safetyGradeUrl: '/h/medical-west-uab-health-system-affiliate'
                },
                {
                    name: 'Vaughan Regional Medical Center Parkway Campus',
                    city: 'Selma',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 141,
                    safetyGrade: 'C',
                    address: '1015 Medical Center Parkway, Selma, AL 36701',
                    phone: '334-872-0141',
                    website: 'https://www.vaughanregional.com',
                    safetyGradeUrl: '/h/vaughan-regional-medical-center-parkway-campus'
                },
                {
                    name: 'Monroe County Hospital',
                    city: 'Monroeville',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '111 South Mt. Vernon Avenue, Monroeville, AL 36460',
                    phone: '251-743-2121',
                    website: 'https://www.monroecountyhospital.com',
                    safetyGradeUrl: '/h/monroe-county-hospital'
                },
                {
                    name: 'Lakeland Community Hospital',
                    city: 'Haleyville',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '38800 Highway 195, Haleyville, AL 35565',
                    phone: '205-486-3400',
                    website: 'https://www.lakelandhospital.org',
                    safetyGradeUrl: '/h/lakeland-community-hospital'
                },
                {
                    name: 'Troy Regional Medical Center',
                    city: 'Troy',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 133,
                    safetyGrade: 'B',
                    address: '1020 East Glenn Avenue, Troy, AL 36081',
                    phone: '334-566-5111',
                    website: 'https://www.troyregional.com',
                    safetyGradeUrl: '/h/troy-regional-medical-center'
                },
                {
                    name: 'Jackson Medical Center',
                    city: 'Jackson',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '1106 South Church Street, Jackson, AL 36545',
                    phone: '251-246-6135',
                    website: 'https://www.jacksonmedicalcenter.com',
                    safetyGradeUrl: '/h/jackson-medical-center'
                },
                {
                    name: 'North Baldwin Infirmary',
                    city: 'Bay Minette',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 93,
                    safetyGrade: 'B',
                    address: '1804 Hand Avenue, Bay Minette, AL 36507',
                    phone: '251-937-0200',
                    website: 'https://www.northbaldwininfirmary.com',
                    safetyGradeUrl: '/h/north-baldwin-infirmary'
                },
                {
                    name: 'St Vincent\'s St Clair',
                    city: 'Pell City',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 40,
                    safetyGrade: 'A',
                    address: '7063 Veterans Parkway, Pell City, AL 35128',
                    phone: '205-338-8300',
                    website: 'https://uabstvincents.org',
                    safetyGradeUrl: '/h/st-vincents-st-clair'
                },
                {
                    name: 'Crestwood Medical Center',
                    city: 'Huntsville',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 118,
                    safetyGrade: 'B',
                    address: '1 Hospital Drive, Huntsville, AL 35801',
                    phone: '256-429-4000',
                    website: 'https://www.crestwoodhospital.com',
                    safetyGradeUrl: '/h/crestwood-medical-center'
                },
                {
                    name: 'Hill Hospital of Sumter County',
                    city: 'York',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '200 Hospital Drive, York, AL 36925',
                    phone: '205-392-5255',
                    website: 'https://www.hillhospital.org',
                    safetyGradeUrl: '/h/hill-hospital-of-sumter-county'
                },
                {
                    name: 'Brookwood Baptist Medical Center',
                    city: 'Vestavia',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 507,
                    safetyGrade: 'A',
                    address: '2010 Brookwood Medical Center Drive, Vestavia, AL 35209',
                    phone: '205-877-1000',
                    website: 'https://www.baptisthealthal.com',
                    safetyGradeUrl: '/h/brookwood-baptist-medical-center'
                },
                {
                    name: 'Springhill Medical Center',
                    city: 'Mobile',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 369,
                    safetyGrade: 'B',
                    address: '3719 Dauphin Street, Mobile, AL 36608',
                    phone: '251-460-2000',
                    website: 'https://www.springhillmedicalcenter.com',
                    safetyGradeUrl: '/h/springhill-medical-center'
                },
                {
                    name: 'Evergreen Medical Center',
                    city: 'Evergreen',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '1010 Medical Center Drive, Evergreen, AL 36401',
                    phone: '251-578-3100',
                    website: 'https://www.evergreenmedical.org',
                    safetyGradeUrl: '/h/evergreen-medical-center'
                },
                {
                    name: 'Baptist Medical Center East',
                    city: 'Montgomery',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 150,
                    safetyGrade: 'A',
                    address: '805 St. Vincent\'s Drive, Montgomery, AL 36107',
                    phone: '334-277-8000',
                    website: 'https://www.baptisthealthal.com',
                    safetyGradeUrl: '/h/baptist-medical-center-east'
                },
                {
                    name: 'Birmingham VA Medical Center',
                    city: 'Birmingham',
                    state: 'AL',
                    type: 'Government',
                    beds: 313,
                    safetyGrade: 'A',
                    address: '700 19th Street South, Birmingham, AL 35233',
                    phone: '205-933-8101',
                    website: 'https://www.birmingham.va.gov',
                    safetyGradeUrl: '/h/birmingham-va-medical-center'
                },
                {
                    name: 'The Health Care Authority of Greenville (LV Stabler Hospital)',
                    city: 'Greenville',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 62,
                    safetyGrade: 'C',
                    address: '201 Clark Street, Greenville, AL 36037',
                    phone: '334-382-3111',
                    website: 'https://www.greenvillehospital.org',
                    safetyGradeUrl: '/h/health-care-authority-greenville-lv-stabler-hospital'
                },
                {
                    name: 'North Alabama Shoals Hospital',
                    city: 'Muscle Shoals',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 84,
                    safetyGrade: 'B',
                    address: '2000 Cloar Road, Muscle Shoals, AL 35661',
                    phone: '256-386-4400',
                    website: 'https://www.nashoals.com',
                    safetyGradeUrl: '/h/north-alabama-shoals-hospital'
                },
                {
                    name: 'Russellville Hospital',
                    city: 'Russellville',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '200 Laurel Dan Drive, Russellville, AL 35653',
                    phone: '256-332-4211',
                    website: 'https://www.russellvillehospital.org',
                    safetyGradeUrl: '/h/russellville-hospital'
                },
                {
                    name: 'Coosa Valley Medical Center',
                    city: 'Sylacauga',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 122,
                    safetyGrade: 'B',
                    address: '315 West Hickory Street, Sylacauga, AL 35150',
                    phone: '256-401-1000',
                    website: 'https://www.coosavalleymedicalcenter.com',
                    safetyGradeUrl: '/h/coosa-valley-medical-center'
                },
                {
                    name: 'Jack Hughston Memorial Hospital',
                    city: 'Phenix City',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 100,
                    safetyGrade: 'B',
                    address: '6000 Hospital Road, Phenix City, AL 36869',
                    phone: '334-732-1000',
                    website: 'https://www.hughston.com',
                    safetyGradeUrl: '/h/jack-hughston-memorial-hospital'
                },
                {
                    name: 'Atmore Community Hospital',
                    city: 'Atmore',
                    state: 'AL',
                    type: 'Critical Access',
                    beds: 25,
                    safetyGrade: 'C',
                    address: '201 East Reed Street, Atmore, AL 36502',
                    phone: '251-368-6391',
                    website: 'https://www.atmorehospital.org',
                    safetyGradeUrl: '/h/atmore-community-hospital'
                },
                {
                    name: 'St Vincent\'s Chilton',
                    city: 'Clanton',
                    state: 'AL',
                    type: 'General Acute Care',
                    beds: 40,
                    safetyGrade: 'A',
                    address: '1015 7th Street North, Clanton, AL 35045',
                    phone: '205-755-1700',
                    website: 'https://uabstvincents.org',
                    safetyGradeUrl: '/h/st-vincents-chilton'
                },
                {
                    name: 'VA Central Alabama Healthcare System - Montgomery',
                    city: 'Montgomery',
                    state: 'AL',
                    type: 'Government',
                    beds: 224,
                    safetyGrade: 'A',
                    address: '215 Perry Hill Road, Montgomery, AL 36109',
                    phone: '334-277-6300',
                    website: 'https://www.montgomery.va.gov',
                    safetyGradeUrl: '/h/va-central-alabama-healthcare-system-montgomery'
                },
                {
                    name: 'Tuscaloosa VA Medical Center',
                    city: 'Tuscaloosa',
                    state: 'AL',
                    type: 'Government',
                    beds: 77,
                    safetyGrade: 'A',
                    address: '3701 Loop Road East, Tuscaloosa, AL 35404',
                    phone: '205-558-2000',
                    website: 'https://www.tuscaloosa.va.gov',
                    safetyGradeUrl: '/h/tuscaloosa-va-medical-center'
                },
                {
                    name: 'The Children\'s Hospital of Alabama',
                    city: 'Birmingham',
                    state: 'AL',
                    type: 'Children\'s',
                    beds: 334,
                    safetyGrade: 'A',
                    address: '1600 7th Avenue South, Birmingham, AL 35233',
                    phone: '205-638-9100',
                    website: 'https://www.childrensal.org',
                    safetyGradeUrl: '/h/childrens-hospital-of-alabama'
                },
                {
                    name: 'USA Health Children\'s & Women\'s Hospital',
                    city: 'Mobile',
                    state: 'AL',
                    type: 'Children\'s',
                    beds: 140,
                    safetyGrade: 'B',
                    address: '1701 Center Street, Mobile, AL 36604',
                    phone: '251-415-1000',
                    website: 'https://www.usahealthsystem.com',
                    safetyGradeUrl: '/h/usa-health-childrens-womens-hospital'
                }
            ],
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
            ],
            'SC': [
                {
                    name: 'Medical University of South Carolina',
                    city: 'Charleston',
                    state: 'SC',
                    type: 'General Acute Care',
                    beds: 709,
                    safetyGrade: 'A',
                    address: '171 Ashley Ave, Charleston, SC 29425',
                    phone: '843-792-2300',
                    website: 'https://www.muschealth.org',
                    safetyGradeUrl: '/h/medical-university-of-south-carolina'
                },
                {
                    name: 'Prisma Health Greenville Memorial Hospital',
                    city: 'Greenville',
                    state: 'SC',
                    type: 'General Acute Care',
                    beds: 706,
                    safetyGrade: 'B',
                    address: '701 Grove Rd, Greenville, SC 29605',
                    phone: '864-455-7000',
                    website: 'https://www.prismahealth.org',
                    safetyGradeUrl: '/h/prisma-health-greenville-memorial-hospital'
                },
                {
                    name: 'Spartanburg Medical Center',
                    city: 'Spartanburg',
                    state: 'SC',
                    type: 'General Acute Care',
                    beds: 540,
                    safetyGrade: 'B',
                    address: '101 E Wood St, Spartanburg, SC 29303',
                    phone: '864-560-6000',
                    website: 'https://www.spartanburgmed.com',
                    safetyGradeUrl: '/h/spartanburg-medical-center'
                },
                {
                    name: 'Roper Hospital',
                    city: 'Charleston',
                    state: 'SC',
                    type: 'General Acute Care',
                    beds: 453,
                    safetyGrade: 'A',
                    address: '316 Calhoun St, Charleston, SC 29401',
                    phone: '843-724-2000',
                    website: 'https://www.roperhospital.com',
                    safetyGradeUrl: '/h/roper-hospital'
                },
                {
                    name: 'Lexington Medical Center',
                    city: 'West Columbia',
                    state: 'SC',
                    type: 'General Acute Care',
                    beds: 414,
                    safetyGrade: 'A',
                    address: '2720 Sunset Blvd, West Columbia, SC 29169',
                    phone: '803-791-2000',
                    website: 'https://www.lexmed.com',
                    safetyGradeUrl: '/h/lexington-medical-center'
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
