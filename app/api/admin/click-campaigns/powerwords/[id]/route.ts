import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { PowerWord } from "@/lib/models/powerWords.model";

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
    const powerWord = await PowerWord.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!powerWord) {
      return NextResponse.json({ success: false, error: "Power word not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: powerWord });
  } catch (error) {
    console.error("Error updating power word:", error);
    return NextResponse.json({ success: false, error: "Failed to update power word" }, { status: 500 });
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

    const powerWord = await PowerWord.findByIdAndDelete(id);
    if (!powerWord) {
      return NextResponse.json({ success: false, error: "Power word not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: powerWord });
  } catch (error) {
    console.error("Error deleting power word:", error);
    return NextResponse.json({ success: false, error: "Failed to delete power word" }, { status: 500 });
  }
}
