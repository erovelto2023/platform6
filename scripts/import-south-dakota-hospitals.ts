import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importSouthDakotaHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting South Dakota hospital import...');
    try {
        const result = await importSouthDakotaHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
