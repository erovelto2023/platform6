import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { importMontanaHospitals } from '../lib/actions/import-hospital-data';

async function runImport() {
    console.log('Starting Montana hospital import...');
    try {
        const result = await importMontanaHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
