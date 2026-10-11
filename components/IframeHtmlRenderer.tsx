"use client";

import React, { useEffect, useRef, useState, useId } from "react";

interface IframeHtmlRendererProps {
  html: string;
  className?: string;
  style?: React.CSSProperties;
  height?: string | number;
  isFullPage?: boolean;
  headerCode?: string;
  footerCode?: string;
  title?: string;
}

export function IframeHtmlRenderer({
  html,
  className = "",
  style = {},
  height = "auto",
  isFullPage = false,
  headerCode = "",
  footerCode = "",
  title = "Embedded Content",
}: IframeHtmlRendererProps) {
  const [mounted, setMounted] = useState(false);
  const [frameHeight, setFrameHeight] = useState<number | null>(
    typeof height === "number" ? height : parseInt(String(height)) || null
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const rawId = useId();
  const frameId = "iframe_" + rawId.replace(/[^a-zA-Z0-9]/g, "_");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isFullPage) return;

    const handleMessage = (event: MessageEvent) => {
      if (
        event.data &&
        event.data.type === "IFRAME_RESIZE" &&
        event.data.frameId === frameId
      ) {
        const newHeight = Number(event.data.height);
        if (newHeight > 50 && newHeight !== frameHeight) {
          setFrameHeight(newHeight);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [frameId, frameHeight, isFullPage]);

  if (!html || !html.trim()) {
    return null;
  }

  // Build the complete document with injected codes and auto-resize reporter
  let finalHtml = html;

  // Insert header code if available
  if (headerCode && headerCode.trim()) {
    if (/<head\b[^>]*>/i.test(finalHtml)) {
      finalHtml = finalHtml.replace(/<head\b[^>]*>/i, `$&${headerCode}`);
    } else {
      finalHtml = `${headerCode}\n${finalHtml}`;
    }
  }

  // Insert footer code if available
  if (footerCode && footerCode.trim()) {
    if (/<\/body>/i.test(finalHtml)) {
      finalHtml = finalHtml.replace(/<\/body>/i, `${footerCode}\n$&`);
    } else {
      finalHtml = `${finalHtml}\n${footerCode}`;
    }
  }

  const hasFullDoc = /<!DOCTYPE\b/i.test(finalHtml) || /<html\b/i.test(finalHtml);

  // Auto-resize script to inject for non-full-page frames
  const resizeScript = !isFullPage
    ? `
      <script>
        (function() {
          const frameId = "${frameId}";
          const sendHeight = () => {
            try {
              const body = document.body;
              const html = document.documentElement;
              const h = Math.max(
                body ? body.scrollHeight : 0,
                body ? body.offsetHeight : 0,
                html ? html.clientHeight : 0,
                html ? html.scrollHeight : 0,
                html ? html.offsetHeight : 0
              );
              if (h > 0) {
                window.parent.postMessage({ type: 'IFRAME_RESIZE', height: h, frameId: frameId }, '*');
              }
            } catch(e) {}
          };
          window.addEventListener('load', sendHeight);
          window.addEventListener('resize', sendHeight);
          if (window.ResizeObserver && document.body) {
            new ResizeObserver(sendHeight).observe(document.body);
          }
          setTimeout(sendHeight, 200);
          setTimeout(sendHeight, 600);
          setTimeout(sendHeight, 1500);
        })();
      </script>
    `
    : "";

  let srcDoc = finalHtml;

  if (hasFullDoc) {
    if (resizeScript) {
      if (/<\/body>/i.test(srcDoc)) {
        srcDoc = srcDoc.replace(/<\/body>/i, `${resizeScript}\n$&`);
      } else {
        srcDoc = `${srcDoc}\n${resizeScript}`;
      }
    }
  } else {
    // Wrap fragment in complete HTML document
    srcDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; padding: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  </style>
</head>
<body>
  ${srcDoc}
  ${resizeScript}
</body>
</html>`;
  }

  if (isFullPage) {
    return (
      <iframe
        ref={iframeRef}
        srcDoc={srcDoc}
        title={title}
        className={`w-full h-screen border-none ${className}`}
        style={{
          width: "100%",
          height: "100vh",
          minHeight: "100vh",
          border: "none",
          display: "block",
          ...style,
        }}
        sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups allow-downloads"
      />
    );
  }

  const determinedHeight =
    height === "screen"
      ? "100vh"
      : height !== "auto" && height
      ? typeof height === "number"
        ? `${height}px`
        : height
      : frameHeight
      ? `${frameHeight}px`
      : "650px";

  return (
    <div className={`w-full overflow-hidden ${className}`} style={style}>
      <iframe
        ref={iframeRef}
        srcDoc={srcDoc}
        title={title}
        className="w-full border-none transition-all duration-200"
        style={{
          width: "100%",
          height: determinedHeight,
          minHeight: height === "auto" ? "200px" : undefined,
          border: "none",
          display: "block",
        }}
        sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups allow-downloads"
      />
    </div>
  );
}
