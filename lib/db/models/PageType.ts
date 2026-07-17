import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomField {
    name: string;
    label: string;
    type: "text" | "textarea" | "number" | "url" | "image" | "relationship";
    refCollection?: "GlossaryTerm" | "Offer" | "WebPage" | "NicheBox" | "CPAListing";
}

export interface IPageType extends Document {
    name: string;
    slug: string;
    fields: ICustomField[];
    puckTemplate?: any;
    createdAt: Date;
    updatedAt: Date;
}

const CustomFieldSchema = new Schema({
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: ["text", "textarea", "number", "url", "image", "relationship"], required: true },
    refCollection: { type: String, enum: ["GlossaryTerm", "Offer", "WebPage", "NicheBox", "CPAListing"], required: false }
}, { _id: false });

const PageTypeSchema = new Schema<IPageType>({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    fields: { type: [CustomFieldSchema], default: [] },
    puckTemplate: { type: Schema.Types.Mixed },
}, { timestamps: true });

const PageType: Model<IPageType> = mongoose.models.PageType || mongoose.model<IPageType>("PageType", PageTypeSchema);

export default PageType;
