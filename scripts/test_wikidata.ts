async function testWikiData() {
    console.log("Testing WikiData SPARQL for events in Albany, NY...");
    
    // Find events (Q1190554) near Albany, NY (Q24861)
    const sparql = `
SELECT ?event ?eventLabel ?date WHERE {
  ?event wdt:P31/wdt:P279* wd:Q1190554;  # Instance or subclass of event
         wdt:P131 wd:Q24861;            # Located in Albany, NY
         wdt:P585 ?date.                # Point in time
  FILTER(?date >= "2024-01-01T00:00:00Z"^^xsd:dateTime)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
LIMIT 10
    `;
    
    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
    
    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'KBusinessAcademy/1.0 (erovelto@example.com)' } });
        const data = await res.json();
        console.log("✅ WikiData results:", data.results.bindings.length);
        data.results.bindings.forEach((b: any) => {
            console.log(`- ${b.eventLabel.value} (${b.date.value})`);
        });
    } catch (e: any) {
        console.log(`  ❌ WikiData Error:`, e.message);
    }
}

testWikiData();
