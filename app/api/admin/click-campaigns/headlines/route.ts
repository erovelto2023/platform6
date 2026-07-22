import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { HeadlinePattern, GeneratedHeadline } from "@/lib/models/headline.model";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");

    if (type === "patterns") {
      const query: any = { isActive: true };
      if (category) {
        query.category = category;
      }
      const patterns = await HeadlinePattern.find(query).sort({ name: 1 });
      return NextResponse.json({ success: true, data: patterns });
    }

    if (type === "generated") {
      const headlines = await GeneratedHeadline.find({ isSaved: true }).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: headlines });
    }

    return NextResponse.json({ success: false, error: "Invalid type parameter" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching headline data:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const { type, patternId, headline, inputs, platform, campaignId, tags } = body;

    if (type === "generated") {
      const generatedHeadline = await GeneratedHeadline.create({
        patternId,
        patternName: body.patternName,
        headline,
        inputs,
        platform,
        campaignId,
        isSaved: true,
        tags: tags || [],
      });
      return NextResponse.json({ success: true, data: generatedHeadline });
    }

    if (type === "pattern") {
      const pattern = await HeadlinePattern.create(body);
      return NextResponse.json({ success: true, data: pattern });
    }

    return NextResponse.json({ success: false, error: "Invalid type parameter" }, { status: 400 });
  } catch (error) {
    console.error("Error creating headline data:", error);
    return NextResponse.json({ success: false, error: "Failed to create data" }, { status: 500 });
  }
}
