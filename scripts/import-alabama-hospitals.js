const { importAlabamaHospitals } = require('../lib/actions/import-hospital-data');

async function runImport() {
    console.log('Starting Alabama hospital import...');
    try {
        const result = await importAlabamaHospitals();
        console.log('Import result:', result);
    } catch (error) {
        console.error('Import failed:', error);
    }
}

runImport();
