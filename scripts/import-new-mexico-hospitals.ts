import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importNewMexicoHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting New Mexico hospital import...');
    try {
        const result = await importNewMexicoHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
