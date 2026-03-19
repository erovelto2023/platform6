async function test() {
    const city = "Bellevue";
    const stateSuffix = "KY";
    const cityQuery = `[out:json][timeout:15];
                (
                  node["name"="${city}"]["addr:state"="${stateSuffix}"];
                  node["name"="${city}"]["is_in:state_code"="${stateSuffix}"];
                  node["name"="${city}"][place~"city|town|village|hamlet"];
                  relation["name"="${city}"]["boundary"="administrative"]["admin_level"="8"];
                );
                out body 1;`;
    const OVERPASS_MIRROR = "https://lz4.overpass-api.de/api/interpreter";
    const cityUrl = `${OVERPASS_MIRROR}?data=${encodeURIComponent(cityQuery)}`;
    console.log("Querying:", cityUrl);
    
    const res = await fetch(cityUrl);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
}
test();
