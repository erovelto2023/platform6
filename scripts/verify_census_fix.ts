import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
import { CensusService } from "../lib/services/census.service";

async function verify() {
    console.log("Verifying Barkhamsted, CT...");
    const data = await CensusService.getCityDemographics("Barkhamsted", "connecticut");
    if (data) {
        console.log("SUCCESS! Found data for Barkhamsted.");
        console.log("Population:", data.population);
        console.log("Median Income:", data.medianIncome);
    } else {
        console.error("FAILED! Still no data for Barkhamsted.");
    }

    console.log("\nVerifying Birmingham, AL (Standard Place)...");
    const bham = await CensusService.getCityDemographics("Birmingham", "alabama");
    if (bham) {
        console.log("SUCCESS! Standard place still works.");
    } else {
        console.error("FAILED! Broken standard place matching.");
    }
    
    process.exit(0);
}

verify();
