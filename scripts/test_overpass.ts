async function testOverpass() {
    console.log("Testing Overpass API for Albany, NY (Gyms)...");
    
    // Query to find gyms in Albany, NY
    // admin_level 8 is typically city/town
    const query = `
      [out:json][timeout:25];
      area["name"="Albany"]["ISO3166-2"="US-NY"]->.searchArea;
      (
        node["leisure"="fitness_centre"](area.searchArea);
        way["leisure"="fitness_centre"](area.searchArea);
        node["amenity"="gym"](area.searchArea);
      );
      out count;
    `;
    
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    console.log(`- Fetching: ${url}`);
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log("✅ SUCCESS! Response:", JSON.stringify(data, null, 2));
        
        if (data.elements && data.elements[0]) {
            const count = data.elements[0].tags.total;
            console.log(`- Total Gyms found in Albany: ${count}`);
        }
    } catch (e: any) {
        console.log(`  ❌ Error:`, e.message);
    }
}

testOverpass();
