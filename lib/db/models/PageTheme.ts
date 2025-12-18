import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPageTheme extends Document {
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        muted: string;
    };
    typography: {
        fontFamily: string;
        headingFont?: string;
        fontSize: {
            base: string;
            h1: string;
            h2: string;
            h3: string;
        };
    };
    spacing: {
        sectionPadding: string;
        containerMaxWidth: string;
    };
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PageThemeSchema = new Schema<IPageTheme>(
    {
        name: { type: String, required: true },
        colors: {
            primary: { type: String, default: "#4f46e5" },
            secondary: { type: String, default: "#10b981" },
            accent: { type: String, default: "#f59e0b" },
            background: { type: String, default: "#ffffff" },
            text: { type: String, default: "#1f2937" },
            muted: { type: String, default: "#6b7280" },
        },
        typography: {
            fontFamily: { type: String, default: "Inter, sans-serif" },
            headingFont: String,
            fontSize: {
                base: { type: String, default: "16px" },
                h1: { type: String, default: "3rem" },
                h2: { type: String, default: "2.25rem" },
                h3: { type: String, default: "1.875rem" },
            },
        },
        spacing: {
            sectionPadding: { type: String, default: "5rem 1.5rem" },
            containerMaxWidth: { type: String, default: "1200px" },
        },
        isDefault: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const PageTheme: Model<IPageTheme> =
    mongoose.models.PageTheme || mongoose.model<IPageTheme>("PageTheme", PageThemeSchema);

export default PageTheme;
