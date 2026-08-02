"use server";

import connectDB from "@/lib/db/connect";
import GrooveSellProduct from "@/lib/db/models/GrooveSellProduct";
import User from "@/lib/db/models/User";
import { currentUser } from "@clerk/nextjs/server";

export async function getGrooveSellProducts() {
  try {
    await connectDB();
    const products = await GrooveSellProduct.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    return { success: true, products: JSON.parse(JSON.stringify(products)) };
  } catch (error: any) {
    console.error("Failed to fetch GrooveSell products:", error);
    return { success: false, error: error.message || "Failed to fetch products" };
  }
}

export async function getUnlockedProductsForUser() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return { success: false, error: "Not authenticated" };

    await connectDB();
    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) return { success: false, products: [] };

    const activeProductIds = user.activeGrooveSellProducts || [];
    const hasAccessIds = user.hasAccess || [];
    const allAccessIds = Array.from(new Set([...activeProductIds, ...hasAccessIds]));

    const unlockedProducts = await GrooveSellProduct.find({
      $or: [
        { productId: { $in: allAccessIds } },
        ...(user.role === "admin" ? [{ isActive: true }] : [])
      ]
    }).lean();

    return {
      success: true,
      userRole: user.role,
      membershipStatus: user.membershipStatus || "free",
      unlockedProducts: JSON.parse(JSON.stringify(unlockedProducts)),
    };
  } catch (error: any) {
    console.error("Failed to fetch unlocked products for user:", error);
    return { success: false, error: error.message || "Failed to fetch user products" };
  }
}

export async function createOrUpdateGrooveSellProduct(data: {
  _id?: string;
  productId: string;
  title: string;
  description?: string;
  productType: "book" | "app" | "course" | "template" | "membership" | "upsell";
  price: number;
  grooveSellCheckoutUrl?: string;
  accessUrl?: string;
  coverImage?: string;
  badgeText?: string;
  isActive?: boolean;
}) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return { success: false, error: "Not authenticated" };

    await connectDB();
    let product;
    if (data._id) {
      product = await GrooveSellProduct.findByIdAndUpdate(data._id, { $set: data }, { new: true });
    } else {
      product = await GrooveSellProduct.findOneAndUpdate(
        { productId: data.productId },
        { $set: data },
        { new: true, upsert: true }
      );
    }

    return { success: true, product: JSON.parse(JSON.stringify(product)) };
  } catch (error: any) {
    console.error("Failed to save GrooveSell product:", error);
    return { success: false, error: error.message || "Failed to save product" };
  }
}

export async function deleteGrooveSellProduct(productId: string) {
  try {
    await connectDB();
    await GrooveSellProduct.findOneAndDelete({ productId });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete GrooveSell product:", error);
    return { success: false, error: error.message || "Failed to delete product" };
  }
}

export async function seedSampleGrooveSellProducts() {
  try {
    await connectDB();
    const samples = [
      {
        productId: "book_scale_action_plan",
        title: "Scale.gg Action Plan & Digital Business Playbook",
        description: "The complete step-by-step master guide for building high-ticket digital products, sales funnels, and Hostinger webhooks.",
        productType: "book",
        price: 27.00,
        grooveSellCheckoutUrl: "https://groove.cm/checkout/book_scale_action_plan",
        accessUrl: "/docs/My-Scale-Plan (1).docx",
        badgeText: "eBook & Master Plan",
        isActive: true,
      },
      {
        productId: "app_plr_dissector_pro",
        title: "PLR Dissector Pro Tool Access",
        description: "Unlimited AI pipeline access to deconstruct PLR packages into 10-step marketing hooks, email sequences, and offer multipliers.",
        productType: "app",
        price: 47.00,
        grooveSellCheckoutUrl: "https://groove.cm/checkout/app_plr_dissector_pro",
        accessUrl: "/tools/plr-dissector",
        badgeText: "App Software",
        isActive: true,
      },
      {
        productId: "template_swipe_file_vault",
        title: "High-Converting Sales Copy & Email Swipe Vault",
        description: "50+ plug-and-play email sequences, VSL scripts, and sales page templates ready for instant customization.",
        productType: "template",
        price: 19.00,
        grooveSellCheckoutUrl: "https://groove.cm/checkout/template_swipe_file_vault",
        accessUrl: "/admin/click-campaigns?tab=swipe",
        badgeText: "Copy Templates",
        isActive: true,
      },
      {
        productId: "course_masterclass_997",
        title: "6-Figure Knowledge Asset Accelerator Workshop",
        description: "4-week intensive workshop covering product creation, GrooveSell checkout setup, and automated traffic silos.",
        productType: "course",
        price: 297.00,
        grooveSellCheckoutUrl: "https://groove.cm/checkout/course_masterclass_997",
        accessUrl: "/catalog",
        badgeText: "Masterclass",
        isActive: true,
      }
    ];

    for (const sample of samples) {
      await GrooveSellProduct.findOneAndUpdate(
        { productId: sample.productId },
        { $set: sample },
        { upsert: true, new: true }
      );
    }

    const all = await GrooveSellProduct.find({}).lean();
    return { success: true, count: all.length, products: JSON.parse(JSON.stringify(all)) };
  } catch (error: any) {
    console.error("Failed to seed sample products:", error);
    return { success: false, error: error.message || "Failed to seed sample products" };
  }
}
