import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function syncExcel() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) throw new Error("MONGODB_URI not found");

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
        
        const Location = mongoose.models.Location || mongoose.model('Location', new mongoose.Schema({
            name: String,
            slug: String,
            type: String,
            hospitals: [Object],
            hospitalStats: Object
        }));

        const jsonPath = path.resolve(process.cwd(), 'excel', 'HospitaList2025_Full.json');
        if (!fs.existsSync(jsonPath)) throw new Error("JSON data not found. Run convert-excel.js first.");
        
        const excelData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        console.log(`Loaded ${excelData.length} records from Excel JSON.`);

        // Group excel data by state for faster processing
        const stateGroups: Record<string, any[]> = {};
        excelData.forEach((row: any) => {
            const state = row.STATE;
            if (!state) return;
            if (!stateGroups[state]) stateGroups[state] = [];
            stateGroups[state].push(row);
        });

        const states = await Location.find({ type: 'state' });
        console.log(`Syncing ${states.length} states...`);

        for (const state of states) {
            const stateAbbr = getStateAbbr(state.name);
            if (!stateAbbr) continue;

            const excelHospitals = stateGroups[stateAbbr] || [];
            if (excelHospitals.length === 0) {
                console.log(`[${stateAbbr}] No data in Excel for this state.`);
                continue;
            }

            let updatedCount = 0;
            let newHospitalsAdded = 0;
            const currentHospitals = [...(state.hospitals || [])];

            for (const row of excelHospitals) {
                const excelName = String(row.NAME || "").trim();
                if (!excelName) continue;

                // Try to find matching hospital in current list
                const idx = currentHospitals.findIndex(h => 
                    h.name.toLowerCase().includes(excelName.toLowerCase()) || 
                    excelName.toLowerCase().includes(h.name.toLowerCase())
                );

                const hospitalData = {
                    name: excelName,
                    city: row.CITY,
                    address: row.ADDRESS,
                    phone: row.PHONE,
                    beds: Number(row['POS CERT BEDS'] || row['POS TOT BEDS'] || 0),
                    type: row['PAY TYPE'] || row._sourceSheet,
                    zip: row.ZIP
                };

                if (idx !== -1) {
                    // Update existing
                    currentHospitals[idx] = {
                        ...currentHospitals[idx],
                        ...hospitalData,
                        // Preserve existing fields we don't have in Excel
                        website: currentHospitals[idx].website,
                        safetyGrade: currentHospitals[idx].safetyGrade,
                        safetyGradeUrl: currentHospitals[idx].safetyGradeUrl,
                    };
                    updatedCount++;
                } else {
                    // Add as new if it's a significant facility (has beds)
                    if (hospitalData.beds > 0) {
                        currentHospitals.push(hospitalData);
                        newHospitalsAdded++;
                    }
                }
            }

            if (updatedCount > 0 || newHospitalsAdded > 0) {
                const totalBeds = currentHospitals.reduce((sum, h) => sum + (Number(h.beds) || 0), 0);
                
                await Location.updateOne(
                    { _id: state._id },
                    { 
                        $set: { 
                            hospitals: currentHospitals,
                            "hospitalStats.count": currentHospitals.length,
                            "hospitalStats.staffedBeds": totalBeds
                        } 
                    }
                );
                console.log(`[${stateAbbr}] Updated ${updatedCount}, Added ${newHospitalsAdded}. Total Beds: ${totalBeds}`);
            }
        }

        console.log('Excel data synchronization complete!');
        
    } catch (error) {
        console.error('Error during sync:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

function getStateAbbr(name: string): string | null {
    const states: Record<string, string> = {
        "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
        "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
        "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
        "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
        "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
        "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
        "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
        "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
        "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
        "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
    };
    return states[name] || null;
}

syncExcel();
