"use client";
import { Config } from "@puckeditor/core";
import { Button } from "@/components/ui/button";
import { Check, Star, Heart, Shield, Zap, Mail, Phone, MapPin, ArrowUp, AlertCircle, ArrowRight } from "lucide-react";
import { StyleProps, styleDefaults, styleFieldDefs, Styled } from "@/lib/puck-style";

const FacebookIcon = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const TwitterIcon = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>;
const InstagramIcon = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const LinkedinIcon = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
const YoutubeIcon = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;
const GithubIcon = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>;
import { useState, useEffect } from "react";
import { getCollectionItems } from "@/lib/actions/custom-pages.actions";

// Every block type gets the full StyleProps injected
type W<T> = T & StyleProps;

export type PuckBlocksProps = {
  // Typography
  HeadingBlock: W<{ title: string; align: "left" | "center" | "right"; color: "slate" | "sky" | "emerald" | "rose" | "amber" | "white"; size: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"; fontWeight: "normal" | "semibold" | "bold" | "black"; letterSpacing: "tighter" | "tight" | "normal" | "wide" | "wider"; customCSS: string }>;
  TextBlock: W<{ content: string; align: "left" | "center" | "right"; color: "slate" | "sky" | "emerald" | "rose" | "amber" | "white"; size: "sm" | "base" | "lg" | "xl"; lineHeight: "tight" | "snug" | "normal" | "relaxed" | "loose"; maxWidth: "none" | "prose" | "md" | "lg"; customCSS: string }>;
  RichTextBlock: W<{ html: string }>;
  BlockquoteBlock: W<{ quote: string; author: string }>;
  BulletListBlock: W<{ items: string; iconStyle: "dot" | "check" | "star" }>;

  // Layout & Containers
  SectionLayout: W<{ bgType: "solid" | "gradient" | "image"; bg: "white" | "slate" | "dark" | "sky" | "emerald" | "rose" | "transparent"; gradientFrom: string; gradientTo: string; gradientDir: string; bgImage: string; overlayOpacity: "0" | "20" | "40" | "60" | "80"; overlayColor: "black" | "white"; paddingTop: "none" | "sm" | "md" | "lg" | "xl" | "2xl"; paddingBottom: "none" | "sm" | "md" | "lg" | "xl" | "2xl"; customCSS: string }>;
  ContainerBlock: W<{ maxWidth: "sm" | "md" | "lg" | "xl" | "full"; paddingX: "none" | "sm" | "md" | "lg" }>;
  FlexRowBlock: W<{ align: "start" | "center" | "end"; justify: "start" | "center" | "between" | "around"; gap: "none" | "sm" | "md" | "lg" | "xl" }>;
  FlexColumnBlock: W<{ align: "start" | "center" | "end"; justify: "start" | "center" | "between"; gap: "none" | "sm" | "md" | "lg" | "xl" }>;
  FeatureGrid: W<{ title: string; columns: "2" | "3" | "4"; gap: "sm" | "md" | "lg" }>;
  CardBlock: W<{ title: string; description: string; padding: "sm" | "md" | "lg"; shadow: "none" | "sm" | "md" | "lg" | "xl"; bgColor: "white" | "slate" | "dark" | "sky" | "emerald" | "rose"; borderRadius: "none" | "sm" | "md" | "lg" | "xl" | "2xl"; borderWidth: "none" | "thin" | "medium" | "thick"; borderColor: "slate" | "sky" | "emerald" | "rose" | "amber"; customCSS: string }>;
  TwoColumnBlock: W<{ leftWidth: "1/2" | "1/3" | "2/3" | "1/4" | "3/4" }>;
  ThreeColumnBlock: W<{ gap: "sm" | "md" | "lg" }>;
  SpacerBlock: W<{ height: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" }>;
  DividerBlock: W<{ color: "slate" | "sky" | "emerald"; style: "solid" | "dashed" | "dotted" }>;

  // Forms & Inputs
  FormBlock: W<{ actionUrl: string; buttonText: string; padding: "sm" | "md" | "lg" }>;
  TextInputBlock: W<{ label: string; placeholder: string; required: boolean; type: "text" | "email" | "password" | "number" }>;
  TextAreaBlock: W<{ label: string; placeholder: string; required: boolean; rows: number }>;
  CheckboxBlock: W<{ label: string; required: boolean }>;
  SelectBlock: W<{ label: string; options: string; required: boolean }>;
  RadioGroupBlock: W<{ label: string; options: string; name: string }>;
  NewsletterFormBlock: W<{ title: string; description: string; buttonText: string; bg: "slate" | "sky" | "emerald" }>;

  // Interactive & Action
  ButtonBlock: W<{ text: string; href: string; variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"; size: "default" | "sm" | "lg"; width: "auto" | "full" }>;
  ButtonGroupBlock: W<{ align: "left" | "center" | "right" }>;
  IconButtonBlock: W<{ icon: string; href: string; variant: "default" | "outline" | "ghost"; size: "default" | "sm" | "lg" }>;
  LinkBlock: W<{ text: string; href: string; color: "sky" | "emerald" | "slate" | "white"; size: "sm" | "base" | "lg" }>;
  BackToTopBlock: W<{ position: "bottom-right" | "bottom-left"; showText: boolean }>;
  TabsBlock: W<{ tabs: Array<{ title: string }> }>;
  PaginationBlock: W<{ totalPages: number; currentPage: number }>;

  // UI Elements
  AlertBlock: W<{ title: string; message: string; variant: "info" | "success" | "warning" | "error" }>;
  BadgeBlock: W<{ text: string; variant: "default" | "secondary" | "destructive" | "outline" }>;
  AvatarBlock: W<{ src: string; alt: string; size: "sm" | "md" | "lg" | "xl" }>;
  BreadcrumbBlock: W<{ items: Array<{ label: string; href: string }> }>;
  ProgressBarBlock: W<{ progress: number; label: string; showPercentage: boolean }>;
  CountdownTimerBlock: W<{ targetDate: string; label: string }>;

  // Media & Social
  ImageBlock: W<{ src: string; alt: string; href?: string; rounded: "none" | "md" | "xl" | "full"; shadow: "none" | "sm" | "md" | "lg" | "xl" }>;
  ImageGalleryBlock: W<{ images: Array<{ src: string; alt: string }>; columns: "2" | "3" | "4" }>;
  IconBlock: W<{ icon: "Star" | "Heart" | "Shield" | "Zap" | "Mail" | "Phone" | "MapPin" | "Check"; size: "sm" | "md" | "lg" | "xl" | "2xl"; color: "slate" | "sky" | "emerald" | "rose" | "amber" }>;
  VideoEmbedBlock: W<{ url: string; aspectRatio: "video" | "square"; rounded: "none" | "md" | "xl" }>;
  SocialIconsBlock: W<{ platforms: string; align: "left" | "center" | "right"; style: "solid" | "outline" }>;
  ShareButtonsBlock: W<{ url: string; text: string; align: "left" | "center" | "right" }>;

  // Compound / Complex
  HeroBlock: W<{ title: string; subtitle: string; ctaText: string; ctaLink: string; image: string; bg: "primary" | "dark" | "light"; paddingTop: "md" | "lg" | "xl" | "2xl"; paddingBottom: "md" | "lg" | "xl" | "2xl" }>;
  AccordionBlock: W<{ items: Array<{ title: string; content: string }> }>;
  PricingTableBlock: W<{ tier1Name: string; tier1Price: string; tier1Features: string; tier2Name: string; tier2Price: string; tier2Features: string; tier3Name: string; tier3Price: string; tier3Features: string; highlightTier: "1" | "2" | "3" }>;
  TestimonialsBlock: W<{ title: string; reviews: Array<{ name: string; role: string; text: string; rating: "4" | "5" }> }>;
  VideoVSLBlock: W<{ videoUrl: string; headline: string; subheadline: string; paddingTop: "md" | "lg" | "xl"; paddingBottom: "md" | "lg" | "xl" }>;
  NavBarBlock: W<{ logoText: string; links: Array<{ label: string; href: string }> }>;
  FooterBlock: W<{ copyright: string; links: Array<{ label: string; href: string }> }>;
  DynamicCollectionBlock: W<{ collection: "GlossaryTerm" | "Offer" | "WebPage" | "NicheBox" | "CPAListing"; limit: number; layout: "grid" | "list" }>;
};

export const puckConfig: Config<PuckBlocksProps> = {
  categories: {
    typography: { title: "Typography", components: ["HeadingBlock", "TextBlock", "RichTextBlock", "BlockquoteBlock", "BulletListBlock"] },
    layout: { title: "Layout & Containers", components: ["SectionLayout", "ContainerBlock", "TwoColumnBlock", "ThreeColumnBlock", "FlexRowBlock", "FlexColumnBlock", "FeatureGrid", "CardBlock", "SpacerBlock", "DividerBlock"] },
    forms: { title: "Forms & Inputs", components: ["FormBlock", "NewsletterFormBlock", "TextInputBlock", "TextAreaBlock", "CheckboxBlock", "RadioGroupBlock", "SelectBlock"] },
    interactive: { title: "Buttons & Action", components: ["ButtonBlock", "ButtonGroupBlock", "IconButtonBlock", "LinkBlock", "TabsBlock", "PaginationBlock", "BackToTopBlock"] },
    uiElements: { title: "UI Elements", components: ["AlertBlock", "BadgeBlock", "AvatarBlock", "BreadcrumbBlock", "ProgressBarBlock", "CountdownTimerBlock"] },
    media: { title: "Media & Assets", components: ["ImageBlock", "ImageGalleryBlock", "IconBlock", "VideoEmbedBlock", "SocialIconsBlock", "ShareButtonsBlock"] },
    compound: { title: "Compound Widgets", components: ["HeroBlock", "NavBarBlock", "FooterBlock", "AccordionBlock", "PricingTableBlock", "TestimonialsBlock", "VideoVSLBlock"] },
    dynamic: { title: "Dynamic DB Data", components: ["DynamicCollectionBlock"] }
  },
  components: {
    // --- TYPOGRAPHY ---
    HeadingBlock: {
      fields: {
        title: { type: "text" },
        align: { type: "select", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }, { label: "Right", value: "right" }] },
        color: { type: "select", options: [{ label: "Slate", value: "slate" }, { label: "Sky Blue", value: "sky" }, { label: "Emerald Green", value: "emerald" }, { label: "Rose Red", value: "rose" }, { label: "Amber", value: "amber" }, { label: "White", value: "white" }] },
        size: { type: "select", options: [{ label: "Small (H6)", value: "sm" }, { label: "Medium (H4)", value: "md" }, { label: "Large (H2)", value: "lg" }, { label: "X-Large (H1)", value: "xl" }, { label: "2X-Large", value: "2xl" }, { label: "3X-Large", value: "3xl" }, { label: "4X-Large", value: "4xl" }] },
        fontWeight: { type: "select", options: [{ label: "Normal", value: "normal" }, { label: "Semibold", value: "semibold" }, { label: "Bold", value: "bold" }, { label: "Black", value: "black" }] },
        letterSpacing: { type: "select", options: [{ label: "Tighter", value: "tighter" }, { label: "Tight", value: "tight" }, { label: "Normal", value: "normal" }, { label: "Wide", value: "wide" }, { label: "Wider", value: "wider" }] },
        customCSS: { type: "textarea" },
        ...styleFieldDefs,
      },
      defaultProps: { title: "Heading", align: "left", color: "slate", size: "lg", fontWeight: "bold", letterSpacing: "tight", customCSS: "", ...styleDefaults },
      render: (props) => {
        const { title, align, color, size, fontWeight, letterSpacing, customCSS } = props;
        const colorClasses = { slate: "text-slate-900", sky: "text-sky-600", emerald: "text-emerald-600", rose: "text-rose-600", amber: "text-amber-500", white: "text-white" };
        const sizeClasses = { sm: "text-lg md:text-xl", md: "text-2xl md:text-3xl", lg: "text-3xl md:text-4xl", xl: "text-4xl md:text-5xl", "2xl": "text-5xl md:text-6xl", "3xl": "text-6xl md:text-7xl", "4xl": "text-7xl md:text-8xl" };
        const weights = { normal: "font-normal", semibold: "font-semibold", bold: "font-bold", black: "font-black" };
        const spacing = { tighter: "tracking-tighter", tight: "tracking-tight", normal: "tracking-normal", wide: "tracking-wide", wider: "tracking-wider" };
        const uid = `heading-${title.replace(/\s+/g,'').slice(0,8)}`;
        return (
          <Styled p={props}>
            {customCSS && <style>{`.${uid} { ${customCSS} }`}</style>}
            <h2 className={`mb-4 text-${align} ${colorClasses[color]} ${sizeClasses[size]} ${weights[fontWeight]} ${spacing[letterSpacing]} ${uid}`}>{title}</h2>
          </Styled>
        );
      },
    },
    TextBlock: {
      fields: {
        content: { type: "textarea" },
        align: { type: "select", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }, { label: "Right", value: "right" }] },
        color: { type: "select", options: [{ label: "Slate", value: "slate" }, { label: "Sky Blue", value: "sky" }, { label: "Emerald Green", value: "emerald" }, { label: "Rose Red", value: "rose" }, { label: "Amber", value: "amber" }, { label: "White", value: "white" }] },
        size: { type: "select", options: [{ label: "Small", value: "sm" }, { label: "Normal", value: "base" }, { label: "Large", value: "lg" }, { label: "X-Large", value: "xl" }] },
        lineHeight: { type: "select", options: [{ label: "Tight", value: "tight" }, { label: "Snug", value: "snug" }, { label: "Normal", value: "normal" }, { label: "Relaxed", value: "relaxed" }, { label: "Loose", value: "loose" }] },
        maxWidth: { type: "select", options: [{ label: "None (full)", value: "none" }, { label: "Narrow (prose)", value: "prose" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }] },
        customCSS: { type: "textarea" },
        ...styleFieldDefs,
      },
      defaultProps: { content: "Write some text here...", align: "left", color: "slate", size: "lg", lineHeight: "relaxed", maxWidth: "none", customCSS: "", ...styleDefaults },
      render: (props) => {
        const { content, align, color, size, lineHeight, maxWidth, customCSS } = props;
        const colorClasses = { slate: "text-slate-600", sky: "text-sky-700", emerald: "text-emerald-700", rose: "text-rose-700", amber: "text-amber-700", white: "text-slate-200" };
        const sizeClasses = { sm: "text-sm", base: "text-base", lg: "text-lg", xl: "text-xl md:text-2xl" };
        const lineHeights = { tight: "leading-tight", snug: "leading-snug", normal: "leading-normal", relaxed: "leading-relaxed", loose: "leading-loose" };
        const maxWidths = { none: "", prose: "max-w-prose", md: "max-w-2xl", lg: "max-w-4xl" };
        const uid = `text-${content.replace(/\s+/g,'').slice(0,8)}`;
        return (
          <Styled p={props}>
            {customCSS && <style>{`.${uid} { ${customCSS} }`}</style>}
            <p className={`mb-4 text-${align} ${colorClasses[color]} ${sizeClasses[size]} ${lineHeights[lineHeight]} ${maxWidths[maxWidth]} ${uid}`}>{content}</p>
          </Styled>
        );
      },
    },
    RichTextBlock: {
      fields: { html: { type: "textarea" }, ...styleFieldDefs },
      defaultProps: { html: "<p><strong>Bold text</strong> and <em>italic</em> formatting via HTML.</p>", ...styleDefaults },
      render: (props) => <Styled p={props}><div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: props.html }} /></Styled>
    },
    BlockquoteBlock: {
      fields: { quote: { type: "textarea" }, author: { type: "text" }, ...styleFieldDefs },
      defaultProps: { quote: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs", ...styleDefaults },
      render: (props) => (
        <Styled p={props}>
          <blockquote className="border-l-4 border-sky-500 pl-6 py-2 my-6 italic text-slate-700 bg-slate-50 rounded-r-lg">
            <p className="text-xl mb-3">"{props.quote}"</p>
            <footer className="text-sm font-semibold text-slate-500">— {props.author}</footer>
          </blockquote>
        </Styled>
      )
    },
    BulletListBlock: {
      fields: { items: { type: "textarea" }, iconStyle: { type: "select", options: [{ label: "Dot", value: "dot" }, { label: "Check", value: "check" }, { label: "Star", value: "star" }] }, ...styleFieldDefs },
      defaultProps: { items: "First item\nSecond item\nThird item", iconStyle: "check", ...styleDefaults },
      render: (props) => {
        const { items, iconStyle } = props;
        const listItems = items.split('\n').filter(Boolean);
        return (
          <Styled p={props}>
            <ul className="space-y-3 my-4">
              {listItems.map((item, i) => (
                <li key={i} className="flex items-start text-slate-700">
                  {iconStyle === 'check' && <Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />}
                  {iconStyle === 'star' && <Star className="w-5 h-5 text-amber-400 mr-3 shrink-0 mt-0.5" />}
                  {iconStyle === 'dot' && <div className="w-2 h-2 rounded-full bg-sky-500 mr-4 shrink-0 mt-2" />}
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </Styled>
        );
      }
    },

    // --- LAYOUT & CONTAINERS ---
    SectionLayout: {
      fields: {
        bgType: { type: "select", options: [{ label: "Solid Color", value: "solid" }, { label: "Gradient", value: "gradient" }, { label: "Image", value: "image" }] },
        bg: { type: "select", options: [{ label: "Transparent", value: "transparent" }, { label: "White", value: "white" }, { label: "Slate", value: "slate" }, { label: "Dark", value: "dark" }, { label: "Sky Blue", value: "sky" }, { label: "Emerald", value: "emerald" }, { label: "Rose", value: "rose" }] },
        gradientFrom: { type: "text" },
        gradientTo: { type: "text" },
        gradientDir: { type: "select", options: [{ label: "Left → Right", value: "to right" }, { label: "Top → Bottom", value: "to bottom" }, { label: "Diagonal ↘", value: "to bottom right" }, { label: "Diagonal ↗", value: "to top right" }] },
        bgImage: { type: "text" },
        overlayOpacity: { type: "select", options: [{ label: "None", value: "0" }, { label: "Light (20%)", value: "20" }, { label: "Medium (40%)", value: "40" }, { label: "Dark (60%)", value: "60" }, { label: "Very Dark (80%)", value: "80" }] },
        overlayColor: { type: "select", options: [{ label: "Black", value: "black" }, { label: "White", value: "white" }] },
        paddingTop: { type: "select", options: [{ label: "None", value: "none" }, { label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }, { label: "X-Large", value: "xl" }, { label: "2X-Large", value: "2xl" }] },
        paddingBottom: { type: "select", options: [{ label: "None", value: "none" }, { label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }, { label: "X-Large", value: "xl" }, { label: "2X-Large", value: "2xl" }] },
        customCSS: { type: "textarea" },
        ...styleFieldDefs,
      },
      defaultProps: { bgType: "solid", bg: "transparent", gradientFrom: "#667eea", gradientTo: "#764ba2", gradientDir: "to right", bgImage: "", overlayOpacity: "0", overlayColor: "black", paddingTop: "lg", paddingBottom: "lg", customCSS: "", ...styleDefaults },
      render: (props) => {
        const { bgType, bg, gradientFrom, gradientTo, gradientDir, bgImage, overlayOpacity, overlayColor, paddingTop, paddingBottom, customCSS, puck: { renderDropZone } } = props;
        const bgColors: Record<string, string> = { transparent: "transparent", white: "#ffffff", slate: "#f8fafc", dark: "#0a0a0c", sky: "#0ea5e9", emerald: "#10b981", rose: "#f43f5e" };
        const pt: Record<string, string> = { none: "0", sm: "1rem", md: "2rem", lg: "4rem", xl: "6rem", "2xl": "8rem" };
        const pb: Record<string, string> = { none: "0", sm: "1rem", md: "2rem", lg: "4rem", xl: "6rem", "2xl": "8rem" };
        const uid = `section-${Math.random().toString(36).slice(2,8)}`;
        
        let sectionStyle: React.CSSProperties = {
          paddingTop: pt[paddingTop],
          paddingBottom: pb[paddingBottom],
          position: "relative",
          overflow: "hidden",
        };
        
        if (bgType === "solid") {
          sectionStyle.backgroundColor = bgColors[bg] || bg;
        } else if (bgType === "gradient") {
          sectionStyle.background = `linear-gradient(${gradientDir}, ${gradientFrom}, ${gradientTo})`;
        } else if (bgType === "image" && bgImage) {
          sectionStyle.backgroundImage = `url(${bgImage})`;
          sectionStyle.backgroundSize = "cover";
          sectionStyle.backgroundPosition = "center";
        }

        const overlayStyle: React.CSSProperties = overlayOpacity !== "0" ? {
          position: "absolute", inset: 0,
          backgroundColor: overlayColor,
          opacity: parseInt(overlayOpacity) / 100,
          pointerEvents: "none",
        } : {};

        return (
          <Styled p={props} className="w-full" style={sectionStyle}>
            {customCSS && <style>{`.${uid} { ${customCSS} }`}</style>}
            {overlayOpacity !== "0" && <div style={overlayStyle} />}
            <div style={{ position: "relative", zIndex: 1 }}>
              {renderDropZone({ zone: "content" })}
            </div>
          </Styled>
        );
      },
    },
    ContainerBlock: {
      fields: {
        maxWidth: { type: "select", options: [{ label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }, { label: "X-Large", value: "xl" }, { label: "Full Width", value: "full" }] },
        paddingX: { type: "select", options: [{ label: "None", value: "none" }, { label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }] },
        ...styleFieldDefs,
      },
      defaultProps: { maxWidth: "lg", paddingX: "md", ...styleDefaults },
      render: (props) => {
        const { maxWidth, paddingX, puck: { renderDropZone } } = props;
        const widths = { sm: "max-w-3xl", md: "max-w-5xl", lg: "max-w-7xl", xl: "max-w-[96rem]", full: "max-w-full" };
        const px = { none: "px-0", sm: "px-2", md: "px-4 md:px-6", lg: "px-8 md:px-12" };
        return <Styled p={props} className={`mx-auto w-full ${widths[maxWidth]} ${px[paddingX]}`}>{renderDropZone({ zone: "container-content" })}</Styled>;
      }
    },
    TwoColumnBlock: {
      fields: {
        leftWidth: { type: "select", options: [{ label: "50% (1/2)", value: "1/2" }, { label: "33% (1/3)", value: "1/3" }, { label: "66% (2/3)", value: "2/3" }, { label: "25% (1/4)", value: "1/4" }, { label: "75% (3/4)", value: "3/4" }] },
        ...styleFieldDefs,
      },
      defaultProps: { leftWidth: "1/2", ...styleDefaults },
      render: (props) => {
        const { leftWidth, puck: { renderDropZone } } = props;
        let leftCol = "md:w-1/2";
        let rightCol = "md:w-1/2";
        if (leftWidth === "1/3") { leftCol = "md:w-1/3"; rightCol = "md:w-2/3"; }
        if (leftWidth === "2/3") { leftCol = "md:w-2/3"; rightCol = "md:w-1/3"; }
        if (leftWidth === "1/4") { leftCol = "md:w-1/4"; rightCol = "md:w-3/4"; }
        if (leftWidth === "3/4") { leftCol = "md:w-3/4"; rightCol = "md:w-1/4"; }
        
        return (
          <Styled p={props} className="flex flex-col md:flex-row w-full gap-8">
            <div className={`w-full ${leftCol}`}>{renderDropZone({ zone: "left-col" })}</div>
            <div className={`w-full ${rightCol}`}>{renderDropZone({ zone: "right-col" })}</div>
          </Styled>
        );
      }
    },
    ThreeColumnBlock: {
      fields: { gap: { type: "select", options: [{ label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }] }, ...styleFieldDefs },
      defaultProps: { gap: "md", ...styleDefaults },
      render: (props) => {
        const { gap, puck: { renderDropZone } } = props;
        const gaps = { sm: "gap-4", md: "gap-8", lg: "gap-12" };
        return (
          <Styled p={props} className={`grid grid-cols-1 md:grid-cols-3 ${gaps[gap]}`}>
            <div>{renderDropZone({ zone: "col-1" })}</div>
            <div>{renderDropZone({ zone: "col-2" })}</div>
            <div>{renderDropZone({ zone: "col-3" })}</div>
          </Styled>
        )
      }
    },
    SpacerBlock: {
      fields: { height: { type: "select", options: [{ label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }, { label: "X-Large", value: "xl" }, { label: "2X-Large", value: "2xl" }, { label: "3X-Large", value: "3xl" }] }, ...styleFieldDefs },
      defaultProps: { height: "md", ...styleDefaults },
      render: (props) => {
        const { height } = props;
        const heights = { sm: "h-4", md: "h-8", lg: "h-16", xl: "h-24", "2xl": "h-32", "3xl": "h-48" };
        return <Styled p={props} className={`w-full block ${heights[height]}`} aria-hidden="true" />;
      }
    },
    DividerBlock: {
      fields: {
        color: { type: "select", options: [{ label: "Slate", value: "slate" }, { label: "Sky", value: "sky" }, { label: "Emerald", value: "emerald" }] },
        style: { type: "select", options: [{ label: "Solid", value: "solid" }, { label: "Dashed", value: "dashed" }, { label: "Dotted", value: "dotted" }] },
        ...styleFieldDefs,
      },
      defaultProps: { color: "slate", style: "solid", ...styleDefaults },
      render: (props) => {
        const { color, style } = props;
        const colors = { slate: "border-slate-200", sky: "border-sky-200", emerald: "border-emerald-200" };
        const styles = { solid: "border-solid", dashed: "border-dashed", dotted: "border-dotted" };
        return <Styled p={props}><hr className={`w-full border-t-2 my-8 ${colors[color]} ${styles[style]}`} /></Styled>;
      }
    },
    FlexRowBlock: {
      fields: {
        align: { type: "select", options: [{ label: "Start", value: "start" }, { label: "Center", value: "center" }, { label: "End", value: "end" }] },
        justify: { type: "select", options: [{ label: "Start", value: "start" }, { label: "Center", value: "center" }, { label: "Space Between", value: "between" }, { label: "Space Around", value: "around" }] },
        gap: { type: "select", options: [{ label: "None", value: "none" }, { label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }, { label: "X-Large", value: "xl" }] },
        ...styleFieldDefs,
      },
      defaultProps: { align: "center", justify: "between", gap: "md", ...styleDefaults },
      render: (props) => {
        const { align, justify, gap, puck: { renderDropZone } } = props;
        const aligns = { start: "items-start", center: "items-center", end: "items-end" };
        const justifies = { start: "justify-start", center: "justify-center", between: "justify-between", around: "justify-around" };
        const gaps = { none: "gap-0", sm: "gap-2 md:gap-4", md: "gap-6 md:gap-8", lg: "gap-10 md:gap-12", xl: "gap-16 md:gap-24" };
        return (
          <Styled p={props} className={`flex flex-col md:flex-row w-full ${aligns[align]} ${justifies[justify]} ${gaps[gap]}`}>
            <div className="flex-1 w-full">{renderDropZone({ zone: "left" })}</div>
            <div className="flex-1 w-full">{renderDropZone({ zone: "right" })}</div>
          </Styled>
        );
      }
    },
    FlexColumnBlock: {
      fields: {
        align: { type: "select", options: [{ label: "Start", value: "start" }, { label: "Center", value: "center" }, { label: "End", value: "end" }] },
        justify: { type: "select", options: [{ label: "Start", value: "start" }, { label: "Center", value: "center" }, { label: "Space Between", value: "between" }] },
        gap: { type: "select", options: [{ label: "None", value: "none" }, { label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }, { label: "X-Large", value: "xl" }] },
        ...styleFieldDefs,
      },
      defaultProps: { align: "start", justify: "start", gap: "md", ...styleDefaults },
      render: (props) => {
        const { align, justify, gap, puck: { renderDropZone } } = props;
        const aligns = { start: "items-start text-left", center: "items-center text-center", end: "items-end text-right" };
        const justifies = { start: "justify-start", center: "justify-center", between: "justify-between" };
        const gaps = { none: "gap-0", sm: "gap-2", md: "gap-4", lg: "gap-8", xl: "gap-12" };
        return <Styled p={props} className={`flex flex-col w-full ${aligns[align]} ${justifies[justify]} ${gaps[gap]}`}>{renderDropZone({ zone: "col-content" })}</Styled>;
      }
    },
    FeatureGrid: {
      fields: {
        title: { type: "text" },
        columns: { type: "select", options: [{ label: "2 Columns", value: "2" }, { label: "3 Columns", value: "3" }, { label: "4 Columns", value: "4" }] },
        gap: { type: "select", options: [{ label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }] },
        ...styleFieldDefs,
      },
      defaultProps: { title: "Features", columns: "3", gap: "md", ...styleDefaults },
      render: (props) => {
        const { title, columns, gap, puck: { renderDropZone } } = props;
        const gridCols = { "2": "md:grid-cols-2", "3": "md:grid-cols-3", "4": "md:grid-cols-4 lg:grid-cols-4" };
        const gaps = { sm: "gap-4", md: "gap-8", lg: "gap-12" };
        return (
          <Styled p={props} className="w-full py-8">
            {title && <h2 className="text-3xl font-bold tracking-tight text-center mb-10">{title}</h2>}
            <div className={`grid grid-cols-1 ${gridCols[columns]} ${gaps[gap]}`}>
              {Array.from({ length: parseInt(columns) }).map((_, i) => (
                <div key={i}>{renderDropZone({ zone: `feature-${i}` })}</div>
              ))}
            </div>
          </Styled>
        );
      }
    },
    CardBlock: {
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        padding: { type: "select", options: [{ label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }] },
        shadow: { type: "select", options: [{ label: "None", value: "none" }, { label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }, { label: "X-Large", value: "xl" }] },
        bgColor: { type: "select", options: [{ label: "White", value: "white" }, { label: "Light Gray", value: "slate" }, { label: "Dark", value: "dark" }, { label: "Sky", value: "sky" }, { label: "Emerald", value: "emerald" }, { label: "Rose", value: "rose" }] },
        borderRadius: { type: "select", options: [{ label: "Sharp", value: "none" }, { label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }, { label: "X-Large", value: "xl" }, { label: "2X-Large", value: "2xl" }] },
        borderWidth: { type: "select", options: [{ label: "None", value: "none" }, { label: "Thin (1px)", value: "thin" }, { label: "Medium (2px)", value: "medium" }, { label: "Thick (4px)", value: "thick" }] },
        borderColor: { type: "select", options: [{ label: "Slate", value: "slate" }, { label: "Sky", value: "sky" }, { label: "Emerald", value: "emerald" }, { label: "Rose", value: "rose" }, { label: "Amber", value: "amber" }] },
        customCSS: { type: "textarea" },
        ...styleFieldDefs,
      },
      defaultProps: { title: "Card Title", description: "A brief description of this feature or product.", padding: "md", shadow: "sm", bgColor: "white", borderRadius: "lg", borderWidth: "thin", borderColor: "slate", customCSS: "", ...styleDefaults },
      render: (props) => {
        const { title, description, padding, shadow, bgColor, borderRadius, borderWidth, borderColor, customCSS, puck: { renderDropZone } } = props;
        const paddings: Record<string, React.CSSProperties> = { sm: { padding: "1rem" }, md: { padding: "1.5rem 2rem" }, lg: { padding: "2rem 3rem" } };
        const shadows: Record<string, string> = { none: "shadow-none", sm: "shadow-sm", md: "shadow-md", lg: "shadow-lg", xl: "shadow-2xl" };
        const bgColors: Record<string, string> = { white: "#ffffff", slate: "#f8fafc", dark: "#0f172a", sky: "#e0f2fe", emerald: "#d1fae5", rose: "#ffe4e6" };
        const textColors: Record<string, string> = { white: "#0f172a", slate: "#0f172a", dark: "#f8fafc", sky: "#0c4a6e", emerald: "#064e3b", rose: "#881337" };
        const radii: Record<string, string> = { none: "0", sm: "4px", md: "8px", lg: "12px", xl: "16px", "2xl": "24px" };
        const borders: Record<string, string> = { none: "0px solid transparent", thin: "1px solid", medium: "2px solid", thick: "4px solid" };
        const borderColors: Record<string, string> = { slate: "#e2e8f0", sky: "#bae6fd", emerald: "#a7f3d0", rose: "#fecdd3", amber: "#fde68a" };
        const uid = `card-${title.replace(/\s+/g,'').slice(0,8)}`;

        const cardStyle: React.CSSProperties = {
          ...paddings[padding],
          backgroundColor: bgColors[bgColor],
          color: textColors[bgColor],
          borderRadius: radii[borderRadius],
          border: borderWidth === "none" ? "none" : `${borders[borderWidth]} ${borderColors[borderColor]}`,
        };

        return (
          <Styled p={props} className={`transition-all h-full flex flex-col ${shadows[shadow]} ${uid}`} style={cardStyle}>
            {customCSS && <style>{`.${uid} { ${customCSS} }`}</style>}
            <h3 className="text-xl font-bold mb-2" style={{ color: textColors[bgColor] }}>{title}</h3>
            <p className="mb-4 flex-1 opacity-75" style={{ color: textColors[bgColor] }}>{description}</p>
            {renderDropZone({ zone: "card-content" })}
          </Styled>
        );
      }
    },

    // --- FORMS & INPUTS ---
    FormBlock: {
      fields: {
        actionUrl: { type: "text" },
        buttonText: { type: "text" },
        padding: { type: "select", options: [{ label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }] },
        ...styleFieldDefs,
      },
      defaultProps: { actionUrl: "/api/submit", buttonText: "Submit", padding: "md", ...styleDefaults },
      render: (props) => {
        const { actionUrl, buttonText, padding, puck: { renderDropZone } } = props;
        const paddings = { sm: "p-4", md: "p-6 md:p-8", lg: "p-8 md:p-12" };
        return (
          <Styled p={props} className={`w-full max-w-xl mx-auto space-y-4 bg-white rounded-xl border border-slate-200 shadow-sm ${paddings[padding]}`}>
            {renderDropZone({ zone: "form-fields" })}
            <Button type="submit" className="w-full mt-4">{buttonText}</Button>
          </Styled>
        );
      }
    },
    NewsletterFormBlock: {
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        buttonText: { type: "text" },
        bg: { type: "select", options: [{ label: "Slate", value: "slate" }, { label: "Sky", value: "sky" }, { label: "Emerald", value: "emerald" }] },
        ...styleFieldDefs,
      },
      defaultProps: { title: "Subscribe to our newsletter", description: "Get the latest updates directly in your inbox.", buttonText: "Subscribe", bg: "sky", ...styleDefaults },
      render: (props) => {
        const { title, description, buttonText, bg } = props;
        const bgClasses = { slate: "bg-slate-900 text-white", sky: "bg-sky-600 text-white", emerald: "bg-emerald-600 text-white" };
        const btnClasses = { slate: "bg-white text-slate-900 hover:bg-slate-100", sky: "bg-slate-900 text-white hover:bg-slate-800", emerald: "bg-slate-900 text-white hover:bg-slate-800" };
        return (
          <Styled p={props} className={`w-full p-8 md:p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 ${bgClasses[bg]}`}>
            <div className="max-w-md">
              <h3 className="text-2xl font-bold mb-2">{title}</h3>
              <p className="text-white/80">{description}</p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <input type="email" placeholder="Enter your email" required className="flex-1 md:w-64 px-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-white" />
              <button type="submit" className={`px-6 py-3 rounded-lg font-bold transition-colors ${btnClasses[bg]}`}>{buttonText}</button>
            </form>
          </Styled>
        );
      }
    },
    TextInputBlock: {
      fields: {
        label: { type: "text" },
        placeholder: { type: "text" },
        type: { type: "select", options: [{ label: "Text", value: "text" }, { label: "Email", value: "email" }, { label: "Password", value: "password" }, { label: "Number", value: "number" }] },
        required: { type: "radio", options: [{ label: "Yes", value: true as any }, { label: "No", value: false as any }] },
        ...styleFieldDefs,
      },
      defaultProps: { label: "Email Address", placeholder: "you@example.com", type: "email", required: true, ...styleDefaults },
      render: (props) => {
        const { label, placeholder, type, required } = props;
        return (
          <Styled p={props} className="w-full space-y-1 py-1">
            <label className="text-sm font-medium text-slate-700">{label} {required && <span className="text-red-500">*</span>}</label>
            <input type={type} placeholder={placeholder} required={required} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </Styled>
        );
      }
    },
    TextAreaBlock: {
      fields: {
        label: { type: "text" },
        placeholder: { type: "text" },
        rows: { type: "number" },
        required: { type: "radio", options: [{ label: "Yes", value: true as any }, { label: "No", value: false as any }] },
        ...styleFieldDefs,
      },
      defaultProps: { label: "Message", placeholder: "How can we help?", rows: 4, required: false, ...styleDefaults },
      render: (props) => {
        const { label, placeholder, rows, required } = props;
        return (
          <Styled p={props} className="w-full space-y-1 py-1">
            <label className="text-sm font-medium text-slate-700">{label} {required && <span className="text-red-500">*</span>}</label>
            <textarea rows={rows} placeholder={placeholder} required={required} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </Styled>
        );
      }
    },
    CheckboxBlock: {
      fields: {
        label: { type: "text" },
        required: { type: "radio", options: [{ label: "Yes", value: true as any }, { label: "No", value: false as any }] },
        ...styleFieldDefs,
      },
      defaultProps: { label: "I agree to the terms and conditions", required: true, ...styleDefaults },
      render: (props) => {
        const { label, required } = props;
        return (
          <Styled p={props} className="w-full flex items-center space-x-2 py-2">
            <input type="checkbox" required={required} className="rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
            <label className="text-sm text-slate-700">{label} {required && <span className="text-red-500">*</span>}</label>
          </Styled>
        );
      }
    },
    RadioGroupBlock: {
      fields: {
        label: { type: "text" },
        name: { type: "text" },
        options: { type: "textarea" },
        ...styleFieldDefs,
      },
      defaultProps: { label: "Choose an option", name: "radio_group_1", options: "Option A\nOption B\nOption C", ...styleDefaults },
      render: (props) => {
        const { label, name, options } = props;
        return (
          <Styled p={props} className="w-full space-y-2 py-2">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <div className="space-y-2">
              {options.split('\n').filter(Boolean).map((opt, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <input type="radio" id={`${name}-${i}`} name={name} value={opt} className="text-sky-600 focus:ring-sky-500" />
                  <label htmlFor={`${name}-${i}`} className="text-sm text-slate-600">{opt}</label>
                </div>
              ))}
            </div>
          </Styled>
        );
      }
    },
    SelectBlock: {
      fields: {
        label: { type: "text" },
        options: { type: "textarea" },
        required: { type: "radio", options: [{ label: "Yes", value: true as any }, { label: "No", value: false as any }] },
        ...styleFieldDefs,
      },
      defaultProps: { label: "Select an option", options: "Option 1\nOption 2\nOption 3", required: false, ...styleDefaults },
      render: (props) => {
        const { label, options, required } = props;
        return (
          <Styled p={props} className="w-full space-y-1 py-1">
            <label className="text-sm font-medium text-slate-700">{label} {required && <span className="text-red-500">*</span>}</label>
            <select required={required} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white">
              <option value="">Select...</option>
              {options.split("\n").filter(Boolean).map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </Styled>
        );
      }
    },

    // --- INTERACTIVE & ACTION ---
    ButtonBlock: {
      fields: {
        text: { type: "text" },
        href: { type: "text" },
        variant: { type: "select", options: [
          { label: "Default", value: "default" }, { label: "Destructive", value: "destructive" },
          { label: "Outline", value: "outline" }, { label: "Secondary", value: "secondary" },
          { label: "Ghost", value: "ghost" }, { label: "Link", value: "link" }
        ]},
        size: { type: "select", options: [{ label: "Default", value: "default" }, { label: "Small", value: "sm" }, { label: "Large", value: "lg" }] },
        width: { type: "select", options: [{ label: "Auto", value: "auto" }, { label: "Full Width", value: "full" }] },
        ...styleFieldDefs,
      },
      defaultProps: { text: "Click Me", href: "#", variant: "default", size: "default", width: "auto", ...styleDefaults },
      render: (props) => {
        const { text, href, variant, size, width } = props;
        return (
          <Styled p={props} className={`py-2 ${width === 'full' ? 'w-full' : 'inline-block'}`}>
            <a href={href} className={width === 'full' ? 'block w-full' : 'inline-block'}>
              <Button variant={variant} size={size} className={width === 'full' ? 'w-full' : ''}>{text}</Button>
            </a>
          </Styled>
        );
      }
    },
    ButtonGroupBlock: {
      fields: {
        align: { type: "select", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }, { label: "Right", value: "right" }] },
        ...styleFieldDefs,
      },
      defaultProps: { align: "left", ...styleDefaults },
      render: (props) => {
        const { align, puck: { renderDropZone } } = props;
        const aligns = { left: "justify-start", center: "justify-center", right: "justify-end" };
        return (
          <Styled p={props} className={`flex flex-wrap gap-4 w-full py-4 ${aligns[align]}`}>
            {renderDropZone({ zone: "buttons" })}
          </Styled>
        );
      }
    },
    IconButtonBlock: {
      fields: {
        icon: { type: "text" },
        href: { type: "text" },
        variant: { type: "select", options: [{ label: "Default", value: "default" }, { label: "Outline", value: "outline" }, { label: "Ghost", value: "ghost" }] },
        size: { type: "select", options: [{ label: "Default", value: "default" }, { label: "Small", value: "sm" }, { label: "Large", value: "lg" }] },
        ...styleFieldDefs,
      },
      defaultProps: { icon: "Star", href: "#", variant: "outline", size: "default", ...styleDefaults },
      render: (props) => {
        const { icon, href, variant, size } = props;
        const LucideIcon = { Star, Heart, Shield, Zap, Mail, Phone, MapPin, Check, ArrowRight }[icon] || Star;
        return (
          <Styled p={props} className="py-2 inline-block">
            <a href={href}>
              <Button variant={variant as any} size="icon" className={size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10"}>
                <LucideIcon className={size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"} />
              </Button>
            </a>
          </Styled>
        );
      }
    },
    LinkBlock: {
      fields: {
        text: { type: "text" },
        href: { type: "text" },
        color: { type: "select", options: [{ label: "Sky Blue", value: "sky" }, { label: "Emerald", value: "emerald" }, { label: "Slate", value: "slate" }, { label: "White", value: "white" }] },
        size: { type: "select", options: [{ label: "Small", value: "sm" }, { label: "Normal", value: "base" }, { label: "Large", value: "lg" }] },
        ...styleFieldDefs,
      },
      defaultProps: { text: "Learn more", href: "#", color: "sky", size: "base", ...styleDefaults },
      render: (props) => {
        const { text, href, color, size } = props;
        const colors = { sky: "text-sky-600 hover:text-sky-800", emerald: "text-emerald-600 hover:text-emerald-800", slate: "text-slate-600 hover:text-slate-800", white: "text-white hover:text-slate-200" };
        const sizes = { sm: "text-sm", base: "text-base", lg: "text-lg" };
        return <Styled p={props} className="py-2 inline-block"><a href={href} className={`font-medium underline underline-offset-4 transition-colors ${colors[color]} ${sizes[size]}`}>{text}</a></Styled>;
      }
    },
    TabsBlock: {
      fields: {
        tabs: { type: "array", arrayFields: { title: { type: "text" } } },
        ...styleFieldDefs,
      },
      defaultProps: { tabs: [{ title: "Tab 1" }, { title: "Tab 2" }], ...styleDefaults },
      render: function Tabs(props) {
        const { tabs, puck: { renderDropZone } } = props;
        const [active, setActive] = useState(0);
        return (
          <Styled p={props} className="w-full">
            <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar">
              {tabs.map((tab, i) => (
                <button 
                  key={i} 
                  onClick={() => setActive(i)} 
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${active === i ? "border-b-2 border-sky-500 text-sky-600" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
                >
                  {tab.title}
                </button>
              ))}
            </div>
            <div className="py-6">
              {renderDropZone({ zone: `tab-content-${active}` })}
            </div>
          </Styled>
        );
      }
    },
    PaginationBlock: {
      fields: { totalPages: { type: "number" }, currentPage: { type: "number" }, ...styleFieldDefs },
      defaultProps: { totalPages: 5, currentPage: 1, ...styleDefaults },
      render: (props) => {
        const { totalPages, currentPage } = props;
        return (
          <Styled p={props} className="flex justify-center items-center space-x-2 py-8">
            <button className="px-3 py-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50" disabled={currentPage <= 1}>Prev</button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} className={`px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-sky-500 text-white border-sky-500' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                {i + 1}
              </button>
            ))}
            <button className="px-3 py-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50" disabled={currentPage >= totalPages}>Next</button>
          </Styled>
        );
      }
    },
    BackToTopBlock: {
      fields: { position: { type: "select", options: [{ label: "Bottom Right", value: "bottom-right" }, { label: "Bottom Left", value: "bottom-left" }] }, showText: { type: "radio", options: [{ label: "Yes", value: true as any }, { label: "No", value: false as any }] }, ...styleFieldDefs },
      defaultProps: { position: "bottom-right", showText: false, ...styleDefaults },
      render: (props) => {
        const { position, showText } = props;
        return (
          <Styled p={props} className={`fixed bottom-6 z-50 ${position === "bottom-right" ? "right-6" : "left-6"}`}>
            <a href="#" className="flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-full shadow-xl hover:bg-slate-800 transition-colors">
              <ArrowUp className="w-5 h-5" />
              {showText && <span className="font-semibold text-sm">Top</span>}
            </a>
          </Styled>
        );
      }
    },

    // --- UI ELEMENTS ---
    AlertBlock: {
      fields: {
        title: { type: "text" },
        message: { type: "textarea" },
        variant: { type: "select", options: [{ label: "Info", value: "info" }, { label: "Success", value: "success" }, { label: "Warning", value: "warning" }, { label: "Error", value: "error" }] },
        ...styleFieldDefs,
      },
      defaultProps: { title: "Notice", message: "This is an important alert message.", variant: "info", ...styleDefaults },
      render: (props) => {
        const { title, message, variant } = props;
        const variants = {
          info: "bg-blue-50 text-blue-900 border-blue-200",
          success: "bg-emerald-50 text-emerald-900 border-emerald-200",
          warning: "bg-amber-50 text-amber-900 border-amber-200",
          error: "bg-red-50 text-red-900 border-red-200"
        };
        return (
          <Styled p={props} className={`w-full p-4 rounded-lg border my-4 ${variants[variant]}`}>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 opacity-80" />
              <div>
                <h4 className="font-bold text-sm mb-1">{title}</h4>
                <p className="text-sm opacity-90 leading-relaxed">{message}</p>
              </div>
            </div>
          </Styled>
        );
      }
    },
    BadgeBlock: {
      fields: {
        text: { type: "text" },
        variant: { type: "select", options: [{ label: "Default", value: "default" }, { label: "Secondary", value: "secondary" }, { label: "Destructive", value: "destructive" }, { label: "Outline", value: "outline" }] },
        ...styleFieldDefs,
      },
      defaultProps: { text: "New Feature", variant: "default", ...styleDefaults },
      render: (props) => {
        const { text, variant } = props;
        const variants = {
          default: "bg-slate-900 text-white",
          secondary: "bg-slate-100 text-slate-900",
          destructive: "bg-red-500 text-white",
          outline: "border border-slate-200 text-slate-900"
        };
        return <Styled p={props} className="py-2 inline-block"><span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]}`}>{text}</span></Styled>;
      }
    },
    AvatarBlock: {
      fields: {
        src: { type: "text" },
        alt: { type: "text" },
        size: { type: "select", options: [{ label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }, { label: "X-Large", value: "xl" }] },
        ...styleFieldDefs,
      },
      defaultProps: { src: "https://i.pravatar.cc/150?u=a042581f4e29026704d", alt: "Avatar", size: "md", ...styleDefaults },
      render: (props) => {
        const { src, alt, size } = props;
        const sizes = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16", xl: "w-24 h-24" };
        return <Styled p={props}><img src={src} alt={alt} className={`rounded-full object-cover shadow-sm ${sizes[size]}`} /></Styled>;
      }
    },
    BreadcrumbBlock: {
      fields: {
        items: { type: "array", arrayFields: { label: { type: "text" }, href: { type: "text" } } },
        ...styleFieldDefs,
      },
      defaultProps: { items: [{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: "Current", href: "#" }], ...styleDefaults },
      render: (props) => {
        const { items } = props;
        return (
          <Styled p={props} className="flex text-sm text-slate-500 py-4">
            <ol className="flex items-center space-x-2">
              {items.map((item, i) => (
                <li key={i} className="flex items-center">
                  {i > 0 && <span className="mx-2 text-slate-300">/</span>}
                  <a href={item.href} className="hover:text-slate-900 transition-colors">{item.label}</a>
                </li>
              ))}
            </ol>
          </Styled>
        );
      }
    },
    ProgressBarBlock: {
      fields: {
        progress: { type: "number" },
        label: { type: "text" },
        showPercentage: { type: "radio", options: [{ label: "Yes", value: true as any }, { label: "No", value: false as any }] },
        ...styleFieldDefs,
      },
      defaultProps: { progress: 65, label: "Project Completion", showPercentage: true, ...styleDefaults },
      render: (props) => {
        const { progress, label, showPercentage } = props;
        return (
          <Styled p={props} className="w-full py-4 space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-slate-700">{label}</span>
              {showPercentage && <span className="text-sm font-semibold text-sky-600">{progress}%</span>}
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
            </div>
          </Styled>
        );
      }
    },
    CountdownTimerBlock: {
      fields: {
        targetDate: { type: "text" },
        label: { type: "text" },
        ...styleFieldDefs,
      },
      defaultProps: { targetDate: "2026-12-31T23:59:59", label: "Sale ends in:", ...styleDefaults },
      render: function Countdown(props) {
        const { targetDate, label } = props;
        const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
        
        useEffect(() => {
          const target = new Date(targetDate).getTime();
          const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = target - now;
            if (distance < 0) {
              clearInterval(timer);
              return;
            }
            setTimeLeft({
              d: Math.floor(distance / (1000 * 60 * 60 * 24)),
              h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
              m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
              s: Math.floor((distance % (1000 * 60)) / 1000)
            });
          }, 1000);
          return () => clearInterval(timer);
        }, [targetDate]);

        return (
          <Styled p={props} className="w-full py-6 flex flex-col items-center">
            <div className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest">{label}</div>
            <div className="flex gap-4">
              {[
                { label: "Days", value: timeLeft.d },
                { label: "Hours", value: timeLeft.h },
                { label: "Mins", value: timeLeft.m },
                { label: "Secs", value: timeLeft.s }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-black text-slate-900 shadow-sm">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <span className="text-xs text-slate-500 mt-2 font-medium uppercase">{item.label}</span>
                </div>
              ))}
            </div>
          </Styled>
        );
      }
    },

    // --- MEDIA & SOCIAL ---
    ImageBlock: {
      fields: {
        src: { type: "text" },
        alt: { type: "text" },
        href: { type: "text" },
        rounded: { type: "select", options: [{ label: "None", value: "none" }, { label: "Medium", value: "md" }, { label: "X-Large", value: "xl" }, { label: "Full Circle", value: "full" }] },
        shadow: { type: "select", options: [{ label: "None", value: "none" }, { label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }, { label: "X-Large", value: "xl" }] },
        ...styleFieldDefs,
      },
      defaultProps: { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", alt: "Placeholder Image", href: "", rounded: "xl", shadow: "lg", ...styleDefaults },
      render: (props) => {
        const { src, alt, href, rounded, shadow } = props;
        const roundedClasses = { none: "rounded-none", md: "rounded-xl", xl: "rounded-3xl", full: "rounded-full" };
        const shadowClasses = { none: "shadow-none", sm: "shadow-sm", md: "shadow-md", lg: "shadow-lg", xl: "shadow-2xl" };
        const imgEl = <img src={src} alt={alt} className={`max-w-full h-auto object-cover ${roundedClasses[rounded]} ${shadowClasses[shadow]}`} />;
        return (
          <Styled p={props} className="w-full flex justify-center py-4">
            {href ? <a href={href} target="_blank" rel="noopener noreferrer">{imgEl}</a> : imgEl}
          </Styled>
        );
      }
    },
    ImageGalleryBlock: {
      fields: {
        images: { type: "array", arrayFields: { src: { type: "text" }, alt: { type: "text" } } },
        columns: { type: "select", options: [{ label: "2 Columns", value: "2" }, { label: "3 Columns", value: "3" }, { label: "4 Columns", value: "4" }] },
        ...styleFieldDefs,
      },
      defaultProps: { 
        images: [
          { src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085", alt: "Tech" },
          { src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6", alt: "Code" },
          { src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97", alt: "Work" }
        ],
        columns: "3",
        ...styleDefaults
      },
      render: (props) => {
        const { images, columns } = props;
        const gridCols = { "2": "md:grid-cols-2", "3": "md:grid-cols-3", "4": "md:grid-cols-4" };
        return (
          <Styled p={props} className={`grid grid-cols-1 gap-4 py-8 ${gridCols[columns]}`}>
            {images.map((img, i) => (
              <div key={i} className="w-full aspect-square overflow-hidden rounded-xl bg-slate-100">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </Styled>
        );
      }
    },
    IconBlock: {
      fields: {
        icon: { type: "select", options: [{ label: "Star", value: "Star" }, { label: "Heart", value: "Heart" }, { label: "Shield", value: "Shield" }, { label: "Zap", value: "Zap" }, { label: "Mail", value: "Mail" }, { label: "Phone", value: "Phone" }, { label: "MapPin", value: "MapPin" }, { label: "Check", value: "Check" }] },
        size: { type: "select", options: [{ label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }, { label: "X-Large", value: "xl" }, { label: "2X-Large", value: "2xl" }] },
        color: { type: "select", options: [{ label: "Slate", value: "slate" }, { label: "Sky Blue", value: "sky" }, { label: "Emerald", value: "emerald" }, { label: "Rose", value: "rose" }, { label: "Amber", value: "amber" }] },
        ...styleFieldDefs,
      },
      defaultProps: { icon: "Star", size: "md", color: "amber", ...styleDefaults },
      render: (props) => {
        const { icon, size, color } = props;
        const LucideIcon = { Star, Heart, Shield, Zap, Mail, Phone, MapPin, Check }[icon] || Star;
        const sizes = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12", xl: "w-16 h-16", "2xl": "w-24 h-24" };
        const colors = { slate: "text-slate-600", sky: "text-sky-500", emerald: "text-emerald-500", rose: "text-rose-500", amber: "text-amber-500" };
        return <Styled p={props} className="py-2 flex justify-center"><LucideIcon className={`${sizes[size]} ${colors[color]}`} /></Styled>;
      }
    },
    VideoEmbedBlock: {
      fields: {
        url: { type: "text" },
        aspectRatio: { type: "select", options: [{ label: "Video (16:9)", value: "video" }, { label: "Square (1:1)", value: "square" }] },
        rounded: { type: "select", options: [{ label: "None", value: "none" }, { label: "Medium", value: "md" }, { label: "X-Large", value: "xl" }] },
        ...styleFieldDefs,
      },
      defaultProps: { url: "https://www.youtube.com/embed/dQw4w9WgXcQ", aspectRatio: "video", rounded: "xl", ...styleDefaults },
      render: (props) => {
        const { url, aspectRatio, rounded } = props;
        const roundedClasses = { none: "rounded-none", md: "rounded-xl", xl: "rounded-2xl" };
        return (
          <Styled p={props} className="w-full py-4">
            <div className={`w-full overflow-hidden shadow-lg border border-slate-200 ${aspectRatio === "video" ? "aspect-video" : "aspect-square"} ${roundedClasses[rounded]}`}>
              <iframe src={url} className="w-full h-full" allowFullScreen></iframe>
            </div>
          </Styled>
        );
      }
    },
    SocialIconsBlock: {
      fields: {
        platforms: { type: "text" },
        align: { type: "select", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }, { label: "Right", value: "right" }] },
        style: { type: "select", options: [{ label: "Solid", value: "solid" }, { label: "Outline", value: "outline" }] },
        ...styleFieldDefs,
      },
      defaultProps: { platforms: "facebook,twitter,instagram", align: "center", style: "solid", ...styleDefaults },
      render: (props) => {
        const { platforms, align, style } = props;
        const aligns = { left: "justify-start", center: "justify-center", right: "justify-end" };
        const baseClasses = style === "solid" ? "bg-slate-900 text-white border-transparent hover:bg-slate-700" : "bg-transparent text-slate-700 border-slate-300 hover:bg-slate-50";
        const iconClasses = `w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${baseClasses}`;
        
        return (
          <Styled p={props} className={`flex gap-4 py-4 w-full ${aligns[align]}`}>
            {platforms.includes("facebook") && <a href="#" className={iconClasses}><FacebookIcon className="w-5 h-5" /></a>}
            {platforms.includes("twitter") && <a href="#" className={iconClasses}><TwitterIcon className="w-5 h-5" /></a>}
            {platforms.includes("instagram") && <a href="#" className={iconClasses}><InstagramIcon className="w-5 h-5" /></a>}
            {platforms.includes("linkedin") && <a href="#" className={iconClasses}><LinkedinIcon className="w-5 h-5" /></a>}
            {platforms.includes("youtube") && <a href="#" className={iconClasses}><YoutubeIcon className="w-5 h-5" /></a>}
            {platforms.includes("github") && <a href="#" className={iconClasses}><GithubIcon className="w-5 h-5" /></a>}
          </Styled>
        );
      }
    },
    ShareButtonsBlock: {
      fields: {
        url: { type: "text" },
        text: { type: "text" },
        align: { type: "select", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }, { label: "Right", value: "right" }] },
        ...styleFieldDefs,
      },
      defaultProps: { url: "https://example.com", text: "Check this out!", align: "left", ...styleDefaults },
      render: (props) => {
        const { url, text, align } = props;
        const aligns = { left: "justify-start", center: "justify-center", right: "justify-end" };
        return (
          <Styled p={props} className={`flex flex-wrap items-center gap-3 py-4 w-full ${aligns[align]}`}>
            <span className="text-sm font-semibold text-slate-500 mr-2">Share:</span>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer" className="bg-[#1DA1F2] text-white px-3 py-1.5 rounded text-sm font-medium hover:opacity-90 flex items-center gap-2"><TwitterIcon className="w-4 h-4"/> Tweet</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="bg-[#4267B2] text-white px-3 py-1.5 rounded text-sm font-medium hover:opacity-90 flex items-center gap-2"><FacebookIcon className="w-4 h-4"/> Share</a>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer" className="bg-[#0077b5] text-white px-3 py-1.5 rounded text-sm font-medium hover:opacity-90 flex items-center gap-2"><LinkedinIcon className="w-4 h-4"/> Post</a>
          </Styled>
        );
      }
    },

    // --- COMPOUND / COMPLEX ---
    HeroBlock: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        ctaText: { type: "text" },
        ctaLink: { type: "text" },
        image: { type: "text" },
        bg: { type: "select", options: [{ label: "Primary (Emerald)", value: "primary" }, { label: "Dark", value: "dark" }, { label: "Light", value: "light" }] },
        paddingTop: { type: "select", options: [{ label: "Medium", value: "md" }, { label: "Large", value: "lg" }, { label: "X-Large", value: "xl" }, { label: "2X-Large", value: "2xl" }] },
        paddingBottom: { type: "select", options: [{ label: "Medium", value: "md" }, { label: "Large", value: "lg" }, { label: "X-Large", value: "xl" }, { label: "2X-Large", value: "2xl" }] },
        ...styleFieldDefs,
      },
      defaultProps: {
        title: "Build Beautiful Pages",
        subtitle: "Deploy faster with our visual page editor built directly into the Next.js platform.",
        ctaText: "Get Started",
        ctaLink: "#",
        image: "",
        bg: "primary",
        paddingTop: "xl",
        paddingBottom: "xl",
        ...styleDefaults
      },
      render: (props) => {
        const { title, subtitle, ctaText, ctaLink, image, bg, paddingTop, paddingBottom, puck: { renderDropZone } } = props;
        const bgClasses = {
          primary: "bg-emerald-600 text-white",
          dark: "bg-slate-900 text-white",
          light: "bg-slate-100 text-slate-900"
        };
        const btnClasses = {
          primary: "bg-slate-900 text-white hover:bg-slate-800",
          dark: "bg-emerald-500 text-white hover:bg-emerald-600",
          light: "bg-emerald-600 text-white hover:bg-emerald-700"
        };
        const pt = { md: "pt-12 md:pt-16", lg: "pt-20 md:pt-28", xl: "pt-32 md:pt-40", "2xl": "pt-40 md:pt-52" };
        const pb = { md: "pb-12 md:pb-16", lg: "pb-20 md:pb-28", xl: "pb-32 md:pb-40", "2xl": "pb-40 md:pb-52" };

        const contentEl = (
          <div className={`flex flex-col ${image ? 'items-start text-left' : 'items-center text-center'} max-w-2xl`}>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 tracking-tight leading-tight">{title}</h1>
            <p className={`text-lg md:text-2xl mb-12 leading-relaxed ${bg === 'light' ? 'text-slate-600' : 'text-slate-200'}`}>{subtitle}</p>
            <div className="flex flex-wrap items-center gap-4">
              {ctaText && (
                <a href={ctaLink || "#"} className="inline-block">
                  <button className={`px-8 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-lg ${btnClasses[bg]}`}>
                    {ctaText}
                  </button>
                </a>
              )}
              {renderDropZone({ zone: "hero-actions" })}
            </div>
          </div>
        );

        return (
          <Styled p={props} className={`w-full px-6 md:px-12 rounded-3xl shadow-sm mx-auto my-6 overflow-hidden relative ${bgClasses[bg]} ${pt[paddingTop]} ${pb[paddingBottom]}`}>
            <div className="relative z-10 max-w-7xl mx-auto">
              {image ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 flex flex-col items-start">
                    {contentEl}
                  </div>
                  <div className="lg:col-span-5 w-full flex justify-center">
                    <img 
                      src={image} 
                      alt={title} 
                      className="w-full max-w-md lg:max-w-full h-auto object-cover rounded-2xl shadow-2xl" 
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  {contentEl}
                </div>
              )}
            </div>
          </Styled>
        );
      },
    },
    NavBarBlock: {
      fields: {
        logoText: { type: "text" },
        links: { type: "array", arrayFields: { label: { type: "text" }, href: { type: "text" } } },
        ...styleFieldDefs,
      },
      defaultProps: { logoText: "MyBrand", links: [{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" }], ...styleDefaults },
      render: (props) => {
        const { logoText, links, puck: { renderDropZone } } = props;
        return (
          <Styled p={props} className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
            <div className="font-black text-2xl text-slate-900 tracking-tight">{logoText}</div>
            <div className="hidden md:flex items-center gap-8">
              {links.map((link, i) => <a key={i} href={link.href} className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">{link.label}</a>)}
            </div>
            <div className="flex items-center gap-4">
              {renderDropZone({ zone: "nav-actions" })}
            </div>
          </Styled>
        );
      }
    },
    FooterBlock: {
      fields: {
        copyright: { type: "text" },
        links: { type: "array", arrayFields: { label: { type: "text" }, href: { type: "text" } } },
        ...styleFieldDefs,
      },
      defaultProps: { copyright: "© 2026 MyBrand Inc. All rights reserved.", links: [{ label: "Privacy Policy", href: "#" }, { label: "Terms of Service", href: "#" }], ...styleDefaults },
      render: (props) => {
        const { copyright, links } = props;
        return (
          <Styled p={props} className="w-full bg-slate-900 text-slate-400 py-16 px-6 mt-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-sm font-medium">{copyright}</p>
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
                {links.map((link, i) => <a key={i} href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</a>)}
              </div>
            </div>
          </Styled>
        );
      }
    },
    AccordionBlock: {
      fields: {
        items: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            content: { type: "textarea" }
          }
        },
        ...styleFieldDefs,
      },
      defaultProps: { items: [{ title: "What is this?", content: "This is a frequently asked question." }], ...styleDefaults },
      render: (props) => {
        const { items } = props;
        return (
          <Styled p={props} className="w-full max-w-3xl mx-auto space-y-4 py-8">
            {items.map((item, i) => (
              <details key={i} className="group bg-white border border-slate-200 rounded-xl open:shadow-md transition-all">
                <summary className="font-bold text-slate-900 cursor-pointer p-6 hover:bg-slate-50 transition-colors list-none flex justify-between items-center">
                  <span>{item.title}</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100 mt-2 text-lg">
                  {item.content}
                </div>
              </details>
            ))}
          </Styled>
        );
      }
    },
    VideoVSLBlock: {
      fields: {
        headline: { type: "text" },
        subheadline: { type: "textarea" },
        videoUrl: { type: "text" },
        paddingTop: { type: "select", options: [{ label: "Medium", value: "md" }, { label: "Large", value: "lg" }, { label: "X-Large", value: "xl" }] },
        paddingBottom: { type: "select", options: [{ label: "Medium", value: "md" }, { label: "Large", value: "lg" }, { label: "X-Large", value: "xl" }] },
        ...styleFieldDefs,
      },
      defaultProps: { headline: "Watch This Short Video", subheadline: "Discover the secret framework behind our success.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", paddingTop: "xl", paddingBottom: "xl", ...styleDefaults },
      render: (props) => {
        const { headline, subheadline, videoUrl, paddingTop, paddingBottom, puck: { renderDropZone } } = props;
        const pt = { md: "pt-12", lg: "pt-24", xl: "pt-32" };
        const pb = { md: "pb-12", lg: "pb-24", xl: "pb-32" };
        return (
          <Styled p={props} className={`w-full max-w-5xl mx-auto px-4 flex flex-col items-center text-center ${pt[paddingTop]} ${pb[paddingBottom]}`}>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">{headline}</h2>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl leading-relaxed">{subheadline}</p>
            <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl mb-12 border-8 border-slate-100 bg-black">
              <iframe src={videoUrl} className="w-full h-full" allowFullScreen></iframe>
            </div>
            <div className="w-full max-w-lg mx-auto">
              {renderDropZone({ zone: "vsl-cta" })}
            </div>
          </Styled>
        );
      }
    },
    TestimonialsBlock: {
      fields: {
        title: { type: "text" },
        reviews: {
          type: "array",
          arrayFields: {
            name: { type: "text" },
            role: { type: "text" },
            text: { type: "textarea" },
            rating: { type: "select", options: [{ label: "5 Stars", value: "5" }, { label: "4 Stars", value: "4" }] }
          }
        },
        ...styleFieldDefs,
      },
      defaultProps: { 
        title: "What Our Customers Say", 
        reviews: [
          { name: "Sarah Johnson", role: "CEO, TechFlow", text: "This product completely transformed our workflow. Highly recommended!", rating: "5" },
          { name: "Michael Chen", role: "Marketing Director", text: "Incredible value for the price. The team is fantastic.", rating: "5" }
        ],
        ...styleDefaults
      },
      render: (props) => {
        const { title, reviews } = props;
        return (
          <Styled p={props} className="w-full py-24 px-6 bg-slate-50 border-y border-slate-200">
            <h2 className="text-4xl md:text-5xl font-black text-center text-slate-900 mb-16 tracking-tight">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {reviews.map((review, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-md border border-slate-200 flex flex-col h-full hover:shadow-lg transition-shadow">
                  <div className="flex text-amber-400 mb-6">
                    {Array.from({ length: parseInt(review.rating) }).map((_, j) => (
                      <Star key={j} className="w-6 h-6 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 italic flex-1 mb-8 text-lg leading-relaxed">"{review.text}"</p>
                  <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{review.name}</h4>
                      <span className="text-sm text-slate-500 font-medium">{review.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Styled>
        );
      }
    },
    PricingTableBlock: {
      fields: {
        highlightTier: { type: "select", options: [{ label: "Tier 1", value: "1" }, { label: "Tier 2", value: "2" }, { label: "Tier 3", value: "3" }] },
        tier1Name: { type: "text" }, tier1Price: { type: "text" }, tier1Features: { type: "textarea" },
        tier2Name: { type: "text" }, tier2Price: { type: "text" }, tier2Features: { type: "textarea" },
        tier3Name: { type: "text" }, tier3Price: { type: "text" }, tier3Features: { type: "textarea" },
        ...styleFieldDefs,
      },
      defaultProps: {
        highlightTier: "2",
        tier1Name: "Basic", tier1Price: "$9/mo", tier1Features: "Feature 1\nFeature 2\nFeature 3",
        tier2Name: "Pro", tier2Price: "$29/mo", tier2Features: "Everything in Basic\nFeature 4\nFeature 5",
        tier3Name: "Enterprise", tier3Price: "$99/mo", tier3Features: "Everything in Pro\nDedicated Support\nCustom API",
        ...styleDefaults
      },
      render: (props) => {
        const { highlightTier, tier1Name, tier1Price, tier1Features, tier2Name, tier2Price, tier2Features, tier3Name, tier3Price, tier3Features, puck: { renderDropZone } } = props;
        const parseFeatures = (text: string) => text.split('\n').filter(Boolean);
        const tiers = [
          { name: tier1Name, price: tier1Price, features: parseFeatures(tier1Features), isHighlighted: highlightTier === "1", zone: "pricing-cta-1" },
          { name: tier2Name, price: tier2Price, features: parseFeatures(tier2Features), isHighlighted: highlightTier === "2", zone: "pricing-cta-2" },
          { name: tier3Name, price: tier3Price, features: parseFeatures(tier3Features), isHighlighted: highlightTier === "3", zone: "pricing-cta-3" }
        ];
        
        return (
          <Styled p={props} className="w-full py-24 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {tiers.map((tier, i) => (
                <div key={i} className={`rounded-3xl p-8 flex flex-col h-full bg-white border ${tier.isHighlighted ? 'border-sky-500 shadow-2xl relative md:scale-110 z-10' : 'border-slate-200 shadow-sm'}`}>
                  {tier.isHighlighted && <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sky-500 text-white text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-md">Most Popular</span>}
                  <h3 className={`text-2xl font-black mb-2 tracking-tight ${tier.isHighlighted ? 'text-sky-600' : 'text-slate-900'}`}>{tier.name}</h3>
                  <div className="text-5xl font-black text-slate-900 mb-8 tracking-tighter">{tier.price}</div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {tier.features.map((f, j) => (
                      <li key={j} className="flex items-start text-slate-600 font-medium">
                        <Check className="w-6 h-6 text-emerald-500 mr-3 shrink-0" />
                        <span className="text-base">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto w-full">
                    {renderDropZone({ zone: tier.zone })}
                  </div>
                </div>
              ))}
            </div>
          </Styled>
        );
      }
    },
    DynamicCollectionBlock: {
      fields: {
        collection: {
          type: "select",
          options: [
            { label: "Glossary Terms", value: "GlossaryTerm" },
            { label: "Affiliate Offers", value: "Offer" },
            { label: "Standard Pages", value: "WebPage" },
            { label: "Niche Boxes", value: "NicheBox" },
            { label: "CPA Listings", value: "CPAListing" },
          ]
        },
        limit: { type: "number" },
        layout: {
          type: "select",
          options: [
            { label: "Grid Cards", value: "grid" },
            { label: "Simple List", value: "list" }
          ]
        },
        ...styleFieldDefs
      },
      defaultProps: {
        collection: "GlossaryTerm",
        limit: 6,
        layout: "grid",
        ...styleDefaults
      },
      render: function DynamicCollectionRenderer(props) {
        const { collection, limit, layout } = props;
        const [items, setItems] = useState<any[]>([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
          let active = true;
          setLoading(true);
          getCollectionItems(collection, limit)
            .then(res => {
              if (active && res.success) {
                setItems(res.items);
              }
            })
            .catch(err => console.error(err))
            .finally(() => {
              if (active) setLoading(false);
            });
          return () => {
            active = false;
          };
        }, [collection, limit]);

        return (
          <Styled p={props} className="w-full py-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-indigo-500 uppercase bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                Dynamic Feed: {collection}
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs border border-dashed rounded-xl border-slate-200 bg-slate-50">
                No items found in {collection} collection.
              </div>
            ) : layout === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                  <div key={item.id} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">{item.badge}</span>
                      <h4 className="font-bold text-slate-800 text-base mb-1.5">{item.name}</h4>
                      {item.description && (
                        <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">{item.description}</p>
                      )}
                    </div>
                    {item.link && (
                      <a href={item.link} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-auto">
                        View Details <ArrowRight size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden">
                {items.map(item => (
                  <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{item.description}</p>
                    </div>
                    {item.link && (
                      <a href={item.link} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0">
                        View <ArrowRight size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Styled>
        );
      }
    }
  },
};
