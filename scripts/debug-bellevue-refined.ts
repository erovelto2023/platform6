async function test() {
    const city = "Bellevue";
    const stateSuffix = "KY";
    // Try to find the city center or boundary relation
    const cityQuery = `[out:json][timeout:15];
                (
                  node["name"="${city}"]["addr:state"="${stateSuffix}"];
                  node["name"="${city}"]["is_in:state"~"${stateSuffix}"];
                  relation["name"="${city}"]["boundary"="administrative"]["ISO3166-2"~"US-${stateSuffix}"];
                  relation["name"="${city}"]["boundary"="administrative"]["admin_level"="8"]["addr:state"="${stateSuffix}"];
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
