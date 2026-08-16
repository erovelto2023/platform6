export const DEFAULT_THEME = {
  colorPrimary: '#2563eb',       // Brand Primary Blue
  colorPrimaryHover: '#1d4ed8',  // Brand Primary Hover Blue
  colorSecondary: '#1e40af',     // Brand Secondary Deep Blue
  colorAccent: '#f97316',        // Brand Accent Vibrant Orange
  colorSuccess: '#10b981',
  colorDanger: '#ef4444',
  colorBg: '#0f172a',
  colorSurface: '#1e293b',
  colorSurface2: '#334155',
  colorBorder: '#94a3b8',
  colorText: '#f8fafc',
  colorTextMuted: '#e2e8f0',
  navBg: '#0f172a',
  navBorder: '#1e293b',
  navText: '#f8fafc',
  navBrand: '#2563eb',
  hubHeroFrom: '#0f172a',
  hubHeroTo: '#1e3a8a',
  hubHeroText: '#f8fafc',
  hubAccent: '#2563eb',
  checkoutBg: '#0f172a',
  checkoutCard: '#1e293b',
  checkoutBtn: '#2563eb',
  checkoutBtnHover: '#1d4ed8',
  upsellBanner: '#7c2d12',
  upsellBannerText: '#ffedd5',
  upsellBtn: '#f97316',
  downsellBanner: '#1e3a8a',
  downsellBtn: '#2563eb',
  courseBg: '#0f172a',
  courseHeader: '#1e293b',
  coursePlayBtn: '#2563eb',
  adminSidebar: '#0f172a',
  adminSidebarActive: '#2563eb',
  adminSurface: '#1e293b',
};

export type ThemeTokens = typeof DEFAULT_THEME;

export function buildCssVars(t: ThemeTokens): string {
  return `
    :root {
      --color-primary: ${t.colorPrimary};
      --color-primary-hover: ${t.colorPrimaryHover};
      --color-accent: ${t.colorAccent};
      --color-success: ${t.colorSuccess};
      --color-danger: ${t.colorDanger};
      --color-bg: ${t.colorBg};
      --color-surface: ${t.colorSurface};
      --color-surface-2: ${t.colorSurface2};
      --color-border: ${t.colorBorder};
      --color-text: ${t.colorText};
      --color-text-muted: ${t.colorTextMuted};
      --nav-bg: ${t.navBg};
      --nav-border: ${t.navBorder};
      --nav-text: ${t.navText};
      --nav-brand: ${t.navBrand};
      --hub-hero-from: ${t.hubHeroFrom};
      --hub-hero-to: ${t.hubHeroTo};
      --hub-hero-text: ${t.hubHeroText};
      --hub-accent: ${t.hubAccent};
      --checkout-bg: ${t.checkoutBg};
      --checkout-card: ${t.checkoutCard};
      --checkout-btn: ${t.checkoutBtn};
      --checkout-btn-hover: ${t.checkoutBtnHover};
      --upsell-banner: ${t.upsellBanner};
      --upsell-banner-text: ${t.upsellBannerText};
      --upsell-btn: ${t.upsellBtn};
      --downsell-banner: ${t.downsellBanner};
      --downsell-btn: ${t.downsellBtn};
      --course-bg: ${t.courseBg};
      --course-header: ${t.courseHeader};
      --course-play-btn: ${t.coursePlayBtn};
      --admin-sidebar: ${t.adminSidebar};
      --admin-sidebar-active: ${t.adminSidebarActive};
      --admin-surface: ${t.adminSurface};
    }
  `;
}
