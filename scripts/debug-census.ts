import { CensusService } from "../lib/services/census.service";

async function test() {
    const city = "Cornettsville";
    const state = "Kentucky";
    console.log(`Searching Census data for ${city}, ${state}...`);
    
    // We'll also try a few variations in the debug script
    const data = await CensusService.getCityDemographics(city, state);
    if (data) {
        console.log("Success! Population:", data.population);
    } else {
        console.log("Failed to find city in standard tables.");
    }
}
test();
