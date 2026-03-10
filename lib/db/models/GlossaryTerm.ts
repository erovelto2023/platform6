import mongoose, { Schema, Model } from 'mongoose';

export interface IRecommendedTool {
    productId: number;
    context?: string; // "Best For" context
}

export interface IGlossaryTerm {
    // --- Core Glossary Fields ---
    id: string;
    term: string;
    slug: string;
    shortDefinition: string; // 1-sentence plain-language
    definition: string;      // Full in-depth explanation
    category: string;        // High-level grouping (e.g. Energy Healing)
    subCategory?: string;    // More specific (e.g. Ancestral Healing)

    // --- Meaning & Context ---
    origin?: string;             // Cultural/Historical origin
    traditionalMeaning?: string; // Traditional understanding
    modernUsage?: string;        // Current usage
    expandedExplanation?: string;// Deeper philosophical context

    // --- Practical Application ---
    howItWorks?: string;       // Mechanism or energetic principle
    benefits?: string;         // Physical, emotional, spiritual benefits
    commonPractices?: string;  // Methods/exercises
    useCases?: string;         // Real-world applications
    whoUsesIt?: string;        // Practitioners/Audiences

    // --- Energy & Consciousness ---
    energyType?: string;          // Subtle, biofield, etc.
    consciousnessLevel?: string;  // Awakening, Grounding, etc.
    chakraAssociation?: string;   // Linked chakras
    elementalAssociation?: string;// Earth, Water, etc.
    frequencyLevel?: string;      // Symbolic/energetic frequency
    
    // --- Monetization & Business (MMO) ---
    howItMakesMoney?: string;
    bestFor?: string;
    gettingStartedChecklist?: string[];
    commonMistakes?: string;
    realExamples?: string;
    startupCost?: '$0' | '<$100' | '$100+';
    timeToFirstDollar?: string;
    skillRequired?: 'Beginner' | 'Intermediate' | 'Advanced';
    platformPreference?: string;
    lowPhysicalEffort?: boolean;

    // --- Relationships & Linking ---
    relatedTermIds: string[];
    synonyms: string[];
    antonyms: string[];
    oppositeTerms?: string[];
    seeAlso?: string[];

    // --- Learning & Guidance ---
    beginnerExplanation?: string; // Simplified for newcomers
    advancedPerspective?: string; // Esoteric interpretation
    misconceptions?: string;      // Common misunderstandings
    warningsOrNotes?: string;     // Safety/Ethics

    // --- Media & Experience ---
    guidedPractice?: string;      // Meditation/Exercise text
    affirmations?: string;        // Conscious statements
    visualizations?: string;      // Imagery practices
    audioOrVideoResources?: string; // Embeds/Links

    // --- SEO & Content ---
    keywords?: string[];
    searchIntent?: string;
    metaTitle?: string;
    metaDescription?: string;
    contentLevel?: 'Beginner' | 'Intermediate' | 'Advanced';

    // --- Trust & Authority ---
    sources?: string;
    lineageOrTradition?: string;
    scientificPerspective?: string;
    culturalNotes?: string;


    // --- Technical / App-Ready ---
    status?: 'Draft' | 'Reviewed' | 'Published';
    lastUpdated?: Date;
    authorOrReviewer?: string;
    aiTrainingEligible?: boolean;
    sponsoredBy?: string; // Vendor/sponsor name

    // --- Legacy / Compat ---
    niche?: string; // Kept for backward compatibility, sync with category
    recommendedTools: IRecommendedTool[];
    imageUrl?: string;
    isFeatured?: boolean;

    // --- Timestamps (Mongoose) ---
    createdAt?: Date;
    updatedAt?: Date;
}

const GlossaryTermSchema = new Schema<IGlossaryTerm>({
    // Core
    id: { type: String, required: true, unique: true },
    term: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    shortDefinition: { type: String },
    definition: { type: String, required: true }, // Main content body
    category: { type: String, required: true, default: "General" },
    subCategory: { type: String },

    // Meaning & Context
    origin: { type: String },
    traditionalMeaning: { type: String },
    modernUsage: { type: String },
    expandedExplanation: { type: String },

    // Practical Application
    howItWorks: { type: String },
    benefits: { type: String },
    commonPractices: { type: String },
    useCases: { type: String },
    whoUsesIt: { type: String },

    // Energy & Consciousness
    energyType: { type: String },
    consciousnessLevel: { type: String },
    chakraAssociation: { type: String },
    elementalAssociation: { type: String },
    frequencyLevel: { type: String },

    // Monetization & Business (MMO)
    howItMakesMoney: { type: String },
    bestFor: { type: String },
    gettingStartedChecklist: [String],
    commonMistakes: { type: String },
    realExamples: { type: String },
    startupCost: { type: String, enum: ['$0', '<$100', '$100+'], default: '$0' },
    timeToFirstDollar: { type: String },
    skillRequired: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    platformPreference: { type: String },
    lowPhysicalEffort: { type: Boolean, default: false },

    // Relationships
    relatedTermIds: [String],
    synonyms: [String],
    antonyms: [String],
    oppositeTerms: [String],
    seeAlso: [String],

    // Learning
    beginnerExplanation: { type: String },
    advancedPerspective: { type: String },
    misconceptions: { type: String },
    warningsOrNotes: { type: String },

    // Media
    guidedPractice: { type: String },
    affirmations: { type: String },
    visualizations: { type: String },
    audioOrVideoResources: { type: String },

    // SEO
    keywords: [String],
    searchIntent: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    contentLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },

    // Trust
    sources: { type: String },
    lineageOrTradition: { type: String },
    scientificPerspective: { type: String },
    culturalNotes: { type: String },


    // Technical
    status: { type: String, enum: ['Draft', 'Reviewed', 'Published'], default: 'Published' },
    lastUpdated: { type: Date, default: Date.now },
    authorOrReviewer: { type: String },
    aiTrainingEligible: { type: Boolean, default: true },
    sponsoredBy: { type: String },

    // Legacy / Compat
    niche: { type: String, default: "General" },
    recommendedTools: [{
        productId: Number,
        context: String
    }],
    imageUrl: { type: String },
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

GlossaryTermSchema.pre('save', async function () {
    this.lastUpdated = new Date();
    if (!this.category && this.niche) {
        this.category = this.niche;
    }
    if (!this.niche && this.category) {
        this.niche = this.category;
    }
});

const GlossaryTerm: Model<IGlossaryTerm> = mongoose.models.GlossaryTerm || mongoose.model<IGlossaryTerm>('GlossaryTerm', GlossaryTermSchema);

export default GlossaryTerm;
