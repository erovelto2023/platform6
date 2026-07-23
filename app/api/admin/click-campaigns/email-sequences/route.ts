import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { SwipeEmail, EmailTemplate } from "@/lib/models/emailSequence.model";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (type === "swipe") {
      const items = await SwipeEmail.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: items });
    }

    if (type === "templates") {
      const templates = await EmailTemplate.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: templates });
    }

    const [swipes, templates] = await Promise.all([
      SwipeEmail.find({}).sort({ createdAt: -1 }),
      EmailTemplate.find({}).sort({ createdAt: -1 }),
    ]);

    return NextResponse.json({
      success: true,
      swipeList: swipes,
      customTemplates: templates,
    });
  } catch (error: any) {
    console.error("Error fetching email sequences data:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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
    const { type, ...data } = body;

    if (type === "swipe") {
      const created = await SwipeEmail.create(data);
      return NextResponse.json({ success: true, data: created });
    }

    if (type === "template") {
      const created = await EmailTemplate.create(data);
      return NextResponse.json({ success: true, data: created });
    }

    return NextResponse.json({ success: false, error: "Invalid type parameter" }, { status: 400 });
  } catch (error: any) {
    console.error("Error creating email data:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
    }

    if (type === "swipe") {
      await SwipeEmail.findByIdAndDelete(id);
      return NextResponse.json({ success: true });
    }

    if (type === "template") {
      await EmailTemplate.findByIdAndDelete(id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid type parameter" }, { status: 400 });
  } catch (error: any) {
    console.error("Error deleting email data:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
