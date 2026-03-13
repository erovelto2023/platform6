import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import NicheBox from "@/lib/db/models/NicheBox";
import { auth } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/roles";

// GET - Fetch all niche boxes for admin
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    // Build query - safely get role, default to 'admin' if Clerk call fails
    let role = 'admin';
    try {
      role = await getUserRole();
    } catch (roleError) {
      console.warn("[GET /api/niche-boxes] getUserRole failed, defaulting to admin view:", roleError);
    }
    
    const query: any = {};
    
    // Only restrict to creator if NOT an admin
    if (role !== 'admin') {
      query.createdBy = userId;
    }
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;

    const niches = await NicheBox.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(niches);
  } catch (error: any) {
    console.error("[GET /api/niche-boxes] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch niche boxes", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new niche box
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    // Validate required fields - only nicheName and nicheSlug are truly required
    if (!data.nicheName || !data.nicheSlug) {
      return NextResponse.json(
        { error: "Missing required fields: nicheName and nicheSlug are required" },
        { status: 400 }
      );
    }

    // Default category if not provided
    if (!data.category) {
      data.category = 'General';
    }

    // Check if slug already exists
    const existingNiche = await NicheBox.findOne({ nicheSlug: data.nicheSlug });
    if (existingNiche) {
      return NextResponse.json(
        { error: `A niche with slug "${data.nicheSlug}" already exists. Please use a different name.` },
        { status: 409 }
      );
    }

    // Ensure status defaults to published
    if (!data.status) {
      data.status = 'published';
    }

    console.log('[POST /api/niche-boxes] Creating niche:', data.nicheName, '| slug:', data.nicheSlug);

    const nicheBox = new NicheBox({
      ...data,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await nicheBox.save();
    console.log('[POST /api/niche-boxes] Saved successfully:', nicheBox._id);

    return NextResponse.json(nicheBox, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/niche-boxes] Error:', error);
    // Return validation errors clearly
    const details = error.errors 
      ? Object.entries(error.errors).map(([k, v]: [string, any]) => `${k}: ${v.message}`).join(', ')
      : error.message;
    return NextResponse.json(
      { error: "Failed to create niche box", details },
      { status: 500 }
    );
  }
}
