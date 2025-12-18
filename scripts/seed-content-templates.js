/**
 * Seed Content Templates to Database
 * Run this to populate content templates for the Content Studio
 * 
 * Usage: node scripts/seed-content-templates.js
 */

const mongoose = require('mongoose');

// Content Template Schema
const ContentTemplateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    category: { type: String, required: true },
    icon: String,
    prompt: { type: String, required: true },
    fields: [
        {
            name: String,
            label: String,
            type: String,
            required: Boolean,
            placeholder: String,
            options: [String],
        },
    ],
    isActive: { type: Boolean, default: true },
    isPremium: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const ContentTemplate = mongoose.models.ContentTemplate || mongoose.model('ContentTemplate', ContentTemplateSchema);

// Default Content Templates
const defaultTemplates = [
    {
        name: "Blog Post",
        slug: "blog-post",
        description: "Create engaging blog posts optimized for SEO",
        category: "Blog",
        icon: "📝",
        prompt: "Write a comprehensive blog post about {topic} targeting {targetAudience}. Include SEO keywords: {keywords}. Tone: {tone}.",
        fields: [
            { name: "topic", label: "Topic", type: "text", required: true, placeholder: "Enter blog topic" },
            { name: "targetAudience", label: "Target Audience", type: "text", required: true, placeholder: "Who is this for?" },
            { name: "keywords", label: "Keywords", type: "text", required: false, placeholder: "SEO keywords (comma separated)" },
            { name: "tone", label: "Tone", type: "select", required: false, options: ["Professional", "Casual", "Friendly", "Authoritative"] },
        ],
        isActive: true,
    },
    {
        name: "Product Description",
        slug: "product-description",
        description: "Write compelling product descriptions that convert",
        category: "E-commerce",
        icon: "🛍️",
        prompt: "Write a compelling product description for {productName}. Key features: {features}. Target audience: {targetAudience}. Focus on benefits and include a call-to-action.",
        fields: [
            { name: "productName", label: "Product Name", type: "text", required: true, placeholder: "Product name" },
            { name: "features", label: "Key Features", type: "textarea", required: true, placeholder: "List key features" },
            { name: "targetAudience", label: "Target Audience", type: "text", required: false, placeholder: "Who will buy this?" },
        ],
        isActive: true,
    },
    {
        name: "Social Media Post",
        slug: "social-media-post",
        description: "Create engaging social media content",
        category: "Social Media",
        icon: "📱",
        prompt: "Create a {platform} post about {topic}. Tone: {tone}. Include relevant hashtags and a call-to-action.",
        fields: [
            { name: "platform", label: "Platform", type: "select", required: true, options: ["Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok"] },
            { name: "topic", label: "Topic", type: "text", required: true, placeholder: "What's the post about?" },
            { name: "tone", label: "Tone", type: "select", required: false, options: ["Professional", "Casual", "Funny", "Inspirational"] },
        ],
        isActive: true,
    },
    {
        name: "Email Newsletter",
        slug: "email-newsletter",
        description: "Craft engaging email newsletters",
        category: "Email",
        icon: "📧",
        prompt: "Write an email newsletter about {topic} for {targetAudience}. Include a compelling subject line, engaging content, and clear call-to-action.",
        fields: [
            { name: "topic", label: "Topic", type: "text", required: true, placeholder: "Newsletter topic" },
            { name: "targetAudience", label: "Target Audience", type: "text", required: true, placeholder: "Who are you sending to?" },
        ],
        isActive: true,
    },
    {
        name: "Landing Page Copy",
        slug: "landing-page-copy",
        description: "High-converting landing page content",
        category: "Marketing",
        icon: "🎯",
        prompt: "Write landing page copy for {product}. Target audience: {targetAudience}. Include a compelling headline, benefits, features, and strong call-to-action.",
        fields: [
            { name: "product", label: "Product/Service", type: "text", required: true, placeholder: "What are you selling?" },
            { name: "targetAudience", label: "Target Audience", type: "text", required: true, placeholder: "Who is this for?" },
        ],
        isActive: true,
    },
    {
        name: "SEO Meta Description",
        slug: "seo-meta-description",
        description: "Optimized meta descriptions for better CTR",
        category: "SEO",
        icon: "🔍",
        prompt: "Write an SEO-optimized meta description (max 160 characters) for a page about {topic}. Include keywords: {keywords}. Make it compelling to increase click-through rate.",
        fields: [
            { name: "topic", label: "Page Topic", type: "text", required: true, placeholder: "What's the page about?" },
            { name: "keywords", label: "Keywords", type: "text", required: false, placeholder: "Target keywords" },
        ],
        isActive: true,
    },
    {
        name: "Video Script",
        slug: "video-script",
        description: "Engaging video scripts for YouTube, TikTok, etc.",
        category: "Video",
        icon: "🎬",
        prompt: "Write a video script about {topic} for {platform}. Length: {duration}. Include hook, main content, and call-to-action.",
        fields: [
            { name: "topic", label: "Video Topic", type: "text", required: true, placeholder: "What's the video about?" },
            { name: "platform", label: "Platform", type: "select", required: true, options: ["YouTube", "TikTok", "Instagram Reels", "Facebook"] },
            { name: "duration", label: "Duration", type: "select", required: false, options: ["30 seconds", "1 minute", "3 minutes", "5+ minutes"] },
        ],
        isActive: true,
    },
    {
        name: "Ad Copy",
        slug: "ad-copy",
        description: "Persuasive ad copy for paid campaigns",
        category: "Advertising",
        icon: "💰",
        prompt: "Write ad copy for {platform} promoting {product}. Target audience: {targetAudience}. Include headline, description, and call-to-action. Keep it concise and compelling.",
        fields: [
            { name: "platform", label: "Platform", type: "select", required: true, options: ["Google Ads", "Facebook Ads", "Instagram Ads", "LinkedIn Ads"] },
            { name: "product", label: "Product/Service", type: "text", required: true, placeholder: "What are you advertising?" },
            { name: "targetAudience", label: "Target Audience", type: "text", required: false, placeholder: "Who should see this ad?" },
        ],
        isActive: true,
    },
];

async function seedContentTemplates() {
    try {
        console.log('🌱 Starting content template seeding...');

        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI not found in environment variables');
        }

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        console.log(`📦 Seeding ${defaultTemplates.length} content templates`);

        let insertedCount = 0;
        let updatedCount = 0;

        for (const template of defaultTemplates) {
            try {
                const existing = await ContentTemplate.findOne({ slug: template.slug });
                if (existing) {
                    await ContentTemplate.updateOne(
                        { slug: template.slug },
                        {
                            $set: {
                                ...template,
                                updatedAt: new Date()
                            }
                        }
                    );
                    updatedCount++;
                } else {
                    await ContentTemplate.create(template);
                    insertedCount++;
                }
            } catch (error) {
                console.error(`❌ Error with template ${template.slug}:`, error.message);
            }
        }

        console.log(`✅ Inserted ${insertedCount} new templates`);
        console.log(`✅ Updated ${updatedCount} existing templates`);

        // Show summary
        const totalTemplates = await ContentTemplate.countDocuments();
        const categories = await ContentTemplate.distinct('category');

        console.log('\n📊 Summary:');
        console.log(`   Total content templates: ${totalTemplates}`);
        console.log(`   Categories: ${categories.join(', ')}`);

        console.log('\n🎉 Content template seeding completed successfully!');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedContentTemplates();
