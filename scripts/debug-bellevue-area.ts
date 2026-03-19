async function test() {
    const city = "Bellevue";
    const state = "Kentucky";
    const cityQuery = `[out:json][timeout:15];
                area["name"="${state}"]->.s;
                (
                  node["name"="${city}"](area.s);
                  way["name"="${city}"](area.s);
                  relation["name"="${city}"](area.s);
                );
                out center 1;`;
    const OVERPASS_MIRROR = "https://lz4.overpass-api.de/api/interpreter";
    const cityUrl = `${OVERPASS_MIRROR}?data=${encodeURIComponent(cityQuery)}`;
    console.log("Querying:", cityUrl);
    
    const res = await fetch(cityUrl);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
}
test();
