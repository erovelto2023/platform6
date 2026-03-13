import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import NicheBox from "@/lib/db/models/NicheBox";

// POST - Increment download count
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    await connectDB();

    // Increment download count
    const nicheBox = await NicheBox.findOneAndUpdate(
      { nicheSlug: slug, status: 'published' },
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!nicheBox) {
      return NextResponse.json({ error: "Niche box not found" }, { status: 404 });
    }

    return NextResponse.json({ downloadCount: nicheBox.downloadCount });
  } catch (error) {
    console.error("Error incrementing download count:", error);
    return NextResponse.json(
      { error: "Failed to increment download count" },
      { status: 500 }
    );
  }
}
