import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importTennesseeHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting Tennessee hospital import...');
    try {
        const result = await importTennesseeHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
