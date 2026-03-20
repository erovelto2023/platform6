import { NextResponse } from "next/server";
import { importAlabamaCities, importAlaskaCities } from "@/lib/actions/import-city-education-data";

export async function POST(request: Request) {
    try {
        const { state } = await request.json();
        
        let result;
        if (state === 'alabama') {
            result = await importAlabamaCities();
        } else if (state === 'alaska') {
            result = await importAlaskaCities();
        } else {
            return NextResponse.json({ 
                success: false, 
                error: "Invalid state. Use 'alabama' or 'alaska'" 
            }, { status: 400 });
        }
        
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error?.message || "Internal server error" 
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ 
        message: "Cities Import API - POST with {state: 'alabama' or 'alaska'}" 
    });
}
