import mongoose from "mongoose";

const BrandBaseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: String,

        // The 20 Questions
        questions: {
            // Story & Origin (1-3)
            storyBeforeCode: String, // Q1: Life before cracking the code
            incitingEvent: String,    // Q2: How you stumbled onto the secret
            lifeToday: String,        // Q3: Life today after changes

            // Business Motivation (4-7)
            businessMotivation: String,  // Q4: What motivated you to start
            primaryGoal: String,          // Q5: Primary goal for your brand
            industryPassion: String,      // Q6: What drives your passion
            trustworthyQualities: String, // Q7: What makes you trustworthy

            // Products & Services (8-9)
            productsServices: String,  // Q8: Range of products/services
            pricingStructure: String,  // Q9: Pricing structure

            // Target Market (10-13)
            targetMarket: String,           // Q10: Simple target market
            targetAudienceDetails: String,  // Q11: Demographics & psychographics
            customerChallenges: String,     // Q12: Pain points customers face
            solutionOffered: String,        // Q13: How you solve challenges

            // Objections & Benefits (14-17)
            commonObjections: String,      // Q14: Common objections
            objectionHandling: String,     // Q15: How you address objections
            customerOutcomes: String,      // Q16: Outcomes & benefits
            fabbFeatures: String,          // Q17: FABB Framework features

            // Competition & USP (18-20)
            topCompetitors: String,    // Q18: Top 3 competitors
            uniqueSellingProp: String, // Q19: USP / What sets you apart
            affiliateProgram: String,  // Q20: Affiliate program details
        },

        // Brand Kit Colors
        brandColors: [String],

        // Status
        isComplete: {
            type: Boolean,
            default: false,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const BrandBase = mongoose.models.BrandBase || mongoose.model("BrandBase", BrandBaseSchema);

export default BrandBase;
