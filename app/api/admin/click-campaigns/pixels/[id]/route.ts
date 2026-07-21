import { NextRequest, NextResponse } from "next/server";
import Pixel from "@/lib/models/pixel.model";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";

// GET single pixel
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
    
    const pixel = await Pixel.findOne({ _id: params.id, userId });
    
    if (!pixel) {
      return NextResponse.json({ success: false, error: "Pixel not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: pixel }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch pixel" }, { status: 500 });
  }
}

// PUT update pixel
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
    
    const pixel = await Pixel.findOneAndUpdate(
      { _id: params.id, userId },
      { ...body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!pixel) {
      return NextResponse.json({ success: false, error: "Pixel not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: pixel }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update pixel" }, { status: 500 });
  }
}

// DELETE pixel
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
    
    const pixel = await Pixel.findOneAndDelete({ _id: params.id, userId });
    
    if (!pixel) {
      return NextResponse.json({ success: false, error: "Pixel not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: pixel }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete pixel" }, { status: 500 });
  }
}
