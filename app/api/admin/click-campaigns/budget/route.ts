import { NextRequest, NextResponse } from "next/server";
import BudgetOptimization from "@/lib/models/budgetOptimization.model";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";

// GET all budget optimizations
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    
    const filter: any = { userId };
    if (status) filter.status = status;
    
    const optimizations = await BudgetOptimization.find(filter).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: optimizations }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch budget optimizations" }, { status: 500 });
  }
}

// POST create new budget optimization
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const body = await request.json();
    body.userId = userId;
    
    const optimization = await BudgetOptimization.create(body);
    
    return NextResponse.json({ success: true, data: optimization }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create budget optimization" }, { status: 500 });
  }
}
