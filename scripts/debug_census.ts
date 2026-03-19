async function debug() {
    const stateFips = "09"; // Connecticut
    const year = "2022";
    
    // Try Place
    const placeUrl = `https://api.census.gov/data/${year}/acs/acs5?get=NAME&for=place:*&in=state:${stateFips}`;
    const resPlace = await fetch(placeUrl);
    const dataPlace = await resPlace.json();
    const matchPlace = dataPlace.find(r => r[0].toLowerCase().includes("barkhamsted"));
    console.log("Place match:", matchPlace);

    // Try County Subdivision
    const cousubUrl = `https://api.census.gov/data/${year}/acs/acs5?get=NAME&for=county%20subdivision:*&in=state:${stateFips}`;
    const resCousub = await fetch(cousubUrl);
    const dataCousub = await resCousub.json();
    const matchCousub = dataCousub.find(r => r[0].toLowerCase().includes("barkhamsted"));
    console.log("COUSUB match:", matchCousub);
}

debug();
