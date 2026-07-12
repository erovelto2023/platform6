export const DEFAULT_THEME = {
  colorPrimary: '#6366f1',
  colorPrimaryHover: '#4f46e5',
  colorAccent: '#f59e0b',
  colorSuccess: '#10b981',
  colorDanger: '#ef4444',
  colorBg: '#020617',
  colorSurface: '#0f172a',
  colorSurface2: '#1e293b',
  colorBorder: '#334155',
  colorText: '#f8fafc',
  colorTextMuted: '#94a3b8',
  navBg: '#0f172a',
  navBorder: '#1e293b',
  navText: '#f8fafc',
  navBrand: '#6366f1',
  hubHeroFrom: '#0f172a',
  hubHeroTo: '#1e1b4b',
  hubHeroText: '#f8fafc',
  hubAccent: '#6366f1',
  checkoutBg: '#020617',
  checkoutCard: '#0f172a',
  checkoutBtn: '#6366f1',
  checkoutBtnHover: '#4f46e5',
  upsellBanner: '#78350f',
  upsellBannerText: '#fef3c7',
  upsellBtn: '#f59e0b',
  downsellBanner: '#1e1b4b',
  downsellBtn: '#6366f1',
  courseBg: '#020617',
  courseHeader: '#0f172a',
  coursePlayBtn: '#6366f1',
  adminSidebar: '#020617',
  adminSidebarActive: '#6366f1',
  adminSurface: '#0f172a',
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
