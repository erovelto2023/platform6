import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importVermontHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting Vermont hospital import...');
    try {
        const result = await importVermontHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
