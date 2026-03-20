import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importWashingtonHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting Washington hospital import...');
    try {
        const result = await importWashingtonHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
