import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importOklahomaHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting Oklahoma hospital import...');
    try {
        const result = await importOklahomaHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
