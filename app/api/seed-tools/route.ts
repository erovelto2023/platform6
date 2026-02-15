import { NextResponse } from "next/server";
import { seedTools } from "@/lib/actions/tool.actions";

export async function POST() {
    try {
        const result = await seedTools();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || String(error), stack: error.stack },
            { status: 500 }
        );
    }
}
