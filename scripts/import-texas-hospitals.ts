import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importTexasHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting Texas hospital import...');
    try {
        const result = await importTexasHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
