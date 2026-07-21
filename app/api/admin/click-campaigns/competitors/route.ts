import { NextRequest, NextResponse } from "next/server";
import CompetitorIntel from "@/lib/models/competitorIntel.model";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";

// GET all competitor intelligence data
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    
    const filter: any = { userId };
    if (status) filter.status = status;
    
    const competitors = await CompetitorIntel.find(filter).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: competitors }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch competitor intelligence" }, { status: 500 });
  }
}

// POST create new competitor intelligence entry
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const body = await request.json();
    body.userId = userId;
    
    const competitor = await CompetitorIntel.create(body);
    
    return NextResponse.json({ success: true, data: competitor }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create competitor intelligence" }, { status: 500 });
  }
}
