import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importNebraskaHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting Nebraska hospital import...');
    try {
        const result = await importNebraskaHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
