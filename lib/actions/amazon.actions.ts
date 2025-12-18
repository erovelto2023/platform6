"use server";

import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import AmazonSettings from "@/lib/db/models/AmazonSettings";
import AmazonTemplate from "@/lib/db/models/AmazonTemplate";
import { revalidatePath } from "next/cache";
import aws4 from "aws4";

// --- Settings ---

export async function getAmazonSettings() {
    try {
        const { userId } = await auth();
        if (!userId) return null;

        await connectDB();
        const settings = await AmazonSettings.findOne({ userId });
        if (!settings) return null;

        return JSON.parse(JSON.stringify(settings));
    } catch (error) {
        console.error("Get Amazon settings error:", error);
        return null;
    }
}

interface IAmazonSettingsUpdate {
    accessKey?: string;
    secretKey?: string;
    partnerTag?: string;
    region?: string;
    isMockMode?: boolean;
    [key: string]: unknown;
}

export async function updateAmazonSettings(values: IAmazonSettingsUpdate) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        console.log("Updating Amazon Settings for user:", userId);
        console.log("Values received:", values);

        await connectDB();
        const settings = await AmazonSettings.findOneAndUpdate(
            { userId },
            { ...values, userId },
            { upsert: true, new: true }
        );

        console.log("Updated settings in DB:", settings);

        revalidatePath("/tools/amazon-product-engine/settings");
        return { success: true, settings: JSON.parse(JSON.stringify(settings)) };
    } catch (error) {
        console.error("Update Amazon settings error:", error);
        return { error: "Something went wrong" };
    }
}

// --- Products ---

const REGION_CONFIG: Record<string, { host: string; region: string }> = {
    "US": { host: "webservices.amazon.com", region: "us-east-1" },
    "UK": { host: "webservices.amazon.co.uk", region: "eu-west-1" },
    "CA": { host: "webservices.amazon.ca", region: "us-east-1" },
    "DE": { host: "webservices.amazon.de", region: "eu-west-1" },
    "FR": { host: "webservices.amazon.fr", region: "eu-west-1" },
    "JP": { host: "webservices.amazon.co.jp", region: "us-west-2" },
};

export async function searchAmazonProducts(query: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        const settings = await AmazonSettings.findOne({ userId });

        if (!settings) {
            return { error: "Amazon settings not found. Please configure them in Settings." };
        }

        // Mock Mode Check
        if (settings.isMockMode) {
            const mockProducts = [
                {
                    asin: "B08N5WRWNW",
                    title: "Apple MacBook Air M1 (Mock Data)",
                    price: "$999.00",
                    imageUrl: "https://m.media-amazon.com/images/I/71TPda7cwUL._AC_SL1500_.jpg",
                    rating: "4.8",
                    reviewCount: 12500,
                    productUrl: "https://amazon.com/dp/B08N5WRWNW"
                },
                {
                    asin: "B09G9F5Y4J",
                    title: "Apple iPhone 13 Pro (Mock Data)",
                    price: "$1099.00",
                    imageUrl: "https://m.media-amazon.com/images/I/61jLiCovxWL._AC_SL1500_.jpg",
                    rating: "4.7",
                    reviewCount: 8900,
                    productUrl: "https://amazon.com/dp/B09G9F5Y4J"
                },
                {
                    asin: "B08L5TNJHG",
                    title: "Sony WH-1000XM4 Wireless Noise Canceling Headphones (Mock Data)",
                    price: "$348.00",
                    imageUrl: "https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg",
                    rating: "4.6",
                    reviewCount: 24000,
                    productUrl: "https://amazon.com/dp/B08L5TNJHG"
                }
            ].filter(p => p.title.toLowerCase().includes(query.toLowerCase()));

            return { success: true, products: mockProducts, debug: { message: "Mock Mode Enabled" } };
        }

        if (!settings.accessKey || !settings.secretKey || !settings.partnerTag) {
            return { error: "Amazon API credentials not found. Please configure them in Settings." };
        }

        const config = REGION_CONFIG[settings.region || "US"] || REGION_CONFIG["US"];

        const payload = {
            Keywords: query,
            Resources: [
                "Images.Primary.Large",
                "ItemInfo.Title",
                "Offers.Listings.Price",
                "CustomerReviews.Count",
                "CustomerReviews.StarRating",
                "ItemInfo.ExternalIds",
                "ItemInfo.ProductInfo"
            ],
            PartnerTag: settings.partnerTag,
            PartnerType: "Associates",
            Marketplace: "www." + config.host.replace("webservices.", ""),
            SearchIndex: "All",
            ItemCount: 10
        };

        const opts = {
            host: config.host,
            path: "/paapi5/searchitems",
            service: "ProductAdvertisingAPI",
            region: config.region,
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "content-type": "application/json; charset=utf-8",
                "host": config.host,
                "x-amz-target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems",
                "content-encoding": "amz-1.0"
            }
        };

        aws4.sign(opts, {
            accessKeyId: settings.accessKey,
            secretAccessKey: settings.secretKey
        });

        const response = await fetch(`https://${opts.host}${opts.path}`, {
            method: opts.method,
            headers: opts.headers as HeadersInit,
            body: opts.body
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Amazon API Error Response:", errorText);
            try {
                const errorJson = JSON.parse(errorText);
                return { error: errorJson.Errors?.[0]?.Message || "Amazon API request failed" };
            } catch {
                return { error: `Amazon API request failed: ${response.statusText}` };
            }
        }

        const data = await response.json();

        console.log("Amazon API Raw Response:", JSON.stringify(data, null, 2));

        if (!data.SearchResult || !data.SearchResult.Items) {
            console.warn("No items found in SearchResult");
            return { success: true, products: [], debug: data };
        }

        interface IAmazonItem {
            Offers?: { Listings?: { Price?: { DisplayAmount?: string } }[] };
            Images?: { Primary?: { Large?: { URL?: string } } };
            ItemInfo?: { Title?: { DisplayValue?: string } };
            CustomerReviews?: { StarRating?: number; Count?: number };
            ASIN?: string;
            DetailPageURL?: string;
        }

        const products = data.SearchResult.Items.map((item: IAmazonItem) => {
            const price = item.Offers?.Listings?.[0]?.Price?.DisplayAmount || "N/A";
            const imageUrl = item.Images?.Primary?.Large?.URL || "";
            const title = item.ItemInfo?.Title?.DisplayValue || "Unknown Product";
            const rating = item.CustomerReviews?.StarRating || 0;
            const reviewCount = item.CustomerReviews?.Count || 0;
            const asin = item.ASIN;
            const productUrl = item.DetailPageURL;

            return {
                asin,
                title,
                price,
                imageUrl,
                rating: rating.toString(),
                reviewCount,
                productUrl
            };
        });

        return { success: true, products };

    } catch (err: unknown) {
        console.error("Search Amazon products error:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return { error: `Search failed: ${errorMessage}` };
    }
}

// --- Templates ---

export async function getAmazonTemplates() {
    try {
        const { userId } = await auth();
        if (!userId) return [];

        await connectDB();
        const templates = await AmazonTemplate.find({ userId }).sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(templates));
    } catch (error) {
        console.error("Get templates error:", error);
        return [];
    }
}

export async function createAmazonTemplate(name: string, content: string, type: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        const template = await AmazonTemplate.create({
            userId,
            name,
            content,
            type
        });

        revalidatePath("/tools/amazon-product-engine/templates");
        return { success: true, template: JSON.parse(JSON.stringify(template)) };
    } catch (error) {
        console.error("Create template error:", error);
        return { error: "Failed to create template" };
    }
}

export async function deleteAmazonTemplate(templateId: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: "Unauthorized" };

        await connectDB();
        await AmazonTemplate.findOneAndDelete({ _id: templateId, userId });

        revalidatePath("/tools/amazon-product-engine/templates");
        return { success: true };
    } catch {
        return { error: "Failed to delete template" };
    }
}
