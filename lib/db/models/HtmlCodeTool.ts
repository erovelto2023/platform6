import mongoose, { Schema, Model } from 'mongoose';

export interface IHtmlCodeTool {
    _id?: string;
    id?: string;
    name: string;
    slug: string;
    description?: string;
    htmlCode: string;
    category?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const HtmlCodeToolSchema = new Schema<IHtmlCodeTool>({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    htmlCode: { type: String, required: true },
    category: { type: String, default: "General" },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

const HtmlCodeTool: Model<IHtmlCodeTool> = mongoose.models.HtmlCodeTool || mongoose.model<IHtmlCodeTool>('HtmlCodeTool', HtmlCodeToolSchema);

export default HtmlCodeTool;
