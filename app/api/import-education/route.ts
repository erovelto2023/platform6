import { NextResponse } from "next/server";
import { importAlabamaEducation, importAlaskaEducation } from "@/lib/actions/import-city-education-data";

export async function POST(request: Request) {
    try {
        const { state } = await request.json();
        
        let result;
        if (state === 'alabama') {
            result = await importAlabamaEducation();
        } else if (state === 'alaska') {
            result = await importAlaskaEducation();
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
        message: "Education Import API - POST with {state: 'alabama' or 'alaska'}" 
    });
}
