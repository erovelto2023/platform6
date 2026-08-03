import { Schema, model, models } from 'mongoose';

const IdeaPipelineSchema = new Schema({
    userId: { type: String, required: true, index: true },
    competitorId: { type: String, default: '', index: true },
    competitorName: { type: String, default: '' },
    
    title: { type: String, required: true },
    category: { type: String, required: true, default: 'Products' },
    opportunityType: { type: String, required: true, default: 'Innovate' },
    relatedProductOrFeature: { type: String, default: '' },
    
    problemIdentified: { type: String, default: '' },
    proposedSolution: { type: String, default: '' },
    targetAudience: { type: String, default: '' },
    customerBenefit: { type: String, default: '' },
    
    // Scoring & Estimation
    estimatedEffort: { type: Number, default: 5, min: 1, max: 10 },
    estimatedCost: { type: String, default: '' },
    estimatedTimeToBuild: { type: String, default: '' },
    estimatedRevenuePotential: { type: String, default: '' },
    strategicImpact: { type: Number, default: 5, min: 1, max: 10 },
    confidenceLevel: { type: Number, default: 5, min: 1, max: 10 },
    
    priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High', 'Critical'], 
        default: 'Medium' 
    },
    status: { 
        type: String, 
        enum: ['Backlog', 'Researching', 'Planned', 'In Progress', 'Testing', 'Launched', 'Archived'], 
        default: 'Backlog' 
    },
    
    owner: { type: String, default: '' },
    dueDate: { type: String, default: '' },
    dependencies: { type: String, default: '' },
    notes: { type: String, default: '' },
    links: { type: String, default: '' },
    successMetrics: { type: String, default: '' },
    validationEvidence: { type: String, default: '' },
    risks: { type: String, default: '' },
    nextAction: { type: String, default: '' }
}, { timestamps: true });

const IdeaPipeline = models.IdeaPipeline || model('IdeaPipeline', IdeaPipelineSchema);

export default IdeaPipeline;
