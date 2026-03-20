import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importNorthCarolinaHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting North Carolina hospital import...');
    try {
        const result = await importNorthCarolinaHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
