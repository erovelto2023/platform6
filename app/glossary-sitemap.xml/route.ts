import { getGlossaryTerms } from "@/lib/actions/glossary.actions";

export const dynamic = "force-dynamic";

export async function GET() {
    const { terms } = await getGlossaryTerms({ limit: 0 });

    const baseUrl = "https://kbusinessacademy.com";

    const urls = terms
        .filter((t: any) => t.slug)
        .map(
            (t: any) => `
  <url>
    <loc>${baseUrl}/glossary/${t.slug}</loc>
    <lastmod>${t.updatedAt ? new Date(t.updatedAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
        )
        .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/glossary</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>${urls}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
    });
}
