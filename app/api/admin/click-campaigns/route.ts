import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { ClickCampaign, DigitalAsset, SwipeCopy, BrandVault } from "@/models/ClickCampaign";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const campaigns = await ClickCampaign.find({ userId }).sort({ createdAt: -1 });
    const assets = await DigitalAsset.find({ userId }).sort({ createdAt: -1 });
    const copyVault = await SwipeCopy.find({ userId }).sort({ createdAt: -1 });
    const brandVault = await BrandVault.findOne({ userId });

    return NextResponse.json({
      success: true,
      campaigns,
      assets,
      copyVault,
      brandVault: brandVault || {
        brandName: "My Brand",
        brandVoice: "Empowering, authoritative, friendly, authentic",
        toneRules: "Conversational, direct, no jargon, solution-oriented",
        visualRules: "Clean typography, high contrast, warm lighting",
        targetAudienceProfile: "Aspiring entrepreneurs, side-hustlers, affiliate marketers",
        primaryColor: "#3b82f6",
        secondaryColor: "#10b981",
        accentColor: "#f59e0b"
      }
    });
  } catch (error: any) {
    console.error("Click Campaign GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { type } = body;

    if (type === "campaign") {
      const campaign = await ClickCampaign.create({
        ...body.data,
        userId,
      });
      return NextResponse.json({ success: true, campaign });
    }

    if (type === "asset") {
      const asset = await DigitalAsset.create({
        ...body.data,
        userId,
      });
      return NextResponse.json({ success: true, asset });
    }

    if (type === "copy") {
      const copyItem = await SwipeCopy.create({
        ...body.data,
        userId,
      });
      return NextResponse.json({ success: true, copyItem });
    }

    if (type === "brand") {
      const brand = await BrandVault.findOneAndUpdate(
        { userId },
        { ...body.data, userId },
        { upsert: true, new: true }
      );
      return NextResponse.json({ success: true, brand });
    }

    return NextResponse.json({ error: "Invalid type provided" }, { status: 400 });
  } catch (error: any) {
    console.error("Click Campaign POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create resource" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { type, id, data } = body;

    if (type === "campaign" && id) {
      const campaign = await ClickCampaign.findOneAndUpdate({ _id: id, userId }, data, { new: true });
      return NextResponse.json({ success: true, campaign });
    }

    if (type === "copy" && id) {
      const copyItem = await SwipeCopy.findOneAndUpdate({ _id: id, userId }, data, { new: true });
      return NextResponse.json({ success: true, copyItem });
    }

    if (type === "asset" && id) {
      const asset = await DigitalAsset.findOneAndUpdate({ _id: id, userId }, data, { new: true });
      return NextResponse.json({ success: true, asset });
    }

    return NextResponse.json({ error: "Invalid update parameter" }, { status: 400 });
  } catch (error: any) {
    console.error("Click Campaign PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update resource" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!id || !type) {
      return NextResponse.json({ error: "Missing type or id parameter" }, { status: 400 });
    }

    if (type === "campaign") {
      await ClickCampaign.deleteOne({ _id: id, userId });
    } else if (type === "asset") {
      await DigitalAsset.deleteOne({ _id: id, userId });
    } else if (type === "copy") {
      await SwipeCopy.deleteOne({ _id: id, userId });
    }

    return NextResponse.json({ success: true, message: "Item deleted successfully" });
  } catch (error: any) {
    console.error("Click Campaign DELETE error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete resource" }, { status: 500 });
  }
}
