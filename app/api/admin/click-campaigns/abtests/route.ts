import { NextRequest, NextResponse } from "next/server";
import ABTest from "@/lib/models/abtest.model";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";

// GET all A/B tests
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
    
    const abTests = await ABTest.find(filter).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: abTests }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch A/B tests" }, { status: 500 });
  }
}

// POST create new A/B test
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const body = await request.json();
    body.userId = userId;
    
    const abTest = await ABTest.create(body);
    
    return NextResponse.json({ success: true, data: abTest }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create A/B test" }, { status: 500 });
  }
}
