import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importVirginiaHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting Virginia hospital import...');
    try {
        const result = await importVirginiaHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
