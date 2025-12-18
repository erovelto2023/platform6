import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISectionStyle {
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

export interface ISectionContent {
    [key: string]: string | string[];
}

export interface IPageSection {
    _id?: string;
    templateId: string;
    content: ISectionContent;
    style: ISectionStyle;
    order: number;
    customHTML?: string;
    customCSS?: string;
}

export interface IWebPage extends Document {
    name: string;
    slug: string;
    sections: IPageSection[];
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

const SectionStyleSchema = new Schema({
    backgroundColor: String,
    textColor: String,
    padding: String,
    margin: String,
    fontSize: String,
    fontWeight: String,
    textAlign: { type: String, enum: ["left", "center", "right"] },
    borderRadius: String,
    maxWidth: String,
}, { _id: false });

const PageSectionSchema = new Schema({
    templateId: { type: String, required: true },
    content: { type: Schema.Types.Mixed, default: {} },
    style: { type: SectionStyleSchema, default: {} },
    order: { type: Number, required: true },
    customHTML: String,
    customCSS: String,
}, { timestamps: false });

const WebPageSchema = new Schema<IWebPage>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        sections: [PageSectionSchema],
        isPublished: { type: Boolean, default: false },
        metaTitle: String,
        metaDescription: String,
        ogTitle: String,
        ogDescription: String,
        ogImage: String,
        twitterTitle: String,
        twitterDescription: String,
        twitterImage: String,
        keywords: String,
        canonicalUrl: String,
    },
    { timestamps: true }
);

const WebPage: Model<IWebPage> =
    mongoose.models.WebPage || mongoose.model<IWebPage>("WebPage", WebPageSchema);

export default WebPage;
