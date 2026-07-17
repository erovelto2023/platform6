export interface PageTheme {
  fontFamily: "inter" | "roboto" | "outfit" | "georgia" | "merriweather";
  colorPrimary: string;
  colorAccent: string;
  colorText: string;
  colorBackground: string;
  borderRadius: "sharp" | "soft" | "rounded" | "pill";
}

export const defaultTheme: PageTheme = {
  fontFamily: "inter",
  colorPrimary: "#0ea5e9",
  colorAccent: "#10b981",
  colorText: "#0f172a",
  colorBackground: "#ffffff",
  borderRadius: "rounded",
};

export const fontFamilyMap: Record<PageTheme["fontFamily"], string> = {
  inter: "'Inter', sans-serif",
  roboto: "'Roboto', sans-serif",
  outfit: "'Outfit', sans-serif",
  georgia: "Georgia, 'Times New Roman', serif",
  merriweather: "'Merriweather', Georgia, serif",
};

export const borderRadiusMap: Record<PageTheme["borderRadius"], string> = {
  sharp: "0px",
  soft: "4px",
  rounded: "12px",
  pill: "9999px",
};

export function generateThemeCSS(theme: PageTheme): string {
  const font = fontFamilyMap[theme.fontFamily];
  const radius = borderRadiusMap[theme.borderRadius];
  return `
    :root {
      --theme-font: ${font};
      --theme-primary: ${theme.colorPrimary};
      --theme-accent: ${theme.colorAccent};
      --theme-text: ${theme.colorText};
      --theme-bg: ${theme.colorBackground};
      --theme-radius: ${radius};
    }
    body {
      font-family: var(--theme-font);
      color: var(--theme-text);
      background-color: var(--theme-bg);
    }
  `.trim();
}
