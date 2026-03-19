import "dotenv/config";

const CENSUS_API_BASE = "https://api.census.gov/data";
const API_KEY = process.env.CENSUS_API_KEY;

async function fetchGroup(geoParam: string, sex = "001", vet = "001", race = "001", eth = "001") {
    const year = "2022";
    const url = `${CENSUS_API_BASE}/${year}/abscs?get=NAME,FIRMPDEMP&for=${geoParam}&SEX=${sex}&VET_GROUP=${vet}&RACE_GROUP=${race}&ETH_GROUP=${eth}&NAICS2022=00${API_KEY ? `&key=${API_KEY}` : ''}`;
    
    try {
        const res = await fetch(url);
        if (!res.ok) return 0;
        const data = await res.json();
        if (!data || data.length < 2) return 0;
        return parseInt(data[1][1]) || 0;
    } catch (e: any) {
        return 0;
    }
}

async function testABS() {
    const stateFips = "56"; // Wyoming
    const placeFips = "75440"; // Teton Village
    
    console.log("Testing ABS for Wyoming State level...");
    const total = await fetchGroup(`state:${stateFips}`);
    if (total > 0) {
        console.log(`✅ Success! Found ${total} firms in Wyoming.`);
        const women = await fetchGroup(`state:${stateFips}`, "002");
        console.log(`- Women-owned firms: ${women} (${Math.round(women/total*100)}%)`);
    } else {
        console.log("❌ Failed to find data for Wyoming. API might still be blocking or year/dataset mismatch.");
    }
}

testABS();
