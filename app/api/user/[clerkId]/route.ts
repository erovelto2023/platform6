import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ clerkId: string }> }
) {
    try {
        const { clerkId } = await params;

        await connectToDatabase();

        const user = await User.findOne({ clerkId }).lean();

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(JSON.parse(JSON.stringify(user)));
    } catch (error) {
        console.error("[GET_USER]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
