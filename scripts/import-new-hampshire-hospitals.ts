import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importNewHampshireHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting New Hampshire hospital import...');
    try {
        const result = await importNewHampshireHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
