import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import GrooveSellTransaction from "@/lib/db/models/GrooveSellTransaction";

export async function GET() {
  try {
    await connectToDatabase();
    const transactions = await GrooveSellTransaction.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      success: true,
      transactions: JSON.parse(JSON.stringify(transactions)),
    });
  } catch (error: any) {
    console.error("Error fetching GrooveSell transactions:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch transactions" }, { status: 500 });
  }
}
