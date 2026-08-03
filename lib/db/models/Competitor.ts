import { Schema, model, models } from 'mongoose';

const CompetitorSchema = new Schema({
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    webAddress: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zip: { type: String, default: '' },
    country: { type: String, default: '' },
    phone: { type: String, default: '' },
    fax: { type: String, default: '' },
    email: { type: String, default: '' },
    nicheMarket: { type: String, default: '' },
    primaryKeyword: { type: String, default: '' },
    notes: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    
    // Store 33 Intelligence Modules in a flexible structured map
    modulesData: {
        companyOverview: { type: Schema.Types.Mixed, default: {} },
        businessInfo: { type: Schema.Types.Mixed, default: {} },
        productAnalysis: { type: Schema.Types.Mixed, default: {} },
        pricingStrategy: { type: Schema.Types.Mixed, default: {} },
        customerAvatar: { type: Schema.Types.Mixed, default: {} },
        brandIdentity: { type: Schema.Types.Mixed, default: {} },
        websiteAnalysis: { type: Schema.Types.Mixed, default: {} },
        seoAudit: { type: Schema.Types.Mixed, default: {} },
        contentMarketing: { type: Schema.Types.Mixed, default: {} },
        socialMedia: { type: Schema.Types.Mixed, default: {} },
        youtubeAnalysis: { type: Schema.Types.Mixed, default: {} },
        emailMarketing: { type: Schema.Types.Mixed, default: {} },
        salesFunnel: { type: Schema.Types.Mixed, default: {} },
        advertising: { type: Schema.Types.Mixed, default: {} },
        salesCopy: { type: Schema.Types.Mixed, default: {} },
        customerExperience: { type: Schema.Types.Mixed, default: {} },
        reviews: { type: Schema.Types.Mixed, default: {} },
        reputation: { type: Schema.Types.Mixed, default: {} },
        techStack: { type: Schema.Types.Mixed, default: {} },
        trafficSources: { type: Schema.Types.Mixed, default: {} },
        affiliateProgram: { type: Schema.Types.Mixed, default: {} },
        partnerships: { type: Schema.Types.Mixed, default: {} },
        hiring: { type: Schema.Types.Mixed, default: {} },
        financialIndicators: { type: Schema.Types.Mixed, default: {} },
        customerCommunity: { type: Schema.Types.Mixed, default: {} },
        swotAnalysis: { type: Schema.Types.Mixed, default: {} },
        competitiveAdvantages: { type: Schema.Types.Mixed, default: {} },
        weaknesses: { type: Schema.Types.Mixed, default: {} },
        opportunities: { type: Schema.Types.Mixed, default: {} },
        marketingMetrics: { type: Schema.Types.Mixed, default: {} },
        aiReadiness: { type: Schema.Types.Mixed, default: {} },
        legalCompliance: { type: Schema.Types.Mixed, default: {} },
        keyTakeaways: { type: Schema.Types.Mixed, default: {} },
    }
}, { timestamps: true });

const Competitor = models.Competitor || model('Competitor', CompetitorSchema);

export default Competitor;
