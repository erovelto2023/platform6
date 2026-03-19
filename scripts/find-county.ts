async function findCounty(city: string, state: string) {
    const query = `[out:json][timeout:25];
        (
          node["name"="${city}"]["addr:state"~"^(${state}|${state.substring(0,2).toUpperCase()})$"];
          way["name"="${city}"];
          relation["name"="${city}"];
        );
        is_in;
        area._["admin_level"="6"];
        out;`;
    
    const url = `https://lz4.overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    console.log("Querying Overpass for county of", city, state);
    
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Overpass failed");
        const data = await res.json();
        const counties = data.elements.filter((e: any) => e.tags && e.tags.name);
        return counties.map((c: any) => c.tags.name);
    } catch (e) {
        console.error(e);
        return [];
    }
}

findCounty("Cornettsville", "Kentucky").then(c => console.log("Found Counties:", c));
