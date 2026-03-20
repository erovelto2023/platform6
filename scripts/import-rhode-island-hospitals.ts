import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importRhodeIslandHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting Rhode Island hospital import...');
    try {
        const result = await importRhodeIslandHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
