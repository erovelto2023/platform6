import { getLocation } from "./lib/actions/location.actions";

async function run() {
    console.log("Fetching alabama...");
    const state = await getLocation("alabama");
    if (!state) {
        console.log("No state returned for slug 'alabama'");
    } else {
        console.log("State name:", state.name);
        console.log("extendedFacts undefined?", state.extendedFacts === undefined);
        console.log("extendedFacts count:", state.extendedFacts?.length);
    }
    process.exit(0);
}

run();
