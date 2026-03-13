import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import NicheBox from "@/lib/db/models/NicheBox";

// GET - Fetch all published niche boxes for public catalog
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const competition = searchParams.get('competition');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    // Build query for published niche boxes
    const query: any = { status: 'published' };
    
    if (category) query.category = category;
    if (competition) query.competition = competition;
    if (featured === 'true') query.featured = true;

    // Execute query with optional limit
    let nicheBoxesQuery = NicheBox.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .select('nicheName nicheSlug category competition marketSize growthRate status featured downloadCount createdAt updatedAt research keywords phases');
    
    if (limit) {
      nicheBoxesQuery = nicheBoxesQuery.limit(parseInt(limit));
    }

    const nicheBoxes = await nicheBoxesQuery.lean();

    return NextResponse.json(nicheBoxes);
  } catch (error) {
    console.error("Error fetching public niche boxes:", error);
    return NextResponse.json(
      { error: "Failed to fetch niche boxes" },
      { status: 500 }
    );
  }
}
