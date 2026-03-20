import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { HospitalService } from '../lib/services/hospital.service';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function syncDetails() {
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

        const states = await Location.find({ type: 'state' });
        console.log(`Checking ${states.length} states for hospital detail updates...`);

        for (const state of states) {
            const stateName = state.name;
            const stateAbbr = getStateAbbr(stateName);
            
            if (!stateAbbr) continue;

            const sampleData = HospitalService.getSampleHospitalData(stateAbbr);
            if (!sampleData || !sampleData.hospitals) continue;

            let updatedCount = 0;
            const currentHospitals = [...state.hospitals];

            for (const details of sampleData.hospitals) {
                // Try to find matching hospital by name
                const idx = currentHospitals.findIndex(h => 
                    h.name.toLowerCase().includes(details.name.toLowerCase()) || 
                    details.name.toLowerCase().includes(h.name.toLowerCase())
                );

                if (idx !== -1) {
                    // Update existing hospital with more details
                    currentHospitals[idx] = {
                        ...currentHospitals[idx],
                        beds: details.beds,
                        safetyGrade: details.safetyGrade,
                        type: details.type || currentHospitals[idx].type,
                        address: details.address || currentHospitals[idx].address,
                        phone: details.phone || currentHospitals[idx].phone,
                        website: details.website || currentHospitals[idx].website,
                        safetyGradeUrl: details.safetyGradeUrl
                    };
                    updatedCount++;
                }
            }

            if (updatedCount > 0) {
                console.log(`[${stateAbbr}] Updated ${updatedCount} hospitals with detailed info (beds/grades).`);
                
                // Also update the state-wide stats if they improved
                const totalBeds = currentHospitals.reduce((sum, h) => sum + (h.beds || 0), 0);
                
                await Location.updateOne(
                    { _id: state._id },
                    { 
                        $set: { 
                            hospitals: currentHospitals,
                            "hospitalStats.staffedBeds": totalBeds
                        } 
                    }
                );
            }
        }

        console.log('Hospital detail sync complete!');
        
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

syncDetails();
