import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISectionTemplate extends Document {
    id: string;
    name: string;
    category: string;
    thumbnail?: string;
    defaultContent: { [key: string]: string | string[] };
    defaultStyle: {
        backgroundColor?: string;
        textColor?: string;
        padding?: string;
        margin?: string;
        fontSize?: string;
        fontWeight?: string;
        textAlign?: "left" | "center" | "right";
        borderRadius?: string;
        maxWidth?: string;
    };
    componentType: string;
    customCode?: string;
    isSystem: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SectionTemplateSchema = new Schema<ISectionTemplate>(
    {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        thumbnail: String,
        defaultContent: { type: Schema.Types.Mixed, default: {} },
        defaultStyle: { type: Schema.Types.Mixed, default: {} },
        componentType: { type: String, required: true },
        customCode: String,
        isSystem: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const PageBuilderTemplate: Model<ISectionTemplate> =
    mongoose.models.PageBuilderTemplate ||
    mongoose.model<ISectionTemplate>("PageBuilderTemplate", SectionTemplateSchema);

export default PageBuilderTemplate;
