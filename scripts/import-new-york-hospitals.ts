import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importNewYorkHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting New York hospital import...');
    try {
        const result = await importNewYorkHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
