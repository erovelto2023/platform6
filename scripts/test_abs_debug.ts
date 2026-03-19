import "dotenv/config";

const CENSUS_API_BASE = "https://api.census.gov/data";
const API_KEY = process.env.CENSUS_API_KEY;

async function testBasic() {
    console.log("Testing basic state query with NAICS2022=00...");
    // Added NAICS2022=00 and removed FIRMPDEMP_F filter
    const url = `${CENSUS_API_BASE}/2022/abscs?get=NAME,FIRMPDEMP&for=state:56&SEX=001&VET_GROUP=001&RACE_GROUP=001&NAICS2022=00${API_KEY ? `&key=${API_KEY}` : ''}`;
    console.log(`- Fetching: ${url}`);
    
    try {
        const res = await fetch(url);
        const text = await res.text();
        console.log(`  Raw Response: ${text}`);
        
        if (res.ok) {
            const data = JSON.parse(text);
            console.log("✅ SUCCESS! Found data:", data[1]);
        } else {
            console.log(`  ❌ HTTP error! status: ${res.status}`);
        }
    } catch (e: any) {
        console.log(`  ❌ Error:`, e.message);
    }
}

testBasic();
