import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importOhioHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting Ohio hospital import...');
    try {
        const result = await importOhioHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
