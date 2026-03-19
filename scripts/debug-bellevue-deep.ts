async function test() {
    const city = "Bellevue";
    // Try to find ANY element named Bellevue in Kentucky and show its tags
    const cityQuery = `[out:json][timeout:15];
                area["name"="Kentucky"]->.ky;
                (
                  nwr["name"="${city}"](area.ky);
                  nwr["name"~"${city}"](area.ky);
                );
                out center 10;`;
    const OVERPASS_MIRROR = "https://lz4.overpass-api.de/api/interpreter";
    const cityUrl = `${OVERPASS_MIRROR}?data=${encodeURIComponent(cityQuery)}`;
    console.log("Querying:", cityUrl);
    
    const res = await fetch(cityUrl);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
}
test();
