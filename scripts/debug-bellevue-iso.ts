async function test() {
    const city = "Bellevue";
    const cityQuery = `[out:json][timeout:15];
                area["ISO3166-2"="US-KY"]->.ky;
                (
                  node["name"="${city}"][place](area.ky);
                  relation["name"="${city}"][boundary=administrative](area.ky);
                );
                out center;`;
    const OVERPASS_MIRROR = "https://lz4.overpass-api.de/api/interpreter";
    const cityUrl = `${OVERPASS_MIRROR}?data=${encodeURIComponent(cityQuery)}`;
    console.log("Querying:", cityUrl);
    
    const res = await fetch(cityUrl);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
}
test();
