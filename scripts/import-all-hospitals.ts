import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { 
    importArkansasHospitals,
    importAlabamaHospitals,
    importAlaskaHospitals,
    importArizonaHospitals,
    importCaliforniaHospitals,
    importColoradoHospitals,
    importConnecticutHospitals,
    importDelawareHospitals,
    importFloridaHospitals,
    importGeorgiaHospitals,
    importHawaiiHospitals,
    importIdahoHospitals,
    importIllinoisHospitals,
    importIndianaHospitals,
    importIowaHospitals,
    importKansasHospitals,
    importKentuckyHospitals,
    importLouisianaHospitals,
    importMaineHospitals,
    importMarylandHospitals,
    importMassachusettsHospitals,
    importMichiganHospitals,
    importMinnesotaHospitals,
    importMississippiHospitals,
    importMissouriHospitals,
    importMontanaHospitals,
    importNebraskaHospitals,
    importNevadaHospitals,
    importNewHampshireHospitals,
    importNewJerseyHospitals,
    importNewMexicoHospitals,
    importNewYorkHospitals,
    importNorthCarolinaHospitals,
    importNorthDakotaHospitals,
    importOhioHospitals,
    importOklahomaHospitals,
    importOregonHospitals,
    importPennsylvaniaHospitals,
    importRhodeIslandHospitals,
    importSouthCarolinaHospitals,
    importSouthDakotaHospitals,
    importTennesseeHospitals,
    importTexasHospitals,
    importUtahHospitals,
    importVermontHospitals,
    importVirginiaHospitals,
    importWashingtonHospitals,
    importWestVirginiaHospitals,
    importWisconsinHospitals,
    importWyomingHospitals
} from '../lib/actions/import-hospital-data';

async function runAllImports() {
    console.log('--- Starting Master Hospital Import (50 States) ---');
    console.log('Target DB:', process.env.MONGODB_URI?.split('@').pop());
    
    const importers = [
        { name: 'Arkansas', fn: importArkansasHospitals },
        { name: 'Alabama', fn: importAlabamaHospitals },
        { name: 'Alaska', fn: importAlaskaHospitals },
        { name: 'Arizona', fn: importArizonaHospitals },
        { name: 'California', fn: importCaliforniaHospitals },
        { name: 'Colorado', fn: importColoradoHospitals },
        { name: 'Connecticut', fn: importConnecticutHospitals },
        { name: 'Delaware', fn: importDelawareHospitals },
        { name: 'Florida', fn: importFloridaHospitals },
        { name: 'Georgia', fn: importGeorgiaHospitals },
        { name: 'Hawaii', fn: importHawaiiHospitals },
        { name: 'Idaho', fn: importIdahoHospitals },
        { name: 'Illinois', fn: importIllinoisHospitals },
        { name: 'Indiana', fn: importIndianaHospitals },
        { name: 'Iowa', fn: importIowaHospitals },
        { name: 'Kansas', fn: importKansasHospitals },
        { name: 'Kentucky', fn: importKentuckyHospitals },
        { name: 'Louisiana', fn: importLouisianaHospitals },
        { name: 'Maine', fn: importMaineHospitals },
        { name: 'Maryland', fn: importMarylandHospitals },
        { name: 'Massachusetts', fn: importMassachusettsHospitals },
        { name: 'Michigan', fn: importMichiganHospitals },
        { name: 'Minnesota', fn: importMinnesotaHospitals },
        { name: 'Mississippi', fn: importMississippiHospitals },
        { name: 'Missouri', fn: importMissouriHospitals },
        { name: 'Montana', fn: importMontanaHospitals },
        { name: 'Nebraska', fn: importNebraskaHospitals },
        { name: 'Nevada', fn: importNevadaHospitals },
        { name: 'New Hampshire', fn: importNewHampshireHospitals },
        { name: 'New Jersey', fn: importNewJerseyHospitals },
        { name: 'New Mexico', fn: importNewMexicoHospitals },
        { name: 'New York', fn: importNewYorkHospitals },
        { name: 'North Carolina', fn: importNorthCarolinaHospitals },
        { name: 'North Dakota', fn: importNorthDakotaHospitals },
        { name: 'Ohio', fn: importOhioHospitals },
        { name: 'Oklahoma', fn: importOklahomaHospitals },
        { name: 'Oregon', fn: importOregonHospitals },
        { name: 'Pennsylvania', fn: importPennsylvaniaHospitals },
        { name: 'Rhode Island', fn: importRhodeIslandHospitals },
        { name: 'South Carolina', fn: importSouthCarolinaHospitals },
        { name: 'South Dakota', fn: importSouthDakotaHospitals },
        { name: 'Tennessee', fn: importTennesseeHospitals },
        { name: 'Texas', fn: importTexasHospitals },
        { name: 'Utah', fn: importUtahHospitals },
        { name: 'Vermont', fn: importVermontHospitals },
        { name: 'Virginia', fn: importVirginiaHospitals },
        { name: 'Washington', fn: importWashingtonHospitals },
        { name: 'West Virginia', fn: importWestVirginiaHospitals },
        { name: 'Wisconsin', fn: importWisconsinHospitals },
        { name: 'Wyoming', fn: importWyomingHospitals }
    ];

    const results = [];
    for (const importer of importers) {
        console.log(`\n>>> Syncing ${importer.name}...`);
        try {
            const result = await importer.fn();
            console.log(`${importer.name} result:`, result.success ? 'SUCCESS' : 'FAILED', result.message || result.error || '');
            results.push({ name: importer.name, ...result });
        } catch (error: any) {
            console.error(`${importer.name} CRASHED:`, error.message);
            results.push({ name: importer.name, success: false, error: error.message });
        }
    }

    console.log('\n--- Final Summary ---');
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    console.log(`Total States Synced: ${results.length}`);
    console.log(`Successful: ${successful}`);
    console.log(`Failed: ${failed}`);

    if (failed > 0) {
        console.log('\nFailed States:');
        results.filter(r => !r.success).forEach(r => console.log(`- ${r.name}: ${r.error}`));
    }
    
    process.exit(0);
}

runAllImports();
