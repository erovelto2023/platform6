import { NextRequest, NextResponse } from "next/server";
import Pixel from "@/lib/models/pixel.model";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";

// GET all pixels
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const eventType = searchParams.get("eventType");
    const platform = searchParams.get("platform");
    
    const filter: any = { userId };
    if (status) filter.status = status;
    if (eventType) filter.eventType = eventType;
    if (platform) filter.platform = platform;
    
    const pixels = await Pixel.find(filter).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: pixels }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch pixels" }, { status: 500 });
  }
}

// POST create new pixel
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const body = await request.json();
    body.userId = userId;
    
    const pixel = await Pixel.create(body);
    
    return NextResponse.json({ success: true, data: pixel }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create pixel" }, { status: 500 });
  }
}
