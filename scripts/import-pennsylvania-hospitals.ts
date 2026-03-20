import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importPennsylvaniaHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting Pennsylvania hospital import...');
    try {
        const result = await importPennsylvaniaHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
