// Page Builder Type Definitions

export interface SectionStyle {
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    margin?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: "left" | "center" | "right";
    borderRadius?: string;
    maxWidth?: string;
}

export interface SectionContent {
    [key: string]: string | string[] | any;
    title?: string;
    subtitle?: string;
    content?: string;
    text?: string;
    buttonText?: string;
    imageUrl?: string;
    logo?: string;
    // Array fields (stored as JSON strings)
    features?: string | any[];
    testimonials?: string | any[];
    plans?: string | any[];
    faqs?: string | any[];
    team?: string | any[];
    logos?: string | any[];
    images?: string | any[];
    stats?: string | any[];
}

export interface Section {
    _id?: string;
    templateId: string;
    content: SectionContent;
    style: SectionStyle;
    order: number;
    customHTML?: string;
    customCSS?: string;
}

export interface Template {
    id: string;
    name: string;
    category: string;
    componentType: string;
    defaultContent: SectionContent;
    defaultStyle: SectionStyle;
    thumbnail?: string;
    isPremium?: boolean;
}

export interface SEOData {
    metaTitle?: string;
    metaDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    keywords?: string;
    canonicalUrl?: string;
}

export interface Page {
    _id: string;
    name: string;
    slug: string;
    sections: Section[];
    isPublished: boolean;
    metaTitle?: string;
    metaDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    keywords?: string;
    canonicalUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PageTemplate {
    id: string;
    name: string;
    category: string;
    description: string;
    sections: Omit<Section, '_id'>[];
}

// Feature-specific types
export interface Feature {
    icon: string;
    title: string;
    description: string;
}

export interface Testimonial {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
}

export interface PricingPlan {
    name: string;
    price: string;
    period?: string;
    popular?: boolean;
    features: string[];
    buttonText: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface TeamMember {
    name: string;
    role: string;
    image?: string;
    bio?: string;
}

export interface Stat {
    number: string;
    label: string;
}

// View modes
export type ViewMode = "desktop" | "tablet" | "mobile";

// Editor modes
export type EditorMode = "content" | "style";
