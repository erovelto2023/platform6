import { NextRequest, NextResponse } from "next/server";
import ABTest from "@/lib/models/abtest.model";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";

// GET single A/B test
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const abTest = await ABTest.findOne({ _id: params.id, userId });
    
    if (!abTest) {
      return NextResponse.json({ success: false, error: "A/B test not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: abTest }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch A/B test" }, { status: 500 });
  }
}

// PUT update A/B test
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const body = await request.json();
    
    const abTest = await ABTest.findOneAndUpdate(
      { _id: params.id, userId },
      { ...body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!abTest) {
      return NextResponse.json({ success: false, error: "A/B test not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: abTest }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update A/B test" }, { status: 500 });
  }
}

// DELETE A/B test
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const abTest = await ABTest.findOneAndDelete({ _id: params.id, userId });
    
    if (!abTest) {
      return NextResponse.json({ success: false, error: "A/B test not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: abTest }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete A/B test" }, { status: 500 });
  }
}
