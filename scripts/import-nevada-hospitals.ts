import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importNevadaHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting Nevada hospital import...');
    try {
        const result = await importNevadaHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
