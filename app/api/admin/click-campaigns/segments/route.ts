import { NextRequest, NextResponse } from "next/server";
import AudienceSegment from "@/lib/models/audienceSegment.model";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";

// GET all audience segments
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    
    const filter: any = { userId };
    if (status) filter.status = status;
    if (type) filter.type = type;
    
    const segments = await AudienceSegment.find(filter).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: segments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch audience segments" }, { status: 500 });
  }
}

// POST create new audience segment
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const body = await request.json();
    body.userId = userId;
    
    const segment = await AudienceSegment.create(body);
    
    return NextResponse.json({ success: true, data: segment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create audience segment" }, { status: 500 });
  }
}
