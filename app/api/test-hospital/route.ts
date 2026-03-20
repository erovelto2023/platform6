import { NextResponse } from "next/server";

export async function POST() {
    try {
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            // Test with just one hospital
            const testHospital = {
                name: "Test Hospital",
                address: "123 Test Street, Test City, AL 12345",
                website: "https://test.com",
                phone: "(555) 123-4567",
                city: "Test City",
                state: "AL",
                type: "Test Type",
                beds: 100,
                safetyGrade: "A",
                url: "",
                safetyGradeUrl: ""
            };
            
            console.log(`[Test] About to update with 1 test hospital`);
            
            const updateResult = await locations.updateOne(
                { slug: 'alabama', type: 'state' },
                { 
                    $set: { 
                        hospitals: [testHospital],
                        hospitalStats: {
                            count: 1,
                            totalBeds: 100,
                            avgSafetyGrade: "A"
                        }
                    }
                }
            );

            console.log(`[Test] MongoDB update result:`, updateResult);
            
            // Verify the update
            const updatedDoc = await locations.findOne({ slug: 'alabama', type: 'state' });
            console.log(`[Test] After update - hospitals type:`, typeof updatedDoc?.hospitals);
            console.log(`[Test] After update - hospitals length:`, updatedDoc?.hospitals?.length || 0);
            console.log(`[Test] After update - first hospital:`, updatedDoc?.hospitals?.[0]?.name || 'None');
            
            return NextResponse.json({
                success: true,
                updateResult,
                hospitalsType: typeof updatedDoc?.hospitals,
                hospitalsLength: updatedDoc?.hospitals?.length || 0,
                firstHospital: updatedDoc?.hospitals?.[0]?.name || 'None'
            });

        } finally {
            await client.close();
        }
        
    } catch (error: any) {
        console.error("Test error:", error);
        return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
    }
}
