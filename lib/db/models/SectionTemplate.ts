import mongoose from "mongoose";

const SectionTemplateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["Hero", "Features", "Content", "CTA", "Testimonials", "Pricing", "FAQ", "Footer", "Header", "Other"],
            default: "Other",
        },
        thumbnail: String, // URL to preview image
        structure: {
            type: String, // HTML string or JSON structure
            required: true,
        },
        defaultStyles: {
            type: Object, // Default CSS/Tailwind classes
            default: {},
        },
        editableFields: [
            {
                key: String, // e.g., "headline"
                label: String, // e.g., "Main Headline"
                type: { type: String, enum: ["text", "image", "link", "rich-text"], default: "text" },
                selector: String, // CSS selector to find this element in the structure
            }
        ],
        isSystem: {
            type: Boolean,
            default: false, // System templates cannot be deleted
        },
        createdBy: {
            type: String, // Clerk ID
        }
    },
    {
        timestamps: true,
    }
);

const SectionTemplate = mongoose.models.SectionTemplate || mongoose.model("SectionTemplate", SectionTemplateSchema);

export default SectionTemplate;
