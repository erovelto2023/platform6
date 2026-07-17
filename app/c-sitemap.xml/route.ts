import connectDB from "@/lib/db/connect";
import ContentEntry from "@/lib/db/models/ContentEntry";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectDB();
        const entries = await ContentEntry.find({ isPublished: true })
            .select("slug pageTypeSlug updatedAt")
            .lean();

        const baseUrl = "https://kbusinessacademy.com";

        const urls = entries
            .filter((e: any) => e.slug && e.pageTypeSlug)
            .map(
                (e: any) => `
  <url>
    <loc>${baseUrl}/c/${e.pageTypeSlug}/${e.slug}</loc>
    <lastmod>${e.updatedAt ? new Date(e.updatedAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
            )
            .join("");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/admin/custom-pages</loc>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>${urls}
</urlset>`;

        return new Response(xml, {
            headers: {
                "Content-Type": "application/xml",
                "Cache-Control": "public, max-age=86400, s-maxage=86400",
            },
        });
    } catch (error) {
        console.error("Error generating custom pages sitemap:", error);
        return new Response("<error>Failed to generate sitemap</error>", {
            status: 500,
            headers: { "Content-Type": "application/xml" },
        });
    }
}
