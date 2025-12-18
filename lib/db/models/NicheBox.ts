import { Schema, model, models } from 'mongoose';

const KeywordSchema = new Schema({
    keyword: { type: String, required: true },
    volume: { type: Number },
    difficulty: { type: String }, // e.g., 'Easy', 'Medium', 'Hard' or a number
});

const DownloadSchema = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: {
        type: String,
        enum: ['PDF', 'Template', 'Other'],
        default: 'PDF',
    },
});

const NicheBoxSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    thumbnail: { type: String }, // Optional visual

    // The "Business in a Box" Core Features
    keywords: [KeywordSchema],
    businessIdeas: [{ type: String }], // Simple array of strings for ideas
    downloads: [DownloadSchema],
    videos: [{
        title: { type: String, required: true },
        url: { type: String, required: true },
    }],

    // 1. Niche Playbooks (Roadmaps)
    playbooks: [{
        title: { type: String, required: true },
        content: { type: String }, // Markdown/HTML content
        isCompleted: { type: Boolean, default: false }
    }],

    // 3. Market Demographics & 9. Competitor Analysis & 10. Customer Avatar
    marketResearch: {
        demographics: {
            ageRange: { type: String },
            income: { type: String },
            location: { type: String },
            interests: [{ type: String }]
        },
        avatar: {
            description: { type: String },
            painPoints: [{ type: String }],
            desires: [{ type: String }],
            objections: [{ type: String }]
        },
        competitors: [{
            name: { type: String },
            url: { type: String },
            analysis: { type: String }
        }]
    },

    // 7. Niche Branding Kits
    branding: {
        colors: [{ type: String }], // Hex codes
        fonts: [{ type: String }],
        voice: { type: String },
        slogan: { type: String }
    },

    // 5. Done-For-You Funnels
    funnels: [{
        title: { type: String },
        description: { type: String },
        url: { type: String } // Link to funnel template
    }],

    // 4. Ready-Made Content Packs
    contentPacks: [{
        title: { type: String },
        type: { type: String, enum: ['Social', 'Email', 'Blog', 'Script', 'Other'], default: 'Other' },
        content: { type: String }
    }],

    // 11. Offers & Product Ideas
    productIdeas: [{
        title: { type: String },
        description: { type: String },
        priceRange: { type: String }
    }],

    communityChannelId: { type: String }, // For chat integration

    isPublished: { type: Boolean, default: false },
    price: { type: Number, default: 0 }, // If sold separately
}, { timestamps: true });

const NicheBox = models.NicheBox || model('NicheBox', NicheBoxSchema);

export default NicheBox;
