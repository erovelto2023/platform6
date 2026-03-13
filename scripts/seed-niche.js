#!/usr/bin/env node
/**
 * Seed script to insert a sample paintball niche box into the database.
 * Run with: node scripts/seed-niche.js
 */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const eqIdx = line.indexOf('=');
  if (eqIdx > 0) {
    const k = line.substring(0, eqIdx).trim();
    const v = line.substring(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
    envVars[k] = v;
  }
});

const MONGODB_URI = envVars.MONGODB_URI || 'mongodb://localhost:27017/kbusiness';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB:', MONGODB_URI);

  const db = mongoose.connection.db;
  const collection = db.collection('nicheboxes');

  const count = await collection.countDocuments();
  console.log('Current niche count:', count);

  const sampleNiche = {
    nicheName: 'Paintball',
    nicheSlug: 'paintball',
    category: 'Sports & Recreation',
    competition: 'Medium',
    marketSize: '$1.2 Billion',
    growthRate: '4.2% annually',
    status: 'published',
    featured: true,
    downloadCount: 0,
    createdBy: 'user_system_admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    research: {
      marketOverview: 'Paintball is a competitive sport and recreational activity with a dedicated community. Players purchase equipment, gear, and regularly pay for field fees. The niche has strong repeat customer potential.',
      topTrends: [
        { query: 'paintball guns', search: '12,100/mo', interest: 'High', increase: '+8%' },
        { query: 'paintball near me', search: '22,200/mo', interest: 'Very High', increase: '+12%' },
        { query: 'paintball gear', search: '4,400/mo', interest: 'Medium', increase: '+5%' }
      ],
      risingTrends: [
        { query: 'speedball paintball', search: '1,300/mo', interest: 'Rising', increase: '+23%' },
        { query: 'paintball bunkers', search: '800/mo', interest: 'Rising', increase: '+18%' }
      ],
      opportunities: [
        'Affiliate marketing for paintball equipment',
        'YouTube channel reviewing markers and gear',
        'Local field directory or review site',
        'Online store for paintball accessories'
      ]
    },
    customerAvatar: {
      demographics: {
        age: '18-35',
        gender: 'Primarily male (70/30 split)',
        location: 'Suburban and rural USA, UK, Australia',
        educationLevel: 'High School - College',
        incomeLevel: '$35,000 - $75,000',
        familyStatus: 'Single or married with children'
      },
      psychology: {
        painPoints: 'High cost of entry-level equipment, finding local fields, building a team',
        primaryGoals: 'Compete in local tournaments, improve skills, connect with community',
        deepestDesires: 'Own high-end marker, win tournaments, be respected in the community'
      }
    },
    keywords: [
      { keyword: 'paintball guns', searchVolume: '12,100', searchIntent: 'Commercial', cpc: '$1.20', competitionDifficulty: 'Medium' },
      { keyword: 'best paintball marker', searchVolume: '3,600', searchIntent: 'Commercial', cpc: '$1.85', competitionDifficulty: 'Medium' },
      { keyword: 'paintball mask review', searchVolume: '1,900', searchIntent: 'Informational', cpc: '$0.75', competitionDifficulty: 'Low' },
      { keyword: 'paintball for beginners', searchVolume: '2,400', searchIntent: 'Informational', cpc: '$0.60', competitionDifficulty: 'Low' }
    ],
    businessModels: [
      { name: 'Affiliate Marketing', description: 'Promote paintball gear through Amazon Associates and direct brand affiliate programs. Review guns, masks, and accessories.', profitPotential: '$500-$3,000/mo' },
      { name: 'YouTube Channel', description: 'Create gameplay videos, gear reviews, and tutorial content. Monetize through AdSense and sponsorships.', profitPotential: '$1,000-$10,000/mo' },
      { name: 'Online Store', description: 'Dropship or wholesale paintball accessories, paintballs, and protective gear.', profitPotential: '$2,000-$15,000/mo' }
    ],
    recommendedTools: [
      { toolName: 'Amazon Associates', cost: 'Free', purpose: 'Affiliate links for gear', priority: 'High', affiliateLink: 'https://affiliate-program.amazon.com' },
      { toolName: 'Squarespace', cost: '$16/mo', purpose: 'Build a niche review website', priority: 'Medium', affiliateLink: 'https://squarespace.com' },
      { toolName: 'ConvertKit', cost: '$29/mo', purpose: 'Email list for paintball tips and deals', priority: 'Medium', affiliateLink: 'https://convertkit.com' }
    ],
    phases: [
      { id: 1, name: 'Research & Setup', duration: '4 weeks', budget: '$200', description: 'Set up website, social accounts, and start creating initial content', tasks: ['Register domain', 'Set up WordPress or Squarespace', 'Join Amazon Associates', 'Create 5 pillar articles'] },
      { id: 2, name: 'Content Creation', duration: '8 weeks', budget: '$300', description: 'Publish reviews, tutorials, and beginners guides consistently', tasks: ['Publish 3 articles/week', 'Start YouTube channel', 'Build email list', 'Join paintball forums'] },
      { id: 3, name: 'Monetization', duration: '12 weeks', budget: '$500', description: 'Scale affiliate earnings and explore brand deals', tasks: ['Apply to brand affiliate programs', 'Create gift guides', 'Reach out for sponsorships', 'Launch email newsletter'] }
    ]
  };

  const result = await collection.insertOne(sampleNiche);
  console.log('✅ Paintball niche inserted with ID:', result.insertedId);

  const verify = await collection.findOne({ nicheSlug: 'paintball' });
  console.log('✅ Verified:', verify.nicheName, '| Status:', verify.status);

  process.exit(0);
}

seed().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
