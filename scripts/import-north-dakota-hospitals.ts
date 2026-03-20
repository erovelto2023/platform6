import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importNorthDakotaHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting North Dakota hospital import...');
    try {
        const result = await importNorthDakotaHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
