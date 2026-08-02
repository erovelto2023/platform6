import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import GrooveSellTransaction from "@/lib/db/models/GrooveSellTransaction";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const secretQuery = searchParams.get("secret") || searchParams.get("token");
    const configuredSecret = process.env.GROOVESELL_WEBHOOK_SECRET;

    // Optional secret verification if GROOVESELL_WEBHOOK_SECRET is set
    if (configuredSecret && secretQuery !== configuredSecret) {
      const headerSecret = req.headers.get("x-groovesell-secret");
      if (headerSecret !== configuredSecret) {
        console.warn("⚠️ Unauthorized GrooveSell webhook attempt (Invalid secret token)");
        return NextResponse.json({ error: "Unauthorized. Secret token mismatch." }, { status: 401 });
      }
    }

    const payload = await req.json();

    // Standardize incoming GrooveSell fields
    const rawEvent = (payload.event || payload.event_type || payload.type || "PURCHASE").toString().toUpperCase();
    const transactionId = (payload.trans_id || payload.transaction_id || payload.id || `GS_${Date.now()}`).toString();
    const buyerEmail = (payload.customer_email || payload.email || payload.buyer_email || "").toLowerCase().trim();
    const firstName = payload.customer_first_name || payload.first_name || payload.buyer_first_name || "";
    const lastName = payload.customer_last_name || payload.last_name || payload.buyer_last_name || "";
    const productId = (payload.product_id || payload.item_id || payload.productId || "groovesell_main").toString();
    const productName = payload.product_name || payload.item_name || payload.productName || "Digital Membership";
    const amount = Number(payload.price || payload.amount || payload.total || 0);
    const currency = payload.currency || "USD";

    if (!buyerEmail) {
      return NextResponse.json({ error: "Missing customer email in webhook payload" }, { status: 400 });
    }

    console.log(`⚡ Received GrooveSell Webhook [${rawEvent}] for ${buyerEmail} (Product: ${productName})`);

    // Determine normalized event state
    const isPurchase = rawEvent.includes("PURCHASE") || rawEvent.includes("REBILL") || rawEvent.includes("COMPLETED");
    const isRefund = rawEvent.includes("REFUND");
    const isCancel = rawEvent.includes("CANCEL") || rawEvent.includes("FAILED");

    let status = "completed";
    if (isRefund) status = "refunded";
    if (isCancel) status = "cancelled";

    // 1. Log Transaction in MongoDB
    await GrooveSellTransaction.create({
      transactionId,
      event: rawEvent,
      buyerEmail,
      buyerName: `${firstName} ${lastName}`.trim() || buyerEmail.split("@")[0],
      productId,
      productName,
      amount,
      currency,
      status,
      rawPayload: payload,
    });

    // 2. Find or Provision User in MongoDB
    let user = await User.findOne({ email: buyerEmail });

    if (!user && isPurchase) {
      // Provision user for new buyer
      user = await User.create({
        clerkId: `gs_user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        email: buyerEmail,
        firstName,
        lastName,
        role: "student",
        membershipStatus: "active",
        grooveSellCustomerId: payload.customer_id || transactionId,
        activeGrooveSellProducts: [productId],
        hasAccess: [productId, "groovesell_member"],
      });
      console.log(`✅ Provisioned new member account for ${buyerEmail} via GrooveSell`);
    } else if (user) {
      if (isPurchase) {
        user.role = "student";
        user.membershipStatus = "active";
        if (!user.activeGrooveSellProducts?.includes(productId)) {
          user.activeGrooveSellProducts.push(productId);
        }
        if (!user.hasAccess?.includes(productId)) {
          user.hasAccess.push(productId);
        }
        if (!user.hasAccess?.includes("groovesell_member")) {
          user.hasAccess.push("groovesell_member");
        }
        await user.save();
        console.log(`✅ Upgraded membership status to ACTIVE for ${buyerEmail}`);
      } else if (isRefund || isCancel) {
        user.activeGrooveSellProducts = (user.activeGrooveSellProducts || []).filter((p: string) => p !== productId);
        user.hasAccess = (user.hasAccess || []).filter((p: string) => p !== productId);

        if ((user.activeGrooveSellProducts || []).length === 0) {
          user.membershipStatus = isRefund ? "refunded" : "cancelled";
          user.role = "free";
          user.hasAccess = (user.hasAccess || []).filter((p: string) => p !== "groovesell_member");
        }
        await user.save();
        console.log(`⚠️ Updated membership status to ${user.membershipStatus} for ${buyerEmail}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `GrooveSell webhook processed for ${buyerEmail}`,
      transactionId,
      event: rawEvent,
      status,
      userStatus: user ? user.membershipStatus : "unregistered",
    });

  } catch (error: any) {
    console.error("❌ GrooveSell Webhook Processing Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process GrooveSell webhook payload" },
      { status: 500 }
    );
  }
}
