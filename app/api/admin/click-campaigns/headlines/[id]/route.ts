import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { GeneratedHeadline } from "@/lib/models/headline.model";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const headline = await GeneratedHeadline.findById(id);
    if (!headline) {
      return NextResponse.json({ success: false, error: "Headline not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: headline });
  } catch (error) {
    console.error("Error fetching headline:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch headline" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const body = await req.json();
    const headline = await GeneratedHeadline.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!headline) {
      return NextResponse.json({ success: false, error: "Headline not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: headline });
  } catch (error) {
    console.error("Error updating headline:", error);
    return NextResponse.json({ success: false, error: "Failed to update headline" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const headline = await GeneratedHeadline.findByIdAndDelete(id);
    if (!headline) {
      return NextResponse.json({ success: false, error: "Headline not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Headline deleted successfully" });
  } catch (error) {
    console.error("Error deleting headline:", error);
    return NextResponse.json({ success: false, error: "Failed to delete headline" }, { status: 500 });
  }
}
