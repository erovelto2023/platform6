"use client";
import React from "react";

// ─── Shared Style Props (applied to every block) ─────────────────────────────
export type StyleProps = {
  s_color: string;
  s_bg: string;
  s_fontSize: string;
  s_fontWeight: string;
  s_fontFamily: string;
  s_letterSpacing: string;
  s_lineHeight: string;
  s_borderW: string;
  s_borderStyle: string;
  s_borderColor: string;
  s_borderRadius: string;
  s_paddingX: string;
  s_paddingY: string;
  s_marginTop: string;
  s_marginBottom: string;
  s_shadow: string;
  s_opacity: string;
  s_customCSS: string;
};

export const styleDefaults: StyleProps = {
  s_color: "", s_bg: "", s_fontSize: "", s_fontWeight: "", s_fontFamily: "",
  s_letterSpacing: "", s_lineHeight: "", s_borderW: "", s_borderStyle: "solid",
  s_borderColor: "", s_borderRadius: "", s_paddingX: "", s_paddingY: "",
  s_marginTop: "", s_marginBottom: "", s_shadow: "", s_opacity: "", s_customCSS: "",
};

// ─── Color Picker Custom Field ────────────────────────────────────────────────
const ColorField = ({ onChange, value }: { onChange: (v: string) => void; value: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "2px 0" }}>
    <input type="color" value={value || "#000000"} onChange={(e) => onChange(e.target.value)}
      style={{ width: "28px", height: "28px", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "1px", cursor: "pointer", flexShrink: 0 }} />
    <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)}
      placeholder="#rrggbb or transparent"
      style={{ flex: 1, fontSize: "11px", border: "1px solid #e2e8f0", borderRadius: "4px", padding: "4px 6px", fontFamily: "monospace", minWidth: 0 }} />
    {value && (
      <button onClick={() => onChange("")}
        style={{ fontSize: "10px", color: "#94a3b8", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>✕</button>
    )}
  </div>
);

// ─── Shared Field Definitions (spread into any block's `fields`) ──────────────
export const styleFieldDefs = {
  s_color: { type: "custom" as const, label: "Text Color", render: (p: any) => <ColorField {...p} /> },
  s_bg: { type: "custom" as const, label: "Background Color", render: (p: any) => <ColorField {...p} /> },
  s_fontSize: { type: "select" as const, label: "Font Size", options: [
    { label: "—  Inherit", value: "" }, { label: "12px", value: "12px" }, { label: "14px", value: "14px" },
    { label: "16px", value: "16px" }, { label: "18px", value: "18px" }, { label: "20px", value: "20px" },
    { label: "24px", value: "24px" }, { label: "30px", value: "30px" }, { label: "36px", value: "36px" },
    { label: "48px", value: "48px" }, { label: "60px", value: "60px" }, { label: "72px", value: "72px" },
    { label: "96px", value: "96px" },
  ]},
  s_fontWeight: { type: "select" as const, label: "Font Weight", options: [
    { label: "—  Inherit", value: "" }, { label: "Thin (100)", value: "100" }, { label: "Light (300)", value: "300" },
    { label: "Normal (400)", value: "400" }, { label: "Medium (500)", value: "500" },
    { label: "Semibold (600)", value: "600" }, { label: "Bold (700)", value: "700" },
    { label: "Extra Bold (800)", value: "800" }, { label: "Black (900)", value: "900" },
  ]},
  s_fontFamily: { type: "select" as const, label: "Font Family", options: [
    { label: "—  Inherit", value: "" }, { label: "Inter", value: "'Inter', sans-serif" },
    { label: "Roboto", value: "'Roboto', sans-serif" }, { label: "Outfit", value: "'Outfit', sans-serif" },
    { label: "Georgia", value: "Georgia, serif" }, { label: "Merriweather", value: "'Merriweather', serif" },
    { label: "Monospace", value: "monospace" }, { label: "Arial", value: "Arial, sans-serif" },
    { label: "System UI", value: "system-ui, sans-serif" },
  ]},
  s_letterSpacing: { type: "select" as const, label: "Letter Spacing", options: [
    { label: "—  Inherit", value: "" }, { label: "Tighter (−0.05em)", value: "-0.05em" },
    { label: "Tight (−0.025em)", value: "-0.025em" }, { label: "Normal (0)", value: "0em" },
    { label: "Wide (+0.025em)", value: "0.025em" }, { label: "Wider (+0.05em)", value: "0.05em" },
    { label: "Widest (+0.1em)", value: "0.1em" }, { label: "Ultra (+0.2em)", value: "0.2em" },
  ]},
  s_lineHeight: { type: "select" as const, label: "Line Height", options: [
    { label: "—  Inherit", value: "" }, { label: "None (1)", value: "1" }, { label: "Tight (1.25)", value: "1.25" },
    { label: "Snug (1.375)", value: "1.375" }, { label: "Normal (1.5)", value: "1.5" },
    { label: "Relaxed (1.625)", value: "1.625" }, { label: "Loose (2)", value: "2" },
  ]},
  s_borderW: { type: "select" as const, label: "Border Width", options: [
    { label: "None", value: "" }, { label: "1px", value: "1px" }, { label: "2px", value: "2px" },
    { label: "3px", value: "3px" }, { label: "4px", value: "4px" }, { label: "6px", value: "6px" },
    { label: "8px", value: "8px" },
  ]},
  s_borderStyle: { type: "select" as const, label: "Border Style", options: [
    { label: "Solid", value: "solid" }, { label: "Dashed", value: "dashed" },
    { label: "Dotted", value: "dotted" }, { label: "Double", value: "double" },
    { label: "Groove", value: "groove" }, { label: "Ridge", value: "ridge" },
  ]},
  s_borderColor: { type: "custom" as const, label: "Border Color", render: (p: any) => <ColorField {...p} /> },
  s_borderRadius: { type: "select" as const, label: "Border Radius", options: [
    { label: "None (0)", value: "" }, { label: "2px", value: "2px" }, { label: "4px", value: "4px" },
    { label: "6px", value: "6px" }, { label: "8px", value: "8px" }, { label: "12px", value: "12px" },
    { label: "16px", value: "16px" }, { label: "20px", value: "20px" }, { label: "24px", value: "24px" },
    { label: "32px", value: "32px" }, { label: "Full (9999px)", value: "9999px" },
  ]},
  s_paddingX: { type: "select" as const, label: "Padding Left/Right", options: [
    { label: "—  None", value: "" }, { label: "4px", value: "4px" }, { label: "8px", value: "8px" },
    { label: "12px", value: "12px" }, { label: "16px", value: "16px" }, { label: "20px", value: "20px" },
    { label: "24px", value: "24px" }, { label: "32px", value: "32px" }, { label: "40px", value: "40px" },
    { label: "48px", value: "48px" }, { label: "64px", value: "64px" }, { label: "96px", value: "96px" },
  ]},
  s_paddingY: { type: "select" as const, label: "Padding Top/Bottom", options: [
    { label: "—  None", value: "" }, { label: "4px", value: "4px" }, { label: "8px", value: "8px" },
    { label: "12px", value: "12px" }, { label: "16px", value: "16px" }, { label: "20px", value: "20px" },
    { label: "24px", value: "24px" }, { label: "32px", value: "32px" }, { label: "40px", value: "40px" },
    { label: "48px", value: "48px" }, { label: "64px", value: "64px" }, { label: "96px", value: "96px" },
  ]},
  s_marginTop: { type: "select" as const, label: "Margin Top", options: [
    { label: "—  None", value: "" }, { label: "4px", value: "4px" }, { label: "8px", value: "8px" },
    { label: "16px", value: "16px" }, { label: "24px", value: "24px" }, { label: "32px", value: "32px" },
    { label: "48px", value: "48px" }, { label: "64px", value: "64px" }, { label: "96px", value: "96px" },
    { label: "Auto", value: "auto" },
  ]},
  s_marginBottom: { type: "select" as const, label: "Margin Bottom", options: [
    { label: "—  None", value: "" }, { label: "4px", value: "4px" }, { label: "8px", value: "8px" },
    { label: "16px", value: "16px" }, { label: "24px", value: "24px" }, { label: "32px", value: "32px" },
    { label: "48px", value: "48px" }, { label: "64px", value: "64px" }, { label: "96px", value: "96px" },
    { label: "Auto", value: "auto" },
  ]},
  s_shadow: { type: "select" as const, label: "Box Shadow", options: [
    { label: "None", value: "" },
    { label: "XSmall", value: "0 1px 2px rgba(0,0,0,0.07)" },
    { label: "Small", value: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)" },
    { label: "Medium", value: "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)" },
    { label: "Large", value: "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)" },
    { label: "XLarge", value: "0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)" },
    { label: "2XLarge", value: "0 25px 50px rgba(0,0,0,0.25)" },
    { label: "Glow (Blue)", value: "0 0 20px rgba(14,165,233,0.4)" },
    { label: "Glow (Green)", value: "0 0 20px rgba(16,185,129,0.4)" },
    { label: "Glow (Rose)", value: "0 0 20px rgba(244,63,94,0.4)" },
  ]},
  s_opacity: { type: "select" as const, label: "Opacity", options: [
    { label: "100%", value: "" }, { label: "95%", value: "0.95" }, { label: "90%", value: "0.90" },
    { label: "80%", value: "0.80" }, { label: "75%", value: "0.75" }, { label: "60%", value: "0.60" },
    { label: "50%", value: "0.50" }, { label: "40%", value: "0.40" }, { label: "25%", value: "0.25" },
  ]},
  s_customCSS: { type: "textarea" as const, label: "Custom CSS" },
};

// ─── Style Builder ────────────────────────────────────────────────────────────
export function buildStyle(p: StyleProps): React.CSSProperties {
  const style: React.CSSProperties = {};
  if (p.s_color) style.color = p.s_color;
  if (p.s_bg) style.backgroundColor = p.s_bg;
  if (p.s_fontSize) style.fontSize = p.s_fontSize;
  if (p.s_fontWeight) style.fontWeight = p.s_fontWeight as any;
  if (p.s_fontFamily) style.fontFamily = p.s_fontFamily;
  if (p.s_letterSpacing) style.letterSpacing = p.s_letterSpacing;
  if (p.s_lineHeight) style.lineHeight = p.s_lineHeight;
  if (p.s_borderW) {
    style.borderWidth = p.s_borderW;
    style.borderStyle = (p.s_borderStyle || "solid") as any;
    if (p.s_borderColor) style.borderColor = p.s_borderColor;
  }
  if (p.s_borderRadius) style.borderRadius = p.s_borderRadius;
  if (p.s_paddingX) style.paddingLeft = style.paddingRight = p.s_paddingX;
  if (p.s_paddingY) style.paddingTop = style.paddingBottom = p.s_paddingY;
  if (p.s_marginTop) style.marginTop = p.s_marginTop;
  if (p.s_marginBottom) style.marginBottom = p.s_marginBottom;
  if (p.s_shadow) style.boxShadow = p.s_shadow;
  if (p.s_opacity) style.opacity = p.s_opacity as any;
  return style;
}

// ─── Styled Wrapper ───────────────────────────────────────────────────────────
export function Styled({ p, children, className = "", style = {} }: { p: StyleProps; children?: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const builtStyle = buildStyle(p);
  const combinedStyle = { ...builtStyle, ...style };
  const id = React.useId().replace(/:/g, "_");
  const hasStyle = Object.keys(combinedStyle).length > 0 || !!p.s_customCSS;
  if (!hasStyle) return <>{children}</>;
  return (
    <div className={className} style={combinedStyle} data-styled={id}>
      {p.s_customCSS && <style>{`[data-styled="${id}"] { ${p.s_customCSS} }`}</style>}
      {children}
    </div>
  );
}
