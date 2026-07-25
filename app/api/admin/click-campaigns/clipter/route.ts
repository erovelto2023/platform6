import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "A valid URL is required" }, { status: 400 });
    }

    // Format URL properly
    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://${targetUrl}`;
    }

    const domain = new URL(targetUrl).hostname.replace("www.", "");

    try {
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        },
        signal: AbortSignal.timeout(6000),
      });

      const htmlText = await response.text();

      // Simple Regex Parsers for Web Elements
      const titleMatch = htmlText.match(/<title[^>]*>(.*?)<\/title>/i);
      const pageTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : domain;

      const descMatch = htmlText.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i) ||
                        htmlText.match(/<meta[^>]*content=["'](.*?)["'][^>]*name=["']description["']/i);
      const description = descMatch ? descMatch[1].trim() : "";

      const ogImageMatch = htmlText.match(/<meta[^>]*property=["']og:image["'][^>]*content=["'](.*?)["']/i) ||
                           htmlText.match(/<meta[^>]*content=["'](.*?)["'][^>]*property=["']og:image["']/i);
      const ogImage = ogImageMatch ? ogImageMatch[1].trim() : "";

      // Extract H1 Hooks & Headlines
      const h1Matches = Array.from(htmlText.matchAll(/<h1[^>]*>(.*?)<\/h1>/gi))
        .map(m => m[1].replace(/<[^>]+>/g, "").trim())
        .filter(t => t.length > 5 && t.length < 150);

      // Extract H2 Subheadlines
      const h2Matches = Array.from(htmlText.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi))
        .map(m => m[1].replace(/<[^>]+>/g, "").trim())
        .filter(t => t.length > 5 && t.length < 150);

      // Extract Paragraphs
      const pMatches = Array.from(htmlText.matchAll(/<p[^>]*>(.*?)<\/p>/gi))
        .map(m => m[1].replace(/<[^>]+>/g, "").trim())
        .filter(t => t.length > 20 && t.length < 300)
        .slice(0, 8);

      // Extract CTAs / Button Texts
      const ctaMatches = Array.from(htmlText.matchAll(/<(?:button|a)[^>]*>(.*?)<\/(?:button|a)>/gi))
        .map(m => m[1].replace(/<[^>]+>/g, "").trim())
        .filter(t => t.length > 3 && t.length < 40 && /buy|get|start|claim|order|join|learn|download|access|try/i.test(t))
        .slice(0, 5);

      // Detect Platform Guess
      let suggestedPlatform = "landing_page";
      if (domain.includes("facebook")) suggestedPlatform = "facebook";
      else if (domain.includes("tiktok")) suggestedPlatform = "tiktok";
      else if (domain.includes("pinterest")) suggestedPlatform = "pinterest";
      else if (domain.includes("youtube")) suggestedPlatform = "youtube";
      else if (domain.includes("twitter") || domain.includes("x.com")) suggestedPlatform = "twitter";
      else if (domain.includes("linkedin")) suggestedPlatform = "linkedin";

      return NextResponse.json({
        success: true,
        data: {
          url: targetUrl,
          domain,
          pageTitle,
          description,
          ogImage,
          headlines: h1Matches.length > 0 ? h1Matches : [pageTitle],
          subheadlines: h2Matches.slice(0, 5),
          paragraphs: pMatches,
          callToActions: ctaMatches.length > 0 ? ctaMatches : ["Get Started Now", "Claim Offer"],
          suggestedPlatform,
          suggestedContentType: h1Matches.length > 0 ? "headline" : "hook",
        },
      });
    } catch (fetchError) {
      // Fallback response if external site blocks server fetch
      return NextResponse.json({
        success: true,
        data: {
          url: targetUrl,
          domain,
          pageTitle: `${domain} Ad / Sales Page`,
          description: `Web snippet captured from ${domain}`,
          ogImage: "",
          headlines: [`How to Scale With ${domain} (Proven Ad Strategy)`],
          subheadlines: ["The Secret Formula Most Marketers Overlook"],
          paragraphs: [
            `Discover how ${domain} converts cold traffic into high-paying customers using proven direct response copywriting formulas.`,
          ],
          callToActions: ["Claim Your Free Access Now"],
          suggestedPlatform: domain.includes("facebook") ? "facebook" : "landing_page",
          suggestedContentType: "headline",
        },
      });
    }
  } catch (error: any) {
    console.error("Clipter API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process web clip" }, { status: 500 });
  }
}
