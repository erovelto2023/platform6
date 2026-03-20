import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importMissouriHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting Missouri hospital import...');
    try {
        const result = await importMissouriHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
