"use server";

import connectToDatabase from "@/lib/db/connect";
import DirectoryProduct from "@/lib/db/models/DirectoryProduct";
import { revalidatePath } from "next/cache";

export async function getDirectoryProducts() {
    try {
        await connectToDatabase();
        const products = await DirectoryProduct.find({}).sort({ name: 1 }).lean();
        return { products: JSON.parse(JSON.stringify(products)) };
    } catch (e) {
        console.error("Failed to fetch directory products", e);
        return { products: [] };
    }
}

export async function getDirectoryProductBySlug(slug: string) {
    try {
        await connectToDatabase();
        const product = await DirectoryProduct.findOne({ slug }).lean();
        if (!product) return { product: null };
        return { product: JSON.parse(JSON.stringify(product)) };
    } catch (e) {
        console.error("Failed to fetch product by slug", e);
        return { product: null };
    }
}

export async function createDirectoryProduct(data: any) {
    try {
        await connectToDatabase();
        
        // Simple ID generation
        const lastProduct = await DirectoryProduct.findOne().sort({ id: -1 });
        const nextId = lastProduct ? lastProduct.id + 1 : 1;

        // Generate slug from name if not provided
        let slug = data.slug;
        if (!slug && data.name) {
            const { slugify, makeUniqueSlug } = await import('@/lib/utils/slugify');
            const baseSlug = slugify(data.name);
            const existingProducts = await DirectoryProduct.find({}, { slug: 1 }).lean();
            const existingSlugs = existingProducts.map((p: any) => p.slug).filter(Boolean);
            slug = makeUniqueSlug(baseSlug, existingSlugs);
        }

        const newProduct = await DirectoryProduct.create({
            ...data,
            id: nextId,
            slug,
            rating: 0,
            reviewsCount: 0,
            userReviews: []
        });

        revalidatePath('/admin/directory-products');
        return { success: true, product: JSON.parse(JSON.stringify(newProduct)) };
    } catch (error: any) {
        console.error("Error creating directory product:", error);
        return { error: error.message || "Failed to create product" };
    }
}

export async function updateDirectoryProduct(data: any) {
    try {
        await connectToDatabase();

        if (data.name && !data.slug) {
            const { slugify, makeUniqueSlug } = await import('@/lib/utils/slugify');
            const baseSlug = slugify(data.name);
            const existingProducts = await DirectoryProduct.find({ id: { $ne: data.id } }, { slug: 1 }).lean();
            const existingSlugs = existingProducts.map((p: any) => p.slug).filter(Boolean);
            data.slug = makeUniqueSlug(baseSlug, existingSlugs);
        }

        await DirectoryProduct.findOneAndUpdate({ id: data.id }, data);
        revalidatePath('/admin/directory-products');
        return { success: true };
    } catch (error: any) {
        console.error("Error updating directory product:", error);
        return { error: error.message || "Failed to update product" };
    }
}

export async function deleteDirectoryProduct(productId: number) {
    try {
        await connectToDatabase();
        await DirectoryProduct.findOneAndDelete({ id: productId });
        revalidatePath('/admin/directory-products');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting directory product:', error);
        return { error: error.message || "Failed to delete product" };
    }
}

export async function trackDirectoryProductClick(productId: number) {
    try {
        await connectToDatabase();
        await DirectoryProduct.findOneAndUpdate({ id: productId }, { $inc: { clicks: 1 } });
    } catch (e) {
        console.error("Tracking click failed", e);
    }
}

export async function addDirectoryProductReview(productId: number, review: { user: string, rating: number, comment: string }) {
    try {
        await connectToDatabase();
        
        const newReview = {
            ...review,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            isApproved: false, // Require admin approval by default
            isVerified: false
        };

        const product = await DirectoryProduct.findOneAndUpdate(
            { id: productId }, 
            { 
                $push: { userReviews: newReview },
                $inc: { reviewsCount: 1 }
            },
            { new: true }
        );

        if (product && product.userReviews.length > 0) {
            // Recalculate average rating
            const approvedReviews = product.userReviews.filter((r: any) => r.isApproved !== false);
            if (approvedReviews.length > 0) {
                const totalRating = approvedReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
                const avgRating = totalRating / approvedReviews.length;
                await DirectoryProduct.findOneAndUpdate(
                    { id: productId },
                    { rating: Number(avgRating.toFixed(1)) }
                );
            }
        }

        revalidatePath(`/tools/[slug]`, 'page');
        return { success: true };
    } catch (error: any) {
        console.error("Failed to add review", error);
        return { error: error.message || "Failed to submit review" };
    }
}

