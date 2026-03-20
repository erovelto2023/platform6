import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importWestVirginiaHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting West Virginia hospital import...');
    try {
        const result = await importWestVirginiaHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
