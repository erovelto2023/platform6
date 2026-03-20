import { importArizonaHospitals } from '../lib/actions/import-hospital-data';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
    console.log("Starting Arizona hospital import...");
    const result = await importArizonaHospitals();
    console.log("Import result:", result);
    process.exit(result.success ? 0 : 1);
}

run().catch(err => {
    console.error("Unhandle error during import:", err);
    process.exit(1);
});
