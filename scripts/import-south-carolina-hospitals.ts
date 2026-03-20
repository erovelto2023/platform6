import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importSouthCarolinaHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting South Carolina hospital import...');
    try {
        const result = await importSouthCarolinaHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
