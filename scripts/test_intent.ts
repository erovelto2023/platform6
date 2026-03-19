async function testIntent() {
    const city = "Albany";
    console.log(`Testing Search Intent for ${city}...`);
    
    // 1. Google Autocomplete (Free)
    const autocompleteUrl = `https://suggestqueries.google.com/complete/search?client=firefox&q=best+business+to+start+in+${city}`;
    console.log(`- Fetching Autocomplete: ${autocompleteUrl}`);
    
    try {
        const res = await fetch(autocompleteUrl);
        const data = await res.json();
        console.log("✅ Autocomplete Results:", data[1]);
    } catch (e: any) {
        console.log(`  ❌ Autocomplete Error:`, e.message);
    }

    // 2. Wikipedia Pageviews (Free)
    // Get view counts for the city's main page
    const wikiUrl = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/Albany,_New_York/daily/20240301/20240315`;
    console.log(`\n- Fetching Wikipedia Trends: ${wikiUrl}`);
    
    try {
        const res = await fetch(wikiUrl);
        const data = await res.json();
        if (data.items) {
            const total = data.items.reduce((acc: number, item: any) => acc + item.views, 0);
            console.log(`✅ Wikipedia Pageviews (last 14 days): ${total}`);
        }
    } catch (e: any) {
        console.log(`  ❌ Wikipedia Error:`, e.message);
    }
}

testIntent();
