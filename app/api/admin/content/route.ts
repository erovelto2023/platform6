import { NextResponse } from "next/server";
import { getAdminContentData } from "@/lib/actions/dashboard.actions";

export async function GET() {
    const data = await getAdminContentData();
    if ("error" in data) return NextResponse.json({ error: data.error }, { status: 403 });
    return NextResponse.json(data);
}
