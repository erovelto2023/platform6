
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import Business from "@/lib/db/models/Business";
import { ActionResponse } from "@/types";

/**
 * Standard utility to get the active user and their business
 * Use this in server actions to ensure a consistent context.
 */
export async function getActionContext(): Promise<ActionResponse<{ userId: string; business: any }>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();
    
    // Attempt to find the user's focus business
    // In many of our setups, this was stored as the first business or a fallback
    let business = await Business.findOne({ userId });
    
    if (!business) {
        // Fallback for "platform6" legacy: check if getOrCreateBusiness pattern should be used
        // For now, let's just create a default one if it's missing to avoid blocking devs
        business = await Business.create({
            name: "My Business",
            userId: userId,
            industry: "General",
        });
    }

    return { 
        success: true, 
        data: { 
            userId, 
            business: JSON.parse(JSON.stringify(business)) 
        } 
    };
  } catch (error: any) {
    console.error("[GET_ACTION_CONTEXT_ERROR]", error);
    return { success: false, error: "Failed to resolve workspace context" };
  }
}
