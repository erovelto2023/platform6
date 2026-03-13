import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import NicheBox from "@/lib/db/models/NicheBox";
import { auth } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/roles";

// GET - Fetch specific niche box
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Fetch specific niche box
    const niche = await NicheBox.findOne({ nicheSlug: slug }).lean();
    if (!niche) {
      return NextResponse.json({ error: "Niche box not found" }, { status: 404 });
    }
    return NextResponse.json(niche);
  } catch (error) {
    console.error("Error fetching niche box:", error);
    return NextResponse.json(
      { error: "Failed to fetch niche box" },
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

    // Validate required fields
    if (!data.nicheName || !data.nicheSlug || !data.category) {
      return NextResponse.json(
        { error: "Missing required fields: nicheName, nicheSlug, category" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingNiche = await NicheBox.findOne({ nicheSlug: data.nicheSlug });
    if (existingNiche) {
      return NextResponse.json(
        { error: "Niche slug already exists" },
        { status: 409 }
      );
    }

    // Create new niche box
    const nicheBox = new NicheBox({
      ...data,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await nicheBox.save();
    return NextResponse.json(nicheBox, { status: 201 });
  } catch (error) {
    console.error("Error creating niche box:", error);
    return NextResponse.json(
      { error: "Failed to create niche box" },
      { status: 500 }
    );
  }
}

// PUT - Update niche box
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    // Build query
    const role = await getUserRole();
    const query: any = { nicheSlug: slug };
    
    // Only restrict to creator if NOT an admin
    if (role !== 'admin') {
      query.createdBy = userId;
    }

    // Find and update niche box
    console.log(`[PUT /api/niche-boxes/${slug}] Incoming update:`, JSON.stringify(data, null, 2));

    const nicheBox = await NicheBox.findOneAndUpdate(
      query,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!nicheBox) {
      console.log(`[PUT /api/niche-boxes/${slug}] Niche not found for update`);
      return NextResponse.json({ error: "Niche box not found" }, { status: 404 });
    }

    console.log(`[PUT /api/niche-boxes/${slug}] Updated successfully:`, nicheBox._id);
    return NextResponse.json(nicheBox);
  } catch (error) {
    console.error("Error updating niche box:", error);
    return NextResponse.json(
      { error: "Failed to update niche box" },
      { status: 500 }
    );
  }
}

// DELETE - Delete niche box
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const role = await getUserRole();
    const query: any = { nicheSlug: slug };
    
    // Only restrict to creator if NOT an admin
    if (role !== 'admin') {
      query.createdBy = userId;
    }

    // Find and delete niche box
    const nicheBox = await NicheBox.findOneAndDelete(query);

    if (!nicheBox) {
      return NextResponse.json({ error: "Niche box not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Niche box deleted successfully" });
  } catch (error) {
    console.error("Error deleting niche box:", error);
    return NextResponse.json(
      { error: "Failed to delete niche box" },
      { status: 500 }
    );
  }
}
