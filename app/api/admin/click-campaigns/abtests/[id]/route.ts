import { NextRequest, NextResponse } from "next/server";
import ABTest from "@/lib/models/abtest.model";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";

// GET single A/B test
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    
    const abTest = await ABTest.findOne({ _id: id, userId });
    
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    await dbConnect();
    
    const abTest = await ABTest.findOneAndUpdate(
      { _id: id, userId },
      { ...body },
      { new: true, runValidators: true }
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    
    const abTest = await ABTest.findOneAndDelete({ _id: id, userId });
    
    if (!abTest) {
      return NextResponse.json({ success: false, error: "A/B test not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "A/B test deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete A/B test" }, { status: 500 });
  }
}
