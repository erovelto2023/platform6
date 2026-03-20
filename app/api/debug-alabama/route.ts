import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import Location from "@/lib/db/models/Location";

export async function GET() {
    try {
        await connectToDatabase();
        
        const alabamaState = await Location.findOne({ slug: 'alabama', type: 'state' });
        
        if (!alabamaState) {
            return NextResponse.json({ error: "Alabama state not found" }, { status: 404 });
        }

        // Get raw data using MongoDB driver to bypass Mongoose
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        let rawDoc = null;
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            rawDoc = await locations.findOne({ slug: 'alabama', type: 'state' });
        } finally {
            await client.close();
        }

        return NextResponse.json({
            name: alabamaState.name,
            hospitalsCount: alabamaState.hospitals?.length || 0,
            hasHospitalStats: !!alabamaState.hospitalStats,
            firstHospital: alabamaState.hospitals?.[0] || null,
            educationalInstitutionsCount: alabamaState.educationalInstitutions?.length || 0,
            // Show first few hospitals for debugging
            sampleHospitals: alabamaState.hospitals?.slice(0, 3) || [],
            // Raw data from MongoDB
            rawHospitals: rawDoc?.hospitals,
            rawHospitalsType: typeof rawDoc?.hospitals,
            rawHospitalsLength: rawDoc?.hospitals?.length || 0,
            rawHospitalStats: rawDoc?.hospitalStats
        });
        
    } catch (error: any) {
        console.error("Debug error:", error);
        return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
    }
}
