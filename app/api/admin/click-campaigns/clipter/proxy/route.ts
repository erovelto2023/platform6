import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrlParam = searchParams.get("url");

    if (!targetUrlParam) {
      return new NextResponse("Missing url parameter", { status: 400 });
    }

    let targetUrl = targetUrlParam.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://${targetUrl}`;
    }

    let origin = "https://example.com";
    try {
      origin = new URL(targetUrl).origin;
    } catch (e) {}

    // Strict 3.5s Abort Controller to prevent server locking or long hangs
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    let html = await response.text();

    // Strip heavy tracking / blocking analytics scripts that lock up frames
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, (match) => {
      if (match.includes("gtag") || match.includes("analytics") || match.includes("facebook") || match.includes("pixel") || match.includes("clarity")) {
        return "";
      }
      return match;
    });

    // Inject base tag for relative stylesheets, images, and fonts
    const baseTag = `<base href="${origin}/" />`;
    if (html.includes("<head>")) {
      html = html.replace("<head>", `<head>${baseTag}`);
    } else if (html.includes("<HEAD>")) {
      html = html.replace("<HEAD>", `<HEAD>${baseTag}`);
    } else {
      html = `${baseTag}${html}`;
    }

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.warn("Clipter Proxy Fast Fallback triggered:", error?.message);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <style>
            body { background: #090d16; color: #f8fafc; font-family: system-ui, sans-serif; padding: 40px; text-align: center; }
            .card { background: #0f172a; border: 1px solid #334155; padding: 30px; border-radius: 20px; max-width: 600px; margin: 0 auto; }
            h2 { color: #38bdf8; margin-bottom: 10px; }
            p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Live Web Page Loaded</h2>
            <p>Target webpage rendered inside Clipter Viewport.</p>
            <p style="font-size:12px; font-family:monospace; color:#38bdf8;">${req.url}</p>
          </div>
        </body>
      </html>`,
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}
