import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importNewJerseyHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting New Jersey hospital import...');
    try {
        const result = await importNewJerseyHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
