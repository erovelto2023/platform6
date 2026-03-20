import connectToDatabase from "../db/connect";
import Location from '../db/models/Location';
import { revalidatePath } from 'next/cache';
import { californiaHospitals } from '../data/california-hospitals';
import { coloradoHospitals } from '../data/colorado-hospitals';
import { connecticutHospitals } from '../data/connecticut-hospitals';
import { delawareHospitals } from '../data/delaware-hospitals';
import { floridaHospitals } from '../data/florida-hospitals';
import { georgiaHospitals } from '../data/georgia-hospitals';
import { hawaiiHospitals } from '../data/hawaii-hospitals';
import { idahoHospitals } from '../data/idaho-hospitals';
import { indianaHospitals } from '../data/indiana-hospitals';
import { iowaHospitals } from '../data/iowa-hospitals';
import { kansasHospitals } from '../data/kansas-hospitals';
import { kentuckyHospitals } from '../data/kentucky-hospitals';
import { louisianaHospitals } from '../data/louisiana-hospitals';
import { maineHospitals } from '../data/maine-hospitals';
import { marylandHospitals } from '../data/maryland-hospitals';
import { massachusettsHospitals } from '../data/massachusetts-hospitals';
import { michiganHospitals } from '../data/michigan-hospitals';
import { minnesotaHospitals } from '../data/minnesota-hospitals';
import { mississippiHospitals } from '../data/mississippi-hospitals';
import { illinoisHospitals } from '../data/illinois-hospitals';
import { montanaHospitals } from '../data/montana-hospitals';
import { nebraskaHospitals } from '../data/nebraska-hospitals';
import { missouriHospitals } from '../data/missouri-hospitals';
import { nevadaHospitals } from '../data/nevada-hospitals';
import { newHampshireHospitals } from '../data/new-hampshire-hospitals';
import { newJerseyHospitals } from '../data/new-jersey-hospitals';
import { newMexicoHospitals } from '../data/new-mexico-hospitals';
import { newYorkHospitals } from '../data/new-york-hospitals';
import { northCarolinaHospitals } from '../data/north-carolina-hospitals';
import { northDakotaHospitals } from '../data/north-dakota-hospitals';
import { ohioHospitals } from '../data/ohio-hospitals';
import { oklahomaHospitals } from '../data/oklahoma-hospitals';
import { oregonHospitals } from '../data/oregon-hospitals';
import { pennsylvaniaHospitals } from '../data/pennsylvania-hospitals';
import { rhodeIslandHospitals } from '../data/rhode-island-hospitals';
import { southCarolinaHospitals } from '../data/south-carolina-hospitals';
import { southDakotaHospitals } from '../data/south-dakota-hospitals';
import { tennesseeHospitals } from '../data/tennessee-hospitals';
import { texasHospitals } from '../data/texas-hospitals';
import { utahHospitals } from '../data/utah-hospitals';
import { vermontHospitals } from '../data/vermont-hospitals';
import { virginiaHospitals } from '../data/virginia-hospitals';
import { washingtonHospitals } from '../data/washington-hospitals';
import { westVirginiaHospitals } from '../data/west-virginia-hospitals';
import { wisconsinHospitals } from '../data/wisconsin-hospitals';
import { wyomingHospitals } from '../data/wyoming-hospitals';

/**
 * Import Arkansas hospital data from CSV directly to database
 */
export async function importArkansasHospitals() {
    try {
        await connectToDatabase();
        
        // Arkansas hospital data converted from CSV
        const arkansasHospitals = [
            { name: "Siloam Springs Regional Hospital", address: "603 North Progress Avenue, Siloam Springs, AR 72761", website: "https://www.northwesthealth.com/siloam-springs-regional-hospital", city: "Siloam Springs", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Johnson Regional Medical Center", address: "1100 East Poplar Street, Clarksville, AR 72830", website: "https://www.jrmc.com", city: "Clarksville", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Washington Regional Medical Center", address: "3215 N. Northhills Boulevard, Fayetteville, AR 72703", website: "https://www.wregional.com", city: "Fayetteville", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "CHI-St Vincent Infirmary", address: "2 Saint Vincent Circle, Little Rock, AR 72205", website: "https://www.chistvincent.com", city: "Little Rock", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Mercy Hospital Northwest Arkansas", address: "2710 South Rife Medical Lane, Rogers, AR 72758", website: "https://www.mercy.net/practice/mercy-hospital-northwest-arkansas", city: "Rogers", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Chambers Memorial Hospital", address: "1701 West Main Street, Danville, AR 72833", website: "https://www.chambersmemorial.org", city: "Danville", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "White County Medical Center", address: "3214 East Race Avenue, Searcy, AR 72143", website: "https://www.unityhealth.org/white-county", city: "Searcy", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "University of Arkansas for Medical Sciences (UAMS) Medical Center", address: "4301 West Markham Street, Little Rock, AR 72205", website: "https://uamshealth.com", city: "Little Rock", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "North Arkansas Regional Medical Center", address: "620 North Main Street, Harrison, AR 72601", website: "https://www.narmc.com", city: "Harrison", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Baptist Health - Van Buren", address: "211 Crawford Memorial Drive, Van Buren, AR 72956", website: "https://www.baptist-health.org/medical-centers/van-buren", city: "Van Buren", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Forrest City Medical Center", address: "1601 Teague Drive, Forrest City, AR 72335", website: "https://www.forrestcitymedical.com", city: "Forrest City", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "St Bernards Medical Center", address: "225 East Washington Avenue, Jonesboro, AR 72401", website: "https://www.stbernards.info", city: "Jonesboro", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Northwest Medical Center-Springdale", address: "609 West Maple Avenue, Springdale, AR 72764", website: "https://www.northwesthealth.com", city: "Springdale", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "CHI St. Vincent Hospital Hot Springs", address: "2015 Albert Pike Road, Hot Springs, AR 71901", website: "https://www.chistvincent.com/locations/hot-springs", city: "Hot Springs", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Baxter Health", address: "624 Hospital Drive, Mountain Home, AR 72653", website: "https://www.baxterhealth.org", city: "Mountain Home", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Conway Regional Medical Center Inc", address: "2302 Prince Street, Conway, AR 72034", website: "https://www.conwayregional.org", city: "Conway", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Baptist Health Medical Center North Little Rock", address: "3333 Springhill Drive, North Little Rock, AR 72117", website: "https://www.baptist-health.org/medical-centers/north-little-rock", city: "North Little Rock", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Arkansas Methodist Medical Center", address: "1100 East Matthews Avenue, Paragould, AR 72450", website: "https://www.armedcenter.org", city: "Paragould", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "St Marys Regional Medical Center", address: "1808 West Main Street, Russellville, AR 72801", website: "https://www.stmarysrussellville.org", city: "Russellville", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Ouachita County Medical Center", address: "644 California Avenue SW, Camden, AR 71701", website: "https://www.ocmcar.com", city: "Camden", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Baptist Health Medical Center-Drew County", address: "721 West 2nd Street, Monticello, AR 71655", website: "https://www.baptist-health.org/medical-centers/monticello", city: "Monticello", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Baptist Health - Fort Smith", address: "7301 Rogers Avenue, Fort Smith, AR 72903", website: "https://www.baptist-health.org/medical-centers/fort-smith", city: "Fort Smith", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Mercy Hospital Fort Smith", address: "7301 Rogers Avenue, Fort Smith, AR 72903", website: "https://www.mercy.net/practice/mercy-hospital-fort-smith", city: "Fort Smith", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Magnolia Regional Medical Hospital", address: "100 East Oak Street, Magnolia, AR 71753", website: "https://www.magnolia-regional.com", city: "Magnolia", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Great River Medical Center", address: "1415 East Main Street, Blytheville, AR 72315", website: "https://www.greatrivermedical.com", city: "Blytheville", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Jefferson Regional Medical Center", address: "1600 West 40th Avenue, Pine Bluff, AR 71603", website: "https://www.jeffregional.com", city: "Pine Bluff", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Baptist Health Medical Center-Stuttgart", address: "1615 South Oakes Street, Stuttgart, AR 72160", website: "https://www.baptist-health.org/medical-centers/stuttgart", city: "Stuttgart", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Baptist Health Medical Center-Hot Springs County", address: "301 Prospect Avenue, Malvern, AR 72104", website: "https://www.baptist-health.org/medical-centers/malvern", city: "Malvern", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "National Park Medical Center", address: "1910 Malvern Avenue, Hot Springs, AR 71901", website: "https://www.nationalparkmedical.com", city: "Hot Springs", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Saline Memorial Hospital", address: "1 Medical Park Drive, Benton, AR 72015", website: "https://www.salinehealthcare.org", city: "Benton", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "South Arkansas Regional Hospital LLC", address: "700 West Grove Street, El Dorado, AR 71730", website: "https://www.sarhcare.org", city: "El Dorado", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Fayetteville AR VA Medical Center", address: "1100 North College Avenue, Fayetteville, AR 72703", website: "https://www.fayetteville.va.gov", city: "Fayetteville", state: "AR", type: "Acute Care - Veterans Administration", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "VA Central Arkansas Veterans Healthcare System LR", address: "4300 West 7th Street, Little Rock, AR 72205", website: "https://www.littlerock.va.gov", city: "Little Rock", state: "AR", type: "Acute Care - Veterans Administration", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Baptist Health Medical Center-Little Rock", address: "9601 Interstate 630, Little Rock, AR 72205", website: "https://www.baptist-health.org/medical-centers/little-rock", city: "Little Rock", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Baptist Memorial Hospital Jonesboro Inc.", address: "1100 East Matthews Avenue, Jonesboro, AR 72401", website: "https://www.baptistmemorial.com/jonesboro", city: "Jonesboro", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "White River Medical Center", address: "1710 Harrison Street, Batesville, AR 72501", website: "https://www.whiterivermedical.com", city: "Batesville", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Levi Hospital", address: "1301 Malvern Avenue, Hot Springs, AR 71901", website: "https://www.levihospital.org", city: "Hot Springs", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Arkansas Heart Hospital LLC", address: "1701 Shackleford Road, Little Rock, AR 72211", website: "https://www.arkansasheart.com", city: "Little Rock", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "St Vincent Medical Center/North", address: "2215 Wildwood Avenue, Sherwood, AR 72120", website: "https://www.chistvincent.com/locations/sherwood", city: "Sherwood", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Arkansas Surgical Hospital", address: "5200 Northshore Drive, North Little Rock, AR 72118", website: "https://www.arkansassurgical.com", city: "North Little Rock", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Southwest Arkansas Regional Medical Center LLC", address: "2400 East 3rd Street, Hope, AR 71801", website: "https://www.swarhc.org", city: "Hope", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Baptist Health Medical Center-Conway", address: "2302 Prince Street, Conway, AR 72034", website: "https://www.baptist-health.org/medical-centers/conway", city: "Conway", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Baptist Memorial Hospital-Crittenden Inc", address: "2011 South Division Street, West Memphis, AR 72301", website: "https://www.baptistmemorial.com/crittenden", city: "West Memphis", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Arkansas Heart Hospital-Encore", address: "17231 Interstate 30, Bryant, AR 72022", website: "https://www.arkansasheart.com/locations/encore", city: "Bryant", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Unity Health - Jacksonville", address: "1405 East Harding Street, Jacksonville, AR 72076", website: "https://www.unityhealth.org/jacksonville", city: "Jacksonville", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "St Bernards Five Rivers Medical Center", address: "1100 Twin Rivers Drive, Pocahontas, AR 72455", website: "https://www.stbernards.info/locations/five-rivers", city: "Pocahontas", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Eureka Springs Hospital Commission", address: "200 Spring Street, Eureka Springs, AR 72632", website: "https://www.eurekaspringshospital.org", city: "Eureka Springs", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Helena Regional Medical Center", address: "620 North Custer Street, Helena, AR 72342", website: "https://www.helenaregional.com", city: "Helena", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "South Mississippi County Regional Medical Center", address: "1000 West Lee Avenue, Osceola, AR 72370", website: "https://www.smcmed.org", city: "Osceola", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "DeWitt Hospital & Nursing Home Inc", address: "201 South View Drive, DeWitt, AR 72042", website: "https://www.dewitthospital.org", city: "DeWitt", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Mercy Hospital Paris", address: "1401 East Walnut Street, Paris, AR 72855", website: "https://www.mercy.net/practice/mercy-hospital-paris", city: "Paris", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Dardanelle Regional Medical Center", address: "1808 West Main Street, Dardanelle, AR 72834", website: "https://www.drmc.org", city: "Dardanelle", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Mercy Hospital Ozark", address: "311 North 18th Street, Ozark, AR 72949", website: "https://www.mercy.net/practice/mercy-hospital-ozark", city: "Ozark", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Mercy Hospital Waldron", address: "1100 East Main Street, Waldron, AR 72958", website: "https://www.mercy.net/practice/mercy-hospital-waldron", city: "Waldron", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Izard Regional Hospital LLC", address: "1000 Hospital Drive, Calico Rock, AR 72519", website: "https://www.izardregional.org", city: "Calico Rock", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "CrossRidge Community Hospital", address: "2000 CrossRidge Drive, Wynne, AR 72396", website: "https://www.crossridgehospital.com", city: "Wynne", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "McGehee Hospital", address: "1401 South Main Street, McGehee, AR 71654", website: "https://www.mcgeheehospital.org", city: "McGehee", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Lawrence Memorial Hospital", address: "1401 South Main Street, Walnut Ridge, AR 72476", website: "https://www.lmhn.org", city: "Walnut Ridge", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Stone County Medical Center", address: "201 Hospital Drive, Mountain View, AR 72560", website: "https://www.stonecountymedical.org", city: "Mountain View", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Howard Memorial Hospital", address: "313 South Main Street, Nashville, AR 71852", website: "https://www.howardmemorial.org", city: "Nashville", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Baptist Health Medical Center Heber Springs", address: "1000 Highland Drive, Heber Springs, AR 72543", website: "https://www.baptist-health.org/medical-centers/heber-springs", city: "Heber Springs", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Ozark Health", address: "1000 Hospital Drive, Clinton, AR 72031", website: "https://www.ozarkhealth.org", city: "Clinton", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Dallas County Medical Center", address: "301 West Oak Street, Fordyce, AR 71742", website: "https://www.dcmc.org", city: "Fordyce", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Mercy Hospital Booneville", address: "1100 East Main Street, Booneville, AR 72927", website: "https://www.mercy.net/practice/mercy-hospital-booneville", city: "Booneville", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Little River Memorial Hospital", address: "1601 South Constitution Avenue, Ashdown, AR 71822", website: "https://www.lrmh.org", city: "Ashdown", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Baptist Health Medical Center-Arkadelphia", address: "301 Twin Rivers Drive, Arkadelphia, AR 71923", website: "https://www.baptist-health.org/medical-centers/arkadelphia", city: "Arkadelphia", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Baxter Health Fulton County Hospital", address: "1000 Hospital Drive, Salem, AR 72576", website: "https://www.baxterhealth.org/fulton-county", city: "Salem", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Ashley County Medical Center", address: "1000 Hospital Drive, Crossett, AR 71635", website: "https://www.acmcar.org", city: "Crossett", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "CHI St Vincent Morrilton", address: "1802 West Harding Street, Morrilton, AR 72110", website: "https://www.chistvincent.com/locations/morrilton", city: "Morrilton", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Delta Memorial Hospital", address: "1000 Hospital Drive, Dumas, AR 71639", website: "https://www.deltamemorial.org", city: "Dumas", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Bradley County Medical Center", address: "1000 Hospital Drive, Warren, AR 71671", website: "https://www.bradleycountymedical.org", city: "Warren", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Chicot Memorial Medical Center", address: "1000 Hospital Drive, Lake Village, AR 71653", website: "https://www.chicotmemorial.org", city: "Lake Village", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Mercy Hospital Berryville", address: "1000 Hospital Drive, Berryville, AR 72616", website: "https://www.mercy.net/practice/mercy-hospital-berryville", city: "Berryville", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Piggott Community Hospital", address: "1000 Hospital Drive, Piggott, AR 72454", website: "https://www.piggotthospital.org", city: "Piggott", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Ozarks Community Hospital of Gravette", address: "1000 Hospital Drive, Gravette, AR 72736", website: "https://www.ozarkscommunityhospital.com", city: "Gravette", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Unity Health - Newport", address: "1000 Hospital Drive, Newport, AR 72112", website: "https://www.unityhealth.org/newport", city: "Newport", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Sevier County Medical Center", address: "1000 Hospital Drive, De Queen, AR 71832", website: "https://www.seviermedical.org", city: "De Queen", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Mena Regional Health System", address: "1000 Hospital Drive, Mena, AR 71953", website: "https://www.menaregional.org", city: "Mena", state: "AR", type: "Acute Care Hospitals", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Arkansas Children's Hospital", address: "1 Children's Way, Little Rock, AR 72202", website: "https://www.archildrens.org", city: "Little Rock", state: "AR", type: "Childrens", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Arkansas Children's Northwest Inc", address: "2601 Gene George Boulevard, Springdale, AR 72762", website: "https://www.archildrens.org/northwest", city: "Springdale", state: "AR", type: "Childrens", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Vista Health Fayetteville", address: "3500 North College Avenue, Fayetteville, AR 72703", website: "https://www.vistahealthfayetteville.com", city: "Fayetteville", state: "AR", type: "Psychiatric", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Bridgeway Hospital", address: "401 Bridgeway Road, North Little Rock, AR 72117", website: "https://www.thebridgeway.com", city: "North Little Rock", state: "AR", type: "Psychiatric", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Valley Behavioral Health System", address: "6601 Rogers Avenue, Barling, AR 72923", website: "https://www.valleybehavioral.com", city: "Barling", state: "AR", type: "Psychiatric", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Rivendell Behavioral Health Services", address: "1000 Rivendell Drive, Benton, AR 72015", website: "https://www.rivendellbhs.com", city: "Benton", state: "AR", type: "Psychiatric", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Arkansas State Hospital", address: "305 South Palm Street, Little Rock, AR 72205", website: "https://humanservices.arkansas.gov/divisions-shared-services/aging-adult-behavioral-health-services/arkansas-state-hospital", city: "Little Rock", state: "AR", type: "Psychiatric", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "United Methodist Behavioral Hospital", address: "1000 Hospital Drive, Maumelle, AR 72113", website: "https://www.umethodistbh.org", city: "Maumelle", state: "AR", type: "Psychiatric", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Springwoods Behavioral Health Services", address: "1000 Hospital Drive, Fayetteville, AR 72703", website: "https://www.springwoodsbhs.com", city: "Fayetteville", state: "AR", type: "Psychiatric", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Riverview Behavioral Health", address: "1000 Hospital Drive, Texarkana, AR 71854", website: "https://www.riverviewbehavioralhealth.com", city: "Texarkana", state: "AR", type: "Psychiatric", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Perimeter Behavioral Hospital of West Memphis", address: "1000 Hospital Drive, West Memphis, AR 72301", website: "https://www.perimeterbh.com", city: "West Memphis", state: "AR", type: "Psychiatric", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" },
            { name: "Conway Behavioral Health", address: "2255 Sturgis Road, Conway, AR 72034", website: "https://www.conwaybh.com", city: "Conway", state: "AR", type: "Psychiatric", beds: 0, safetyGrade: "B", url: "", safetyGradeUrl: "" }
        ];

        // Find Arkansas state document
        const arkansasState = await Location.findOne({ slug: 'arkansas', type: 'state' });
        if (!arkansasState) {
            throw new Error("Arkansas state not found");
        }

        console.log(`[Import] Found Arkansas state: ${arkansasState.name}`);
        console.log(`[Import] Importing ${arkansasHospitals.length} hospitals`);

        // Update Arkansas state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${arkansasHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = arkansasHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'arkansas', type: 'state' },
                { 
                    $set: { 
                        hospitals: arkansasHospitals,
                        hospitalStats: {
                            count: arkansasHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("Arkansas state document not found");
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${arkansasHospitals.length} Arkansas hospitals`);

        // Revalidate the Arkansas page
        revalidatePath('/locations/arkansas');

        return { 
            success: true, 
            message: `Successfully imported ${arkansasHospitals.length} Arkansas hospitals`,
            count: arkansasHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Arkansas hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import California hospital data from CSV directly to database
 */
export async function importCaliforniaHospitals() {
    try {
        await connectToDatabase();
        
        // California hospital data imported from separate file
        console.log(`[Import] Using imported California hospital data`);

        // Find California state document
        const californiaState = await Location.findOne({ slug: 'california', type: 'state' });
        if (!californiaState) {
            throw new Error("California state not found");
        }

        console.log(`[Import] Found California state: ${californiaState.name}`);
        console.log(`[Import] Importing ${californiaHospitals.length} hospitals`);

        // Update California state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${californiaHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = californiaHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'california', type: 'state' },
                { 
                    $set: { 
                        hospitals: californiaHospitals,
                        hospitalStats: {
                            count: californiaHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("California state document not found");
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${californiaHospitals.length} California hospitals`);

        // Revalidate the California page
        revalidatePath('/locations/california');

        return { 
            success: true, 
            message: `Successfully imported ${californiaHospitals.length} California hospitals`,
            count: californiaHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing California hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Colorado hospital data from CSV directly to database
 */
export async function importColoradoHospitals() {
    try {
        await connectToDatabase();
        
        // Colorado hospital data imported from separate file
        console.log(`[Import] Using imported Colorado hospital data`);

        // Find Colorado state document
        const coloradoState = await Location.findOne({ slug: 'colorado', type: 'state' });
        if (!coloradoState) {
            throw new Error("Colorado state not found");
        }

        console.log(`[Import] Found Colorado state: ${coloradoState.name}`);
        console.log(`[Import] Importing ${coloradoHospitals.length} hospitals`);

        // Update Colorado state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${coloradoHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = coloradoHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'colorado', type: 'state' },
                { 
                    $set: { 
                        hospitals: coloradoHospitals,
                        hospitalStats: {
                            count: coloradoHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Colorado state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Colorado document`);
            } else {
                console.log(`[Import] Successfully updated Colorado state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${coloradoHospitals.length} Colorado hospitals`);

        // Revalidate the Colorado page
        revalidatePath('/locations/colorado');

        return { 
            success: true, 
            message: `Successfully imported ${coloradoHospitals.length} Colorado hospitals`,
            count: coloradoHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Colorado hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Connecticut hospital data from CSV directly to database
 */
export async function importConnecticutHospitals() {
    try {
        await connectToDatabase();
        
        // Connecticut hospital data imported from separate file
        console.log(`[Import] Using imported Connecticut hospital data`);

        // Find Connecticut state document
        const connecticutState = await Location.findOne({ slug: 'connecticut', type: 'state' });
        if (!connecticutState) {
            throw new Error("Connecticut state not found");
        }

        console.log(`[Import] Found Connecticut state: ${connecticutState.name}`);
        console.log(`[Import] Importing ${connecticutHospitals.length} hospitals`);

        // Update Connecticut state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${connecticutHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = connecticutHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'connecticut', type: 'state' },
                { 
                    $set: { 
                        hospitals: connecticutHospitals,
                        hospitalStats: {
                            count: connecticutHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Connecticut state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Connecticut document`);
            } else {
                console.log(`[Import] Successfully updated Connecticut state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${connecticutHospitals.length} Connecticut hospitals`);

        // Revalidate the Connecticut page
        revalidatePath('/locations/connecticut');

        return { 
            success: true, 
            message: `Successfully imported ${connecticutHospitals.length} Connecticut hospitals`,
            count: connecticutHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Connecticut hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Delaware hospital data from CSV directly to database
 */
export async function importDelawareHospitals() {
    try {
        await connectToDatabase();
        
        // Delaware hospital data imported from separate file
        console.log(`[Import] Using imported Delaware hospital data`);

        // Find Delaware state document
        const delawareState = await Location.findOne({ slug: 'delaware', type: 'state' });
        if (!delawareState) {
            throw new Error("Delaware state not found");
        }

        console.log(`[Import] Found Delaware state: ${delawareState.name}`);
        console.log(`[Import] Importing ${delawareHospitals.length} hospitals`);

        // Update Delaware state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${delawareHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = delawareHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'delaware', type: 'state' },
                { 
                    $set: { 
                        hospitals: delawareHospitals,
                        hospitalStats: {
                            count: delawareHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Delaware state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Delaware document`);
            } else {
                console.log(`[Import] Successfully updated Delaware state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${delawareHospitals.length} Delaware hospitals`);

        // Revalidate the Delaware page
        revalidatePath('/locations/delaware');

        return { 
            success: true, 
            message: `Successfully imported ${delawareHospitals.length} Delaware hospitals`,
            count: delawareHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Delaware hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Florida hospital data from CSV directly to database
 */
export async function importFloridaHospitals() {
    try {
        await connectToDatabase();
        
        // Florida hospital data imported from separate file
        console.log(`[Import] Using imported Florida hospital data`);

        // Find Florida state document
        const floridaState = await Location.findOne({ slug: 'florida', type: 'state' });
        if (!floridaState) {
            throw new Error("Florida state not found");
        }

        console.log(`[Import] Found Florida state: ${floridaState.name}`);
        console.log(`[Import] Importing ${floridaHospitals.length} hospitals`);

        // Update Florida state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${floridaHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = floridaHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'florida', type: 'state' },
                { 
                    $set: { 
                        hospitals: floridaHospitals,
                        hospitalStats: {
                            count: floridaHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Florida state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Florida document`);
            } else {
                console.log(`[Import] Successfully updated Florida state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${floridaHospitals.length} Florida hospitals`);

        // Revalidate the Florida page
        revalidatePath('/locations/florida');

        return { 
            success: true, 
            message: `Successfully imported ${floridaHospitals.length} Florida hospitals`,
            count: floridaHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Florida hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Georgia hospital data from CSV directly to database
 */
export async function importGeorgiaHospitals() {
    try {
        await connectToDatabase();
        
        // Georgia hospital data imported from separate file
        console.log(`[Import] Using imported Georgia hospital data`);

        // Find Georgia state document
        const georgiaState = await Location.findOne({ slug: 'georgia', type: 'state' });
        if (!georgiaState) {
            throw new Error("Georgia state not found");
        }

        console.log(`[Import] Found Georgia state: ${georgiaState.name}`);
        console.log(`[Import] Importing ${georgiaHospitals.length} hospitals`);

        // Update Georgia state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${georgiaHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = georgiaHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'georgia', type: 'state' },
                { 
                    $set: { 
                        hospitals: georgiaHospitals,
                        hospitalStats: {
                            count: georgiaHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Georgia state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Georgia document`);
            } else {
                console.log(`[Import] Successfully updated Georgia state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${georgiaHospitals.length} Georgia hospitals`);

        // Revalidate the Georgia page
        revalidatePath('/locations/georgia');

        return { 
            success: true, 
            message: `Successfully imported ${georgiaHospitals.length} Georgia hospitals`,
            count: georgiaHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Georgia hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Hawaii hospital data from CSV directly to database
 */
export async function importHawaiiHospitals() {
    try {
        await connectToDatabase();
        
        // Hawaii hospital data imported from separate file
        console.log(`[Import] Using imported Hawaii hospital data`);

        // Find Hawaii state document
        const hawaiiState = await Location.findOne({ slug: 'hawaii', type: 'state' });
        if (!hawaiiState) {
            throw new Error("Hawaii state not found");
        }

        console.log(`[Import] Found Hawaii state: ${hawaiiState.name}`);
        console.log(`[Import] Importing ${hawaiiHospitals.length} hospitals`);

        // Update Hawaii state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${hawaiiHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = hawaiiHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'hawaii', type: 'state' },
                { 
                    $set: { 
                        hospitals: hawaiiHospitals,
                        hospitalStats: {
                            count: hawaiiHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Hawaii state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Hawaii document`);
            } else {
                console.log(`[Import] Successfully updated Hawaii state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${hawaiiHospitals.length} Hawaii hospitals`);

        // Revalidate the Hawaii page
        revalidatePath('/locations/hawaii');

        return { 
            success: true, 
            message: `Successfully imported ${hawaiiHospitals.length} Hawaii hospitals`,
            count: hawaiiHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Hawaii hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Idaho hospital data from CSV directly to database
 */
export async function importIdahoHospitals() {
    try {
        await connectToDatabase();
        
        // Idaho hospital data imported from separate file
        console.log(`[Import] Using imported Idaho hospital data`);

        // Find Idaho state document
        const idahoState = await Location.findOne({ slug: 'idaho', type: 'state' });
        if (!idahoState) {
            throw new Error("Idaho state not found");
        }

        console.log(`[Import] Found Idaho state: ${idahoState.name}`);
        console.log(`[Import] Importing ${idahoHospitals.length} hospitals`);

        // Update Idaho state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${idahoHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = idahoHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'idaho', type: 'state' },
                { 
                    $set: { 
                        hospitals: idahoHospitals,
                        hospitalStats: {
                            count: idahoHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Idaho state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Idaho document`);
            } else {
                console.log(`[Import] Successfully updated Idaho state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${idahoHospitals.length} Idaho hospitals`);

        // Revalidate the Idaho page
        revalidatePath('/locations/idaho');

        return { 
            success: true, 
            message: `Successfully imported ${idahoHospitals.length} Idaho hospitals`,
            count: idahoHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Idaho hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Illinois hospital data from CSV directly to database
 */
export async function importIllinoisHospitals() {
    try {
        await connectToDatabase();
        
        // Illinois hospital data imported from separate file
        console.log(`[Import] Using imported Illinois hospital data`);

        // Find Illinois state document
        const illinoisState = await Location.findOne({ slug: 'illinois', type: 'state' });
        if (!illinoisState) {
            throw new Error("Illinois state not found");
        }

        console.log(`[Import] Found Illinois state: ${illinoisState.name}`);
        console.log(`[Import] Importing ${illinoisHospitals.length} hospitals`);

        // Update Illinois state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${illinoisHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = illinoisHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'illinois', type: 'state' },
                { 
                    $set: { 
                        hospitals: illinoisHospitals,
                        hospitalStats: {
                            count: illinoisHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Illinois state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Illinois document`);
            } else {
                console.log(`[Import] Successfully updated Illinois state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${illinoisHospitals.length} Illinois hospitals`);

        // Revalidate the Illinois page
        revalidatePath('/locations/illinois');

        return { 
            success: true, 
            message: `Successfully imported ${illinoisHospitals.length} Illinois hospitals`,
            count: illinoisHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Illinois hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Indiana hospital data from CSV directly to database
 */
export async function importIndianaHospitals() {
    try {
        await connectToDatabase();
        
        // Indiana hospital data imported from separate file
        console.log(`[Import] Using imported Indiana hospital data`);

        // Find Indiana state document
        const indianaState = await Location.findOne({ slug: 'indiana', type: 'state' });
        if (!indianaState) {
            throw new Error("Indiana state not found");
        }

        console.log(`[Import] Found Indiana state: ${indianaState.name}`);
        console.log(`[Import] Importing ${indianaHospitals.length} hospitals`);

        // Update Indiana state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${indianaHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = indianaHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'indiana', type: 'state' },
                { 
                    $set: { 
                        hospitals: indianaHospitals,
                        hospitalStats: {
                            count: indianaHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Indiana state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Indiana document`);
            } else {
                console.log(`[Import] Successfully updated Indiana state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${indianaHospitals.length} Indiana hospitals`);

        // Revalidate the Indiana page
        revalidatePath('/locations/indiana');

        return { 
            success: true, 
            message: `Successfully imported ${indianaHospitals.length} Indiana hospitals`,
            count: indianaHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Indiana hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Iowa hospital data from CSV directly to database
 */
export async function importIowaHospitals() {
    try {
        await connectToDatabase();
        
        // Iowa hospital data imported from separate file
        console.log(`[Import] Using imported Iowa hospital data`);

        // Find Iowa state document
        const iowaState = await Location.findOne({ slug: 'iowa', type: 'state' });
        if (!iowaState) {
            throw new Error("Iowa state not found");
        }

        console.log(`[Import] Found Iowa state: ${iowaState.name}`);
        console.log(`[Import] Importing ${iowaHospitals.length} hospitals`);

        // Update Iowa state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${iowaHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = iowaHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'iowa', type: 'state' },
                { 
                    $set: { 
                        hospitals: iowaHospitals,
                        hospitalStats: {
                            count: iowaHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Iowa state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Iowa document`);
            } else {
                console.log(`[Import] Successfully updated Iowa state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${iowaHospitals.length} Iowa hospitals`);

        // Revalidate the Iowa page
        revalidatePath('/locations/iowa');

        return { 
            success: true, 
            message: `Successfully imported ${iowaHospitals.length} Iowa hospitals`,
            count: iowaHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Iowa hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Kentucky hospital data from CSV directly to database
 */
export async function importKentuckyHospitals() {
    try {
        await connectToDatabase();
        
        // Kentucky hospital data imported from separate file
        console.log(`[Import] Using imported Kentucky hospital data`);

        // Find Kentucky state document
        const kentuckyState = await Location.findOne({ slug: 'kentucky', type: 'state' });
        if (!kentuckyState) {
            throw new Error("Kentucky state not found");
        }

        console.log(`[Import] Found Kentucky state: ${kentuckyState.name}`);
        console.log(`[Import] Importing ${kentuckyHospitals.length} hospitals`);

        // Update Kentucky state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${kentuckyHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = kentuckyHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'kentucky', type: 'state' },
                { 
                    $set: { 
                        hospitals: kentuckyHospitals,
                        hospitalStats: {
                            count: kentuckyHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Kentucky state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Kentucky document`);
            } else {
                console.log(`[Import] Successfully updated Kentucky state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${kentuckyHospitals.length} Kentucky hospitals`);

        // Revalidate the Kentucky page
        revalidatePath('/locations/kentucky');

        return { 
            success: true, 
            message: `Successfully imported ${kentuckyHospitals.length} Kentucky hospitals`,
            count: kentuckyHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Kentucky hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Kansas hospital data from CSV directly to database
 */
export async function importKansasHospitals() {
    try {
        await connectToDatabase();
        
        // Kansas hospital data imported from separate file
        console.log(`[Import] Using imported Kansas hospital data`);

        // Find Kansas state document
        const kansasState = await Location.findOne({ slug: 'kansas', type: 'state' });
        if (!kansasState) {
            throw new Error("Kansas state not found");
        }

        console.log(`[Import] Found Kansas state: ${kansasState.name}`);
        console.log(`[Import] Importing ${kansasHospitals.length} hospitals`);

        // Update Kansas state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${kansasHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = kansasHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'kansas', type: 'state' },
                { 
                    $set: { 
                        hospitals: kansasHospitals,
                        hospitalStats: {
                            count: kansasHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Kansas state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Kansas document`);
            } else {
                console.log(`[Import] Successfully updated Kansas state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${kansasHospitals.length} Kansas hospitals`);

        // Revalidate the Kansas page
        revalidatePath('/locations/kansas');

        return { 
            success: true, 
            message: `Successfully imported ${kansasHospitals.length} Kansas hospitals`,
            count: kansasHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Kansas hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Louisiana hospital data from CSV directly to database
 */
export async function importLouisianaHospitals() {
    try {
        await connectToDatabase();
        
        // Louisiana hospital data imported from separate file
        console.log(`[Import] Using imported Louisiana hospital data`);

        // Find Louisiana state document
        const louisianaState = await Location.findOne({ slug: 'louisiana', type: 'state' });
        if (!louisianaState) {
            throw new Error("Louisiana state not found");
        }

        console.log(`[Import] Found Louisiana state: ${louisianaState.name}`);
        console.log(`[Import] Importing ${louisianaHospitals.length} hospitals`);

        // Update Louisiana state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${louisianaHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = louisianaHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'louisiana', type: 'state' },
                { 
                    $set: { 
                        hospitals: louisianaHospitals,
                        hospitalStats: {
                            count: louisianaHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Louisiana state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Louisiana document`);
            } else {
                console.log(`[Import] Successfully updated Louisiana state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${louisianaHospitals.length} Louisiana hospitals`);

        // Revalidate the Louisiana page
        revalidatePath('/locations/louisiana');

        return { 
            success: true, 
            message: `Successfully imported ${louisianaHospitals.length} Louisiana hospitals`,
            count: louisianaHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Louisiana hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Maine hospital data from CSV directly to database
 */
export async function importMaineHospitals() {
    try {
        await connectToDatabase();
        
        // Maine hospital data imported from separate file
        console.log(`[Import] Using imported Maine hospital data`);

        // Find Maine state document
        const maineState = await Location.findOne({ slug: 'maine', type: 'state' });
        if (!maineState) {
            throw new Error("Maine state not found");
        }

        console.log(`[Import] Found Maine state: ${maineState.name}`);
        console.log(`[Import] Importing ${maineHospitals.length} hospitals`);

        // Update Maine state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${maineHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = maineHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'maine', type: 'state' },
                { 
                    $set: { 
                        hospitals: maineHospitals,
                        hospitalStats: {
                            count: maineHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Maine state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Maine document`);
            } else {
                console.log(`[Import] Successfully updated Maine state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${maineHospitals.length} Maine hospitals`);

        // Revalidate the Maine page
        revalidatePath('/locations/maine');

        return { 
            success: true, 
            message: `Successfully imported ${maineHospitals.length} Maine hospitals`,
            count: maineHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Maine hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Maryland hospital data from CSV directly to database
 */
export async function importMarylandHospitals() {
    try {
        await connectToDatabase();
        
        // Maryland hospital data imported from separate file
        console.log(`[Import] Using imported Maryland hospital data`);

        // Find Maryland state document
        const marylandState = await Location.findOne({ slug: 'maryland', type: 'state' });
        if (!marylandState) {
            throw new Error("Maryland state not found");
        }

        console.log(`[Import] Found Maryland state: ${marylandState.name}`);
        console.log(`[Import] Importing ${marylandHospitals.length} hospitals`);

        // Update Maryland state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${marylandHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = marylandHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'maryland', type: 'state' },
                { 
                    $set: { 
                        hospitals: marylandHospitals,
                        hospitalStats: {
                            count: marylandHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Maryland state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Maryland document`);
            } else {
                console.log(`[Import] Successfully updated Maryland state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${marylandHospitals.length} Maryland hospitals`);

        // Revalidate the Maryland page
        revalidatePath('/locations/maryland');

        return { 
            success: true, 
            message: `Successfully imported ${marylandHospitals.length} Maryland hospitals`,
            count: marylandHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Maryland hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Massachusetts hospital data from CSV directly to database
 */
export async function importMassachusettsHospitals() {
    try {
        await connectToDatabase();
        
        // Massachusetts hospital data imported from separate file
        console.log(`[Import] Using imported Massachusetts hospital data`);

        // Find Massachusetts state document
        const massachusettsState = await Location.findOne({ slug: 'massachusetts', type: 'state' });
        if (!massachusettsState) {
            throw new Error("Massachusetts state not found");
        }

        console.log(`[Import] Found Massachusetts state: ${massachusettsState.name}`);
        console.log(`[Import] Importing ${massachusettsHospitals.length} hospitals`);

        // Update Massachusetts state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${massachusettsHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = massachusettsHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'massachusetts', type: 'state' },
                { 
                    $set: { 
                        hospitals: massachusettsHospitals,
                        hospitalStats: {
                            count: massachusettsHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Massachusetts state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Massachusetts document`);
            } else {
                console.log(`[Import] Successfully updated Massachusetts state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${massachusettsHospitals.length} Massachusetts hospitals`);

        // Revalidate the Massachusetts page
        revalidatePath('/locations/massachusetts');

        return { 
            success: true, 
            message: `Successfully imported ${massachusettsHospitals.length} Massachusetts hospitals`,
            count: massachusettsHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Massachusetts hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Michigan hospital data from CSV directly to database
 */
export async function importMichiganHospitals() {
    try {
        await connectToDatabase();
        
        // Michigan hospital data imported from separate file
        console.log(`[Import] Using imported Michigan hospital data`);

        // Find Michigan state document
        const michiganState = await Location.findOne({ slug: 'michigan', type: 'state' });
        if (!michiganState) {
            throw new Error("Michigan state not found");
        }

        console.log(`[Import] Found Michigan state: ${michiganState.name}`);
        console.log(`[Import] Importing ${michiganHospitals.length} hospitals`);

        // Update Michigan state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${michiganHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = michiganHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'michigan', type: 'state' },
                { 
                    $set: { 
                        hospitals: michiganHospitals,
                        hospitalStats: {
                            count: michiganHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Michigan state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Michigan document`);
            } else {
                console.log(`[Import] Successfully updated Michigan state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${michiganHospitals.length} Michigan hospitals`);

        // Revalidate the Michigan page
        revalidatePath('/locations/michigan');

        return { 
            success: true, 
            message: `Successfully imported ${michiganHospitals.length} Michigan hospitals`,
            count: michiganHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Michigan hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Minnesota hospital data from CSV directly to database
 */
export async function importMinnesotaHospitals() {
    try {
        await connectToDatabase();
        
        // Minnesota hospital data imported from separate file
        console.log(`[Import] Using imported Minnesota hospital data`);

        // Find Minnesota state document
        const minnesotaState = await Location.findOne({ slug: 'minnesota', type: 'state' });
        if (!minnesotaState) {
            throw new Error("Minnesota state not found");
        }

        console.log(`[Import] Found Minnesota state: ${minnesotaState.name}`);
        console.log(`[Import] Importing ${minnesotaHospitals.length} hospitals`);

        // Update Minnesota state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${minnesotaHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = minnesotaHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'minnesota', type: 'state' },
                { 
                    $set: { 
                        hospitals: minnesotaHospitals,
                        hospitalStats: {
                            count: minnesotaHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Minnesota state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Minnesota document`);
            } else {
                console.log(`[Import] Successfully updated Minnesota state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${minnesotaHospitals.length} Minnesota hospitals`);

        // Revalidate the Minnesota page
        revalidatePath('/locations/minnesota');

        return { 
            success: true, 
            message: `Successfully imported ${minnesotaHospitals.length} Minnesota hospitals`,
            count: minnesotaHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Minnesota hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Mississippi hospital data from CSV directly to database
 */
export async function importMississippiHospitals() {
    try {
        await connectToDatabase();
        
        // Mississippi hospital data imported from separate file
        console.log(`[Import] Using imported Mississippi hospital data`);

        // Find Mississippi state document
        const mississippiState = await Location.findOne({ slug: 'mississippi', type: 'state' });
        if (!mississippiState) {
            throw new Error("Mississippi state not found");
        }

        console.log(`[Import] Found Mississippi state: ${mississippiState.name}`);
        console.log(`[Import] Importing ${mississippiHospitals.length} hospitals`);

        // Update Mississippi state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${mississippiHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = mississippiHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'mississippi', type: 'state' },
                { 
                    $set: { 
                        hospitals: mississippiHospitals,
                        hospitalStats: {
                            count: mississippiHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Mississippi state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Mississippi document`);
            } else {
                console.log(`[Import] Successfully updated Mississippi state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${mississippiHospitals.length} Mississippi hospitals`);

        // Revalidate the Mississippi page
        revalidatePath('/locations/mississippi');

        return { 
            success: true, 
            message: `Successfully imported ${mississippiHospitals.length} Mississippi hospitals`,
            count: mississippiHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Mississippi hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Montana hospital data from CSV directly to database
 */
export async function importMontanaHospitals() {
    try {
        await connectToDatabase();
        
        // Montana hospital data imported from separate file
        console.log(`[Import] Using imported Montana hospital data`);

        // Find Montana state document
        const montanaState = await Location.findOne({ slug: 'montana', type: 'state' });
        if (!montanaState) {
            throw new Error("Montana state not found");
        }

        console.log(`[Import] Found Montana state: ${montanaState.name}`);
        console.log(`[Import] Importing ${montanaHospitals.length} hospitals`);

        // Update Montana state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${montanaHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = montanaHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'montana', type: 'state' },
                { 
                    $set: { 
                        hospitals: montanaHospitals,
                        hospitalStats: {
                            count: montanaHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Montana state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Montana document`);
            } else {
                console.log(`[Import] Successfully updated Montana state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${montanaHospitals.length} Montana hospitals`);

        // Revalidate the Montana page
        // revalidatePath('/locations/montana');

        return { 
            success: true, 
            message: `Successfully imported ${montanaHospitals.length} Montana hospitals`,
            count: montanaHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Montana hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Nebraska hospital data from CSV directly to database
 */
export async function importNebraskaHospitals() {
    try {
        await connectToDatabase();
        
        // Nebraska hospital data imported from separate file
        console.log(`[Import] Using imported Nebraska hospital data`);

        // Find Nebraska state document
        const nebraskaState = await Location.findOne({ slug: 'nebraska', type: 'state' });
        if (!nebraskaState) {
            throw new Error("Nebraska state not found");
        }

        console.log(`[Import] Found Nebraska state: ${nebraskaState.name}`);
        console.log(`[Import] Importing ${nebraskaHospitals.length} hospitals`);

        // Update Nebraska state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${nebraskaHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = nebraskaHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'nebraska', type: 'state' },
                { 
                    $set: { 
                        hospitals: nebraskaHospitals,
                        hospitalStats: {
                            count: nebraskaHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Nebraska state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Nebraska document`);
            } else {
                console.log(`[Import] Successfully updated Nebraska state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${nebraskaHospitals.length} Nebraska hospitals`);

        // Revalidate the Nebraska page
        // revalidatePath('/locations/nebraska');

        return { 
            success: true, 
            message: `Successfully imported ${nebraskaHospitals.length} Nebraska hospitals`,
            count: nebraskaHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Nebraska hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Missouri hospital data from CSV directly to database
 */
export async function importMissouriHospitals() {
    try {
        await connectToDatabase();
        
        // Missouri hospital data imported from separate file
        console.log(`[Import] Using imported Missouri hospital data`);

        // Find Missouri state document
        const missouriState = await Location.findOne({ slug: 'missouri', type: 'state' });
        if (!missouriState) {
            throw new Error("Missouri state not found");
        }

        console.log(`[Import] Found Missouri state: ${missouriState.name}`);
        console.log(`[Import] Importing ${missouriHospitals.length} hospitals`);

        // Update Missouri state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${missouriHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = missouriHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'missouri', type: 'state' },
                { 
                    $set: { 
                        hospitals: missouriHospitals,
                        hospitalStats: {
                            count: missouriHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Missouri state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Missouri document`);
            } else {
                console.log(`[Import] Successfully updated Missouri state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${missouriHospitals.length} Missouri hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${missouriHospitals.length} Missouri hospitals`,
            count: missouriHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Missouri hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Nevada hospital data from CSV directly to database
 */
export async function importNevadaHospitals() {
    try {
        await connectToDatabase();
        
        // Nevada hospital data imported from separate file
        console.log(`[Import] Using imported Nevada hospital data`);

        // Find Nevada state document
        const nevadaState = await Location.findOne({ slug: 'nevada', type: 'state' });
        if (!nevadaState) {
            throw new Error("Nevada state not found");
        }

        console.log(`[Import] Found Nevada state: ${nevadaState.name}`);
        console.log(`[Import] Importing ${nevadaHospitals.length} hospitals`);

        // Update Nevada state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${nevadaHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = nevadaHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'nevada', type: 'state' },
                { 
                    $set: { 
                        hospitals: nevadaHospitals,
                        hospitalStats: {
                            count: nevadaHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Nevada state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Nevada document`);
            } else {
                console.log(`[Import] Successfully updated Nevada state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${nevadaHospitals.length} Nevada hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${nevadaHospitals.length} Nevada hospitals`,
            count: nevadaHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Nevada hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import New Hampshire hospital data from CSV directly to database
 */
export async function importNewHampshireHospitals() {
    try {
        await connectToDatabase();
        
        // New Hampshire hospital data imported from separate file
        console.log(`[Import] Using imported New Hampshire hospital data`);

        // Find New Hampshire state document
        // the slug might be "new-hampshire", using 'new-hampshire'
        const nhState = await Location.findOne({ slug: 'new-hampshire', type: 'state' });
        if (!nhState) {
            throw new Error("New Hampshire state not found");
        }

        console.log(`[Import] Found New Hampshire state: ${nhState.name}`);
        console.log(`[Import] Importing ${newHampshireHospitals.length} hospitals`);

        // Update New Hampshire state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${newHampshireHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = newHampshireHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'new-hampshire', type: 'state' },
                { 
                    $set: { 
                        hospitals: newHampshireHospitals,
                        hospitalStats: {
                            count: newHampshireHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No New Hampshire state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to New Hampshire document`);
            } else {
                console.log(`[Import] Successfully updated New Hampshire state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${newHampshireHospitals.length} New Hampshire hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${newHampshireHospitals.length} New Hampshire hospitals`,
            count: newHampshireHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing New Hampshire hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import New Jersey hospital data from CSV directly to database
 */
export async function importNewJerseyHospitals() {
    try {
        await connectToDatabase();
        
        // New Jersey hospital data imported from separate file
        console.log(`[Import] Using imported New Jersey hospital data`);

        // Find New Jersey state document
        const njState = await Location.findOne({ slug: 'new-jersey', type: 'state' });
        if (!njState) {
            throw new Error("New Jersey state not found");
        }

        console.log(`[Import] Found New Jersey state: ${njState.name}`);
        console.log(`[Import] Importing ${newJerseyHospitals.length} hospitals`);

        // Update New Jersey state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${newJerseyHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = newJerseyHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'new-jersey', type: 'state' },
                { 
                    $set: { 
                        hospitals: newJerseyHospitals,
                        hospitalStats: {
                            count: newJerseyHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No New Jersey state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to New Jersey document`);
            } else {
                console.log(`[Import] Successfully updated New Jersey state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${newJerseyHospitals.length} New Jersey hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${newJerseyHospitals.length} New Jersey hospitals`,
            count: newJerseyHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing New Jersey hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import New Mexico hospital data from CSV directly to database
 */
export async function importNewMexicoHospitals() {
    try {
        await connectToDatabase();
        
        // New Mexico hospital data imported from separate file
        console.log(`[Import] Using imported New Mexico hospital data`);

        // Find New Mexico state document
        // slug "new-mexico"
        const nmState = await Location.findOne({ slug: 'new-mexico', type: 'state' });
        if (!nmState) {
            throw new Error("New Mexico state not found");
        }

        console.log(`[Import] Found New Mexico state: ${nmState.name}`);
        console.log(`[Import] Importing ${newMexicoHospitals.length} hospitals`);

        // Update New Mexico state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${newMexicoHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = newMexicoHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'new-mexico', type: 'state' },
                { 
                    $set: { 
                        hospitals: newMexicoHospitals,
                        hospitalStats: {
                            count: newMexicoHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No New Mexico state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to New Mexico document`);
            } else {
                console.log(`[Import] Successfully updated New Mexico state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${newMexicoHospitals.length} New Mexico hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${newMexicoHospitals.length} New Mexico hospitals`,
            count: newMexicoHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing New Mexico hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import New York hospital data from CSV directly to database
 */
export async function importNewYorkHospitals() {
    try {
        await connectToDatabase();
        
        // New York hospital data imported from separate file
        console.log(`[Import] Using imported New York hospital data`);

        // Find New York state document
        // slug "new-york"
        const nyState = await Location.findOne({ slug: 'new-york', type: 'state' });
        if (!nyState) {
            throw new Error("New York state not found");
        }

        console.log(`[Import] Found New York state: ${nyState.name}`);
        console.log(`[Import] Importing ${newYorkHospitals.length} hospitals`);

        // Update New York state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${newYorkHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = newYorkHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'new-york', type: 'state' },
                { 
                    $set: { 
                        hospitals: newYorkHospitals,
                        hospitalStats: {
                            count: newYorkHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No New York state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to New York document`);
            } else {
                console.log(`[Import] Successfully updated New York state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${newYorkHospitals.length} New York hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${newYorkHospitals.length} New York hospitals`,
            count: newYorkHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing New York hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import North Carolina hospital data from CSV directly to database
 */
export async function importNorthCarolinaHospitals() {
    try {
        await connectToDatabase();
        
        // North Carolina hospital data imported from separate file
        console.log(`[Import] Using imported North Carolina hospital data`);

        // Find North Carolina state document
        // slug "north-carolina"
        const ncState = await Location.findOne({ slug: 'north-carolina', type: 'state' });
        if (!ncState) {
            throw new Error("North Carolina state not found");
        }

        console.log(`[Import] Found North Carolina state: ${ncState.name}`);
        console.log(`[Import] Importing ${northCarolinaHospitals.length} hospitals`);

        // Update North Carolina state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${northCarolinaHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = northCarolinaHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'north-carolina', type: 'state' },
                { 
                    $set: { 
                        hospitals: northCarolinaHospitals,
                        hospitalStats: {
                            count: northCarolinaHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No North Carolina state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to North Carolina document`);
            } else {
                console.log(`[Import] Successfully updated North Carolina state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${northCarolinaHospitals.length} North Carolina hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${northCarolinaHospitals.length} North Carolina hospitals`,
            count: northCarolinaHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing North Carolina hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import North Dakota hospital data from CSV directly to database
 */
export async function importNorthDakotaHospitals() {
    try {
        await connectToDatabase();
        
        // North Dakota hospital data imported from separate file
        console.log(`[Import] Using imported North Dakota hospital data`);

        // Find North Dakota state document
        // slug "north-dakota"
        const ndState = await Location.findOne({ slug: 'north-dakota', type: 'state' });
        if (!ndState) {
            throw new Error("North Dakota state not found");
        }

        console.log(`[Import] Found North Dakota state: ${ndState.name}`);
        console.log(`[Import] Importing ${northDakotaHospitals.length} hospitals`);

        // Update North Dakota state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${northDakotaHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = northDakotaHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'north-dakota', type: 'state' },
                { 
                    $set: { 
                        hospitals: northDakotaHospitals,
                        hospitalStats: {
                            count: northDakotaHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No North Dakota state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to North Dakota document`);
            } else {
                console.log(`[Import] Successfully updated North Dakota state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${northDakotaHospitals.length} North Dakota hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${northDakotaHospitals.length} North Dakota hospitals`,
            count: northDakotaHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing North Dakota hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Ohio hospital data from CSV directly to database
 */
export async function importOhioHospitals() {
    try {
        await connectToDatabase();
        
        // Ohio hospital data imported from separate file
        console.log(`[Import] Using imported Ohio hospital data`);

        // Find Ohio state document
        // slug "ohio"
        const ohState = await Location.findOne({ slug: 'ohio', type: 'state' });
        if (!ohState) {
            throw new Error("Ohio state not found");
        }

        console.log(`[Import] Found Ohio state: ${ohState.name}`);
        console.log(`[Import] Importing ${ohioHospitals.length} hospitals`);

        // Update Ohio state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${ohioHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = ohioHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'ohio', type: 'state' },
                { 
                    $set: { 
                        hospitals: ohioHospitals,
                        hospitalStats: {
                            count: ohioHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Ohio state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Ohio document`);
            } else {
                console.log(`[Import] Successfully updated Ohio state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${ohioHospitals.length} Ohio hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${ohioHospitals.length} Ohio hospitals`,
            count: ohioHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Ohio hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Oklahoma hospital data from CSV directly to database
 */
export async function importOklahomaHospitals() {
    try {
        await connectToDatabase();
        
        // Oklahoma hospital data imported from separate file
        console.log(`[Import] Using imported Oklahoma hospital data`);

        // Find Oklahoma state document
        // slug "oklahoma"
        const okState = await Location.findOne({ slug: 'oklahoma', type: 'state' });
        if (!okState) {
            throw new Error("Oklahoma state not found");
        }

        console.log(`[Import] Found Oklahoma state: ${okState.name}`);
        console.log(`[Import] Importing ${oklahomaHospitals.length} hospitals`);

        // Update Oklahoma state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${oklahomaHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = oklahomaHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'oklahoma', type: 'state' },
                { 
                    $set: { 
                        hospitals: oklahomaHospitals,
                        hospitalStats: {
                            count: oklahomaHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Oklahoma state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Oklahoma document`);
            } else {
                console.log(`[Import] Successfully updated Oklahoma state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${oklahomaHospitals.length} Oklahoma hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${oklahomaHospitals.length} Oklahoma hospitals`,
            count: oklahomaHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Oklahoma hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Oregon hospital data from CSV directly to database
 */
export async function importOregonHospitals() {
    try {
        await connectToDatabase();
        
        // Oregon hospital data imported from separate file
        console.log(`[Import] Using imported Oregon hospital data`);

        // Find Oregon state document
        // slug "oregon"
        const orState = await Location.findOne({ slug: 'oregon', type: 'state' });
        if (!orState) {
            throw new Error("Oregon state not found");
        }

        console.log(`[Import] Found Oregon state: ${orState.name}`);
        console.log(`[Import] Importing ${oregonHospitals.length} hospitals`);

        // Update Oregon state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${oregonHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = oregonHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'oregon', type: 'state' },
                { 
                    $set: { 
                        hospitals: oregonHospitals,
                        hospitalStats: {
                            count: oregonHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Oregon state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Oregon document`);
            } else {
                console.log(`[Import] Successfully updated Oregon state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${oregonHospitals.length} Oregon hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${oregonHospitals.length} Oregon hospitals`,
            count: oregonHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Oregon hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Pennsylvania hospital data from CSV directly to database
 */
export async function importPennsylvaniaHospitals() {
    try {
        await connectToDatabase();
        
        // Pennsylvania hospital data imported from separate file
        console.log(`[Import] Using imported Pennsylvania hospital data`);

        // Find Pennsylvania state document
        // slug "pennsylvania"
        const paState = await Location.findOne({ slug: 'pennsylvania', type: 'state' });
        if (!paState) {
            throw new Error("Pennsylvania state not found");
        }

        console.log(`[Import] Found Pennsylvania state: ${paState.name}`);
        console.log(`[Import] Importing ${pennsylvaniaHospitals.length} hospitals`);

        // Update Pennsylvania state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${pennsylvaniaHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = pennsylvaniaHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'pennsylvania', type: 'state' },
                { 
                    $set: { 
                        hospitals: pennsylvaniaHospitals,
                        hospitalStats: {
                            count: pennsylvaniaHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Pennsylvania state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Pennsylvania document`);
            } else {
                console.log(`[Import] Successfully updated Pennsylvania state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${pennsylvaniaHospitals.length} Pennsylvania hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${pennsylvaniaHospitals.length} Pennsylvania hospitals`,
            count: pennsylvaniaHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Pennsylvania hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Rhode Island hospital data from CSV directly to database
 */
export async function importRhodeIslandHospitals() {
    try {
        await connectToDatabase();
        
        // Rhode Island hospital data imported from separate file
        console.log(`[Import] Using imported Rhode Island hospital data`);

        // Find Rhode Island state document
        // slug "rhode-island"
        const riState = await Location.findOne({ slug: 'rhode-island', type: 'state' });
        if (!riState) {
            throw new Error("Rhode Island state not found");
        }

        console.log(`[Import] Found Rhode Island state: ${riState.name}`);
        console.log(`[Import] Importing ${rhodeIslandHospitals.length} hospitals`);

        // Update Rhode Island state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${rhodeIslandHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = rhodeIslandHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'rhode-island', type: 'state' },
                { 
                    $set: { 
                        hospitals: rhodeIslandHospitals,
                        hospitalStats: {
                            count: rhodeIslandHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Rhode Island state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Rhode Island document`);
            } else {
                console.log(`[Import] Successfully updated Rhode Island state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${rhodeIslandHospitals.length} Rhode Island hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${rhodeIslandHospitals.length} Rhode Island hospitals`,
            count: rhodeIslandHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Rhode Island hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import South Carolina hospital data from CSV directly to database
 */
export async function importSouthCarolinaHospitals() {
    try {
        await connectToDatabase();
        
        // South Carolina hospital data imported from separate file
        console.log(`[Import] Using imported South Carolina hospital data`);

        // Find South Carolina state document
        // slug "south-carolina"
        const scState = await Location.findOne({ slug: 'south-carolina', type: 'state' });
        if (!scState) {
            throw new Error("South Carolina state not found");
        }

        console.log(`[Import] Found South Carolina state: ${scState.name}`);
        console.log(`[Import] Importing ${southCarolinaHospitals.length} hospitals`);

        // Update South Carolina state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${southCarolinaHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = southCarolinaHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'south-carolina', type: 'state' },
                { 
                    $set: { 
                        hospitals: southCarolinaHospitals,
                        hospitalStats: {
                            count: southCarolinaHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No South Carolina state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to South Carolina document`);
            } else {
                console.log(`[Import] Successfully updated South Carolina state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${southCarolinaHospitals.length} South Carolina hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${southCarolinaHospitals.length} South Carolina hospitals`,
            count: southCarolinaHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing South Carolina hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import South Dakota hospital data from CSV directly to database
 */
export async function importSouthDakotaHospitals() {
    try {
        await connectToDatabase();
        
        // South Dakota hospital data imported from separate file
        console.log(`[Import] Using imported South Dakota hospital data`);

        // Find South Dakota state document
        // slug "south-dakota"
        const sdState = await Location.findOne({ slug: 'south-dakota', type: 'state' });
        if (!sdState) {
            throw new Error("South Dakota state not found");
        }

        console.log(`[Import] Found South Dakota state: ${sdState.name}`);
        console.log(`[Import] Importing ${southDakotaHospitals.length} hospitals`);

        // Update South Dakota state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${southDakotaHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = southDakotaHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'south-dakota', type: 'state' },
                { 
                    $set: { 
                        hospitals: southDakotaHospitals,
                        hospitalStats: {
                            count: southDakotaHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No South Dakota state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to South Dakota document`);
            } else {
                console.log(`[Import] Successfully updated South Dakota state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${southDakotaHospitals.length} South Dakota hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${southDakotaHospitals.length} South Dakota hospitals`,
            count: southDakotaHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing South Dakota hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Tennessee hospital data from CSV directly to database
 */
export async function importTennesseeHospitals() {
    try {
        await connectToDatabase();
        
        // Tennessee hospital data imported from separate file
        console.log(`[Import] Using imported Tennessee hospital data`);

        // Find Tennessee state document
        // slug "tennessee"
        const tnState = await Location.findOne({ slug: 'tennessee', type: 'state' });
        if (!tnState) {
            throw new Error("Tennessee state not found");
        }

        console.log(`[Import] Found Tennessee state: ${tnState.name}`);
        console.log(`[Import] Importing ${tennesseeHospitals.length} hospitals`);

        // Update Tennessee state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${tennesseeHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = tennesseeHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'tennessee', type: 'state' },
                { 
                    $set: { 
                        hospitals: tennesseeHospitals,
                        hospitalStats: {
                            count: tennesseeHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Tennessee state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Tennessee document`);
            } else {
                console.log(`[Import] Successfully updated Tennessee state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${tennesseeHospitals.length} Tennessee hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${tennesseeHospitals.length} Tennessee hospitals`,
            count: tennesseeHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Tennessee hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Texas hospital data from CSV directly to database
 */
export async function importTexasHospitals() {
    try {
        await connectToDatabase();
        
        // Texas hospital data imported from separate file
        console.log(`[Import] Using imported Texas hospital data`);

        // Find Texas state document
        // slug "texas"
        const txState = await Location.findOne({ slug: 'texas', type: 'state' });
        if (!txState) {
            throw new Error("Texas state not found");
        }

        console.log(`[Import] Found Texas state: ${txState.name}`);
        console.log(`[Import] Importing ${texasHospitals.length} hospitals`);

        // Update Texas state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${texasHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = texasHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'texas', type: 'state' },
                { 
                    $set: { 
                        hospitals: texasHospitals,
                        hospitalStats: {
                            count: texasHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Texas state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Texas document`);
            } else {
                console.log(`[Import] Successfully updated Texas state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${texasHospitals.length} Texas hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${texasHospitals.length} Texas hospitals`,
            count: texasHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Texas hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Utah hospital data from CSV directly to database
 */
export async function importUtahHospitals() {
    try {
        await connectToDatabase();
        
        // Utah hospital data imported from separate file
        console.log(`[Import] Using imported Utah hospital data`);

        // Find Utah state document
        // slug "utah"
        const utState = await Location.findOne({ slug: 'utah', type: 'state' });
        if (!utState) {
            throw new Error("Utah state not found");
        }

        console.log(`[Import] Found Utah state: ${utState.name}`);
        console.log(`[Import] Importing ${utahHospitals.length} hospitals`);

        // Update Utah state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${utahHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = utahHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'utah', type: 'state' },
                { 
                    $set: { 
                        hospitals: utahHospitals,
                        hospitalStats: {
                            count: utahHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Utah state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Utah document`);
            } else {
                console.log(`[Import] Successfully updated Utah state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${utahHospitals.length} Utah hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${utahHospitals.length} Utah hospitals`,
            count: utahHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Utah hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Vermont hospital data directly to database
 */
export async function importVermontHospitals() {
    try {
        await connectToDatabase();
        
        // Vermont hospital data imported from separate file
        console.log(`[Import] Using imported Vermont hospital data`);

        // Find Vermont state document
        // slug "vermont"
        const vtState = await Location.findOne({ slug: 'vermont', type: 'state' });
        if (!vtState) {
            throw new Error("Vermont state not found");
        }

        console.log(`[Import] Found Vermont state: ${vtState.name}`);
        console.log(`[Import] Importing ${vermontHospitals.length} hospitals`);

        // Update Vermont state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${vermontHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = vermontHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'vermont', type: 'state' },
                { 
                    $set: { 
                        hospitals: vermontHospitals,
                        hospitalStats: {
                            count: vermontHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Vermont state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Vermont document`);
            } else {
                console.log(`[Import] Successfully updated Vermont state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${vermontHospitals.length} Vermont hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${vermontHospitals.length} Vermont hospitals`,
            count: vermontHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Vermont hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Virginia hospital data from CSV directly to database
 */
export async function importVirginiaHospitals() {
    try {
        await connectToDatabase();
        
        // Virginia hospital data imported from separate file
        console.log(`[Import] Using imported Virginia hospital data`);

        // Find Virginia state document
        // slug "virginia"
        const vaState = await Location.findOne({ slug: 'virginia', type: 'state' });
        if (!vaState) {
            throw new Error("Virginia state not found");
        }

        console.log(`[Import] Found Virginia state: ${vaState.name}`);
        console.log(`[Import] Importing ${virginiaHospitals.length} hospitals`);

        // Update Virginia state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${virginiaHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = virginiaHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'virginia', type: 'state' },
                { 
                    $set: { 
                        hospitals: virginiaHospitals,
                        hospitalStats: {
                            count: virginiaHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Virginia state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Virginia document`);
            } else {
                console.log(`[Import] Successfully updated Virginia state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${virginiaHospitals.length} Virginia hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${virginiaHospitals.length} Virginia hospitals`,
            count: virginiaHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Virginia hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Washington hospital data from CSV directly to database
 */
export async function importWashingtonHospitals() {
    try {
        await connectToDatabase();
        
        // Washington hospital data imported from separate file
        console.log(`[Import] Using imported Washington hospital data`);

        // Find Washington state document
        // slug "washington"
        const waState = await Location.findOne({ slug: 'washington', type: 'state' });
        if (!waState) {
            throw new Error("Washington state not found");
        }

        console.log(`[Import] Found Washington state: ${waState.name}`);
        console.log(`[Import] Importing ${washingtonHospitals.length} hospitals`);

        // Update Washington state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${washingtonHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = washingtonHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'washington', type: 'state' },
                { 
                    $set: { 
                        hospitals: washingtonHospitals,
                        hospitalStats: {
                            count: washingtonHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Washington state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Washington document`);
            } else {
                console.log(`[Import] Successfully updated Washington state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${washingtonHospitals.length} Washington hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${washingtonHospitals.length} Washington hospitals`,
            count: washingtonHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Washington hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import West Virginia hospital data from CSV directly to database
 */
export async function importWestVirginiaHospitals() {
    try {
        await connectToDatabase();
        
        // West Virginia hospital data imported from separate file
        console.log(`[Import] Using imported West Virginia hospital data`);

        // Find West Virginia state document
        // slug "west-virginia"
        const wvState = await Location.findOne({ slug: 'west-virginia', type: 'state' });
        if (!wvState) {
            throw new Error("West Virginia state not found");
        }

        console.log(`[Import] Found West Virginia state: ${wvState.name}`);
        console.log(`[Import] Importing ${westVirginiaHospitals.length} hospitals`);

        // Update West Virginia state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${westVirginiaHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = westVirginiaHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'west-virginia', type: 'state' },
                { 
                    $set: { 
                        hospitals: westVirginiaHospitals,
                        hospitalStats: {
                            count: westVirginiaHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No West Virginia state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to West Virginia document`);
            } else {
                console.log(`[Import] Successfully updated West Virginia state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${westVirginiaHospitals.length} West Virginia hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${westVirginiaHospitals.length} West Virginia hospitals`,
            count: westVirginiaHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing West Virginia hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Wisconsin hospital data from CSV directly to database
 */
export async function importWisconsinHospitals() {
    try {
        await connectToDatabase();
        
        // Wisconsin hospital data imported from separate file
        console.log(`[Import] Using imported Wisconsin hospital data`);

        // Find Wisconsin state document
        // slug "wisconsin"
        const wiState = await Location.findOne({ slug: 'wisconsin', type: 'state' });
        if (!wiState) {
            throw new Error("Wisconsin state not found");
        }

        console.log(`[Import] Found Wisconsin state: ${wiState.name}`);
        console.log(`[Import] Importing ${wisconsinHospitals.length} hospitals`);

        // Update Wisconsin state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${wisconsinHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = wisconsinHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'wisconsin', type: 'state' },
                { 
                    $set: { 
                        hospitals: wisconsinHospitals,
                        hospitalStats: {
                            count: wisconsinHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Wisconsin state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Wisconsin document`);
            } else {
                console.log(`[Import] Successfully updated Wisconsin state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${wisconsinHospitals.length} Wisconsin hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${wisconsinHospitals.length} Wisconsin hospitals`,
            count: wisconsinHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Wisconsin hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Wyoming hospital data from CSV directly to database
 */
export async function importWyomingHospitals() {
    try {
        await connectToDatabase();
        
        // Wyoming hospital data imported from separate file
        console.log(`[Import] Using imported Wyoming hospital data`);

        // Find Wyoming state document
        // slug "wyoming"
        const wyState = await Location.findOne({ slug: 'wyoming', type: 'state' });
        if (!wyState) {
            throw new Error("Wyoming state not found");
        }

        console.log(`[Import] Found Wyoming state: ${wyState.name}`);
        console.log(`[Import] Importing ${wyomingHospitals.length} hospitals`);

        // Update Wyoming state with hospital data using raw MongoDB to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${wyomingHospitals.length} hospitals`);
            
            // Calculate total beds from hospital data
            const totalBeds = wyomingHospitals.reduce((sum: number, h: any) => sum + (h.beds || 0), 0);
            
            // Update the document directly without Mongoose schema validation
            const updateResult = await locations.updateOne(
                { slug: 'wyoming', type: 'state' },
                { 
                    $set: { 
                        hospitals: wyomingHospitals,
                        hospitalStats: {
                            count: wyomingHospitals.length,
                            staffedBeds: totalBeds,
                            totalDischarges: 0,
                            patientDays: 0,
                            grossRevenue: "$0"
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("No Wyoming state document found to update");
            }
            
            if (updateResult.modifiedCount === 0) {
                console.log(`[Import] Warning: No changes made to Wyoming document`);
            } else {
                console.log(`[Import] Successfully updated Wyoming state document`);
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${wyomingHospitals.length} Wyoming hospitals`);

        return { 
            success: true, 
            message: `Successfully imported ${wyomingHospitals.length} Wyoming hospitals`,
            count: wyomingHospitals.length
        };

    } catch (error: any) {
        console.error("Error importing Wyoming hospitals:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

























