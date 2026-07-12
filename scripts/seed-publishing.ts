import dbConnect from '../lib/dbConnect';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function seed() {
  try {
    const { Author, Product, PillarPage, BlogPost, Glossary, Directory, User, PaymentGateway, ProductFunnel, SiteTheme, StoryTemplate } = require('../models');

    await dbConnect();
    console.log('Connected to MongoDB.');

    // 1. Clear existing database collections
    await Author.deleteMany({});
    await Product.deleteMany({});
    await PillarPage.deleteMany({});
    await BlogPost.deleteMany({});
    await Glossary.deleteMany({});
    await Directory.deleteMany({});
    await PaymentGateway.deleteMany({});
    await ProductFunnel.deleteMany({});
    await SiteTheme.deleteMany({});
    await StoryTemplate.deleteMany({});
    
    // We don't delete all Users to avoid breaking existing development accounts, but we'll remove our seeded ones
    await User.deleteMany({ email: { $in: ['customer@example.com', 'admin@example.com'] } });

    console.log('Cleared existing collection data.');

    // 2. Create Gateways
    const simulateGateway = await PaymentGateway.create({
      name: 'Simulated Developer Sandbox',
      type: 'simulate',
      stripePublishableKey: '',
      stripeSecretKey: '',
      isActive: true,
    });

    const stripeGateway = await PaymentGateway.create({
      name: 'Stripe Live Account Gateway',
      type: 'stripe',
      stripePublishableKey: 'pk_test_placeholder_key',
      stripeSecretKey: 'sk_test_placeholder_key',
      isActive: false,
    });
    console.log('Payment gateways created.');

    // 3. Create default author
    const author = await Author.create({
      name: 'Dr. Jane Doe, PhD',
      bio: 'Dr. Jane Doe is a veterinarian behaviorist with over 14 years of experience specializing in positive reinforcement. She is the author of multiple best-selling canine training books.',
      credentials: 'DVM, PhD in Canine Behavior',
      avatarUrl: 'JD',
      verificationBadge: true
    });
    console.log('Default author created.');

    // 4. Create default products
    const courseProduct = await Product.create({
      title: 'The Perfect Canine Masterclass',
      type: 'course',
      price: 49.00,
      stripePriceId: 'price_mock_course_49',
      description: 'Stop guessing your dog\'s needs. Instantly access over 45 HD streaming modules, actionable homework sheets, and personal community support pipelines.',
      landingPageUrl: '/courses/perfect-canine-masterclass',
      gatewayId: simulateGateway._id,
      curriculum: JSON.stringify([
        {
          title: 'Module 1: The Positive Foundation',
          lessons: [
            { 
              title: '1.1 Principles of Classical Conditioning', 
              duration: '12 mins', 
              status: 'completed', 
              description: 'Explore Pavlovian triggers and positive reinforcement models.',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              attachments: [
                { name: 'Conditioning Basics Worksheet (PDF)', url: 'https://example.com/conditioning.pdf' }
              ]
            },
            { 
              title: '1.2 Setting up the Perfect Home Environment', 
              duration: '18 mins', 
              status: 'completed', 
              description: 'Design distraction-free zones and crate placements.',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              attachments: [
                { name: 'Environment Setup Guide (PDF)', url: 'https://example.com/env_setup.pdf' }
              ]
            },
            { 
              title: '1.3 The Clicker Mechanics & Marker Training', 
              duration: '15 mins', 
              status: 'current', 
              description: 'In this session, Dr. Jane Doe outlines the physics and timing of classical reward marking. You will learn the exact mechanical coordination required to sound the clicker at the millisecond target behaviors are expressed.',
              videoUrl: 'https://videoplayer.gg/watch/cf0e4a4e-2a8a-441f-87da-44be34b8a13f',
              attachments: [
                { name: 'Marker Training Blueprint (PDF)', url: 'https://example.com/marker.pdf' }
              ]
            }
          ]
        },
        {
          title: 'Module 2: Core Behavioral Control',
          lessons: [
            { title: '2.1 Leash Walking without Pulling', duration: '22 mins', status: 'locked', description: 'Eliminate standard pulling reflexes using spatial feedback.', videoUrl: '', attachments: [] },
            { title: '2.2 Crate Training Blueprint: Day 1-7', duration: '25 mins', status: 'locked', description: 'The absolute week-one timeline for stress-free crating.', videoUrl: '', attachments: [] },
            { title: '2.3 Stop Excess Vocalization (Barking)', duration: '14 mins', status: 'locked', description: 'Isolate trigger-based barking and correct vocal signaling.', videoUrl: '', attachments: [] }
          ]
        },
        {
          title: 'Module 3: Advanced Focus & Proofing',
          lessons: [
            { title: '3.1 Focus & Eye-Contact in High Distraction', duration: '20 mins', status: 'locked', description: 'Engage absolute optical attention when competing with objects.', videoUrl: '', attachments: [] },
            { title: '3.2 Emergency Recall (The Whistle Blueprint)', duration: '28 mins', status: 'locked', description: 'Establish high-urgency reflex recall using whistles.', videoUrl: '', attachments: [] }
          ]
        }
      ])
    });

    const upsellProduct = await Product.create({
      title: 'Canine Advanced Training Upgrade',
      type: 'course',
      price: 29.00,
      stripePriceId: 'price_mock_upsell_29',
      description: 'Unlock advanced off-leash training, remote clicker behavior modification, and direct support feedback slots.',
      landingPageUrl: '/checkout?productId=' + courseProduct._id,
      gatewayId: simulateGateway._id,
    });

    const downsellProduct = await Product.create({
      title: '15 Behavior Quick Fixes (Starter Edition)',
      type: 'ebook',
      price: 9.99,
      stripePriceId: 'price_mock_ebook_9',
      description: 'Grab our quick guide containing 15 behavioral quick-fixes for immediately handling excessive barking and chewing problems.',
      landingPageUrl: '/checkout?productId=' + courseProduct._id,
      gatewayId: simulateGateway._id,
    });
    console.log('Default products created.');

    // 5. Create Product Funnel
    const funnel = await ProductFunnel.create({
      name: 'Canine Training Sales Funnel',
      description: 'Main product funnel with masterclass, advanced training upsell, and starter ebook downsell.',
      primaryProduct: courseProduct._id,
      upsellProduct: upsellProduct._id,
      downsellProduct: downsellProduct._id,
      isActive: true,
    });
    console.log('Product funnel created.');

    // 6. Create Pillar Page
    const pillarPage = await PillarPage.create({
      keyword: 'Dog Training',
      slug: 'dog-training',
      title: 'The Ultimate Dog Training Hub | OmniPublish',
      metaDescription: 'Science-backed dog training guide written by veterinary behaviorists. Learn crate training, loose-leash walking, and more using positive reinforcement.',
      heroTitle: 'The Definitive, Science-Backed Guide to Dog Training',
      heroSubtitle: 'Transition your rowdy pup into a perfectly behaved companion using positive reinforcement techniques validated by veterinary behaviorists.',
      introductionText: 'Dog training isn\'t about dominance; it\'s about clear communication. Traditional methodologies relied heavily on aversive corrections, but modern veterinary science proves that rewarding desired behaviors builds faster learning tracks and stronger relational trust. Below you will discover our complete matrix of educational articles, core industry terminology, and recommended tools to fast-track your training journey.',
      primaryProduct: courseProduct._id,
      author: author._id,
      icon: '🐕',
      accentColor: '#6366f1',
      category: 'Pets',
      isPublished: true,
      trustBadges: ['Reviewed by DVMs', 'Science-Backed Content', 'Positive Reinforcement Only'],
      affiliateDisclosure: 'This hub contains affiliate links. We may earn a commission at no extra cost to you.',
      updatedAt: new Date()
    });

    // 6b. Create a second Hub — Home Coffee Brewing
    const coffeeAuthor = await Author.create({
      name: 'Marcus Chen',
      bio: 'Marcus Chen is an SCA-certified roaster and Q-grader with 8 years of specialty coffee expertise. He has consulted for international roasteries.',
      credentials: 'SCA Certified, Q-Grader',
      avatarUrl: 'MC',
      verificationBadge: true
    });

    const coffeeProduct = await Product.create({
      title: 'The Home Barista Blueprint',
      type: 'course',
      price: 39.00,
      stripePriceId: 'price_mock_coffee_39',
      description: 'Master the art of home espresso, pour-over, and cold brew. 30+ HD video lessons from professional Q-graders.',
      landingPageUrl: '/checkout',
      gatewayId: simulateGateway._id,
      curriculum: JSON.stringify([
        {
          title: 'Module 1: Specialty Coffee Foundations',
          lessons: [
            { 
              title: '1.1 The Anatomy of a Coffee Cherry', 
              duration: '14 mins', 
              status: 'completed', 
              description: 'Explore the structural layers of coffee fruits and how processing styles (washed, natural) impact flavor profiles.',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              attachments: [
                { name: 'Anatomy Guide Sheet (PDF)', url: 'https://example.com/anatomy.pdf' }
              ]
            },
            { 
              title: '1.2 The Extraction Equation: Yield & Strength', 
              duration: '16 mins', 
              status: 'current', 
              description: 'Master total dissolved solids (TDS), extraction percentages, and how to calibrate your refractometer.',
              videoUrl: 'https://videoplayer.gg/watch/cf0e4a4e-2a8a-441f-87da-44be34b8a13f',
              attachments: [
                { name: 'Extraction Chart Sheet (PDF)', url: 'https://example.com/extraction.pdf' }
              ]
            }
          ]
        },
        {
          title: 'Module 2: Pour-Over Precision',
          lessons: [
            { title: '2.1 Grinder Calibration and Particle Ratios', duration: '18 mins', status: 'locked', description: 'Deconstruct burr geometry, fines distribution, and dial in ratios between 1:15 and 1:17.', videoUrl: '', attachments: [] },
            { title: '2.2 Turbulence and Pour Rate Dynamics', duration: '22 mins', status: 'locked', description: 'Learn kettle pouring height, circular patterns, and drawdown control methods.', videoUrl: '', attachments: [] }
          ]
        }
      ])
    });

    const coffeeHub = await PillarPage.create({
      keyword: 'Home Coffee Brewing',
      slug: 'home-coffee-brewing',
      title: 'The Ultimate Home Coffee Brewing Hub | OmniPublish',
      metaDescription: 'Learn to brew coffee like a professional barista at home. Espresso, pour-over, French press, and cold brew guides by certified Q-graders.',
      heroTitle: 'Master Home Coffee Brewing Like a Professional',
      heroSubtitle: 'From bean selection to latte art — everything you need to transform your kitchen into a specialty coffee bar.',
      introductionText: 'Great coffee starts with understanding. Whether you\'re pulling espresso shots, doing pour-overs, or perfecting cold brew ratios, this hub covers every technique with science-backed precision.',
      primaryProduct: coffeeProduct._id,
      author: coffeeAuthor._id,
      icon: '☕',
      accentColor: '#f59e0b',
      category: 'Lifestyle',
      isPublished: true,
      trustBadges: ['SCA Certified Expertise', 'Q-Grader Reviewed', 'Bean-to-Cup Science'],
      affiliateDisclosure: 'This hub contains affiliate links to coffee equipment. We earn commissions on qualifying purchases.',
      updatedAt: new Date()
    });
    console.log('Pillar pages created.');

    // 7. Create Blog Posts
    await BlogPost.create([
      {
        pillarId: pillarPage._id,
        title: 'Crate Training Made Easy: The 7-Day Blueprint',
        slug: 'crate-training-blueprint',
        content: `Crate training is one of the most vital foundations for a new puppy. It provides them with a safe haven and assists with housebreaking.

To begin, you want to make sure the crate is associated with comfort. Use Clicker Training to mark the exact moment your puppy steps inside. When they hear the mechanical click, follow up immediately with a High-Value Reward (like freeze-dried liver or cheese).

Never use the crate as a punishment. It should always remain a positive space where they feel secure. Over 7 days, gradually increase the time they spend inside, starting from 10 seconds up to several hours.`,
        excerpt: 'Learn how to make the crate your puppy\'s favorite safe haven without hours of stressful whimpering.',
        isFeatured: true,
        readTime: '8 mins'
      },
      {
        pillarId: pillarPage._id,
        title: 'How to Stop Loose-Leash Pulling Permanently',
        slug: 'loose-leash-pulling',
        content: `Walking should be a pleasant bonding experience, not an arm-straining tug of war.

The secret is the 'red-light, green-light' training method. When your dog pulls and the leash becomes taut (red-light), stop walking immediately. Stand completely still like a tree. Wait for your dog to turn back or loosen the tension.

The moment the leash goes slack, mark the behavior using Clicker Training (or a verbal 'yes!') and deliver a High-Value Reward. Then resume walking (green-light). Consistently rewarding the loose-leash position teaches them that pulling gets them nowhere, while walking near you unlocks rewards and lets them continue exploring.`,
        excerpt: 'Say goodbye to arm strain. Master the simple \'red-light, green-light\' technique during your neighborhood walks.',
        isFeatured: false,
        readTime: '12 mins'
      }
    ]);

    // 8. Create Glossary Terms
    await Glossary.create([
      {
        pillarId: pillarPage._id,
        term: 'Clicker Training',
        definition: 'A method of training that utilizes an audible marker sound (a mechanical click) to communicate the exact moment a dog performs the correct target action.',
        slug: 'clicker-training'
      },
      {
        pillarId: pillarPage._id,
        term: 'High-Value Reward',
        definition: 'Specially curated treats (e.g., freeze-dried liver, cheese cubes) reserved exclusively for complex behaviors or highly distracting outdoor environments.',
        slug: 'high-value-reward'
      }
    ]);

    // 9. Create Directory resources
    await Directory.create([
      {
        pillarId: pillarPage._id,
        resourceName: 'Blue-9 Balance Harness',
        category: 'Gear',
        description: 'An elite, 6-point adjustment harness that safely curtails pulling tendencies without restrictive throat configurations.',
        affiliateUrl: 'https://amazon.com/blue-9-balance-harness',
        rating: 5,
        isSponsored: true
      },
      {
        pillarId: pillarPage._id,
        resourceName: 'Kong Classic Rubber Toy',
        category: 'Tools',
        description: 'Super-durable natural rubber toy for mental stimulation and behavioral distraction. Best when stuffed with peanut butter or high-value treats.',
        affiliateUrl: 'https://amazon.com/kong-classic-toy',
        rating: 4.8,
        isSponsored: false
      }
    ]);
    console.log('Blog, glossary, and directory items created.');

    // 10. Create Users
    const customerPasswordHash = await bcrypt.hash('password123', 10);
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    const customerUser = await User.create({
      clerkId: 'user_customer_mock',
      name: 'John Customer',
      email: 'customer@example.com',
      password: customerPasswordHash,
      role: 'student',
      hasAccess: []
    });

    const adminUser = await User.create({
      clerkId: 'user_admin_mock',
      name: 'Alice Admin',
      email: 'admin@example.com',
      password: adminPasswordHash,
      role: 'admin',
      hasAccess: [courseProduct._id.toString(), coffeeProduct._id.toString()]
    });
    console.log('Test users created.');

    // 10.5 Seed StoryTemplates
    await StoryTemplate.create([
      {
        name: 'Hero\'s Journey Outline',
        isSystem: true,
        category: 'Plots',
        content: '1. The Ordinary World\n2. The Call of Adventure\n3. Refusal of the Call\n4. Meeting the Mentor\n5. Crossing the First Threshold\n6. Tests, Allies, Enemies\n7. Approach to the Inmost Cave\n8. The Ordeal\n9. Reward (Seizing the Sword)\n10. The Road Back\n11. Resurrection\n12. Return with the Elixir'
      },
      {
        name: 'Character Profile Worksheet',
        isSystem: true,
        category: 'Characters',
        content: 'Name:\nAge:\nRole in Story:\n\nPhysical Appearance:\n- Height:\n- Distinguishing Features:\n\nPersonality & Traits:\n- Strengths:\n- Weaknesses:\n- Core Motivation:\n- Greatest Fear:\n\nBackground/Backstory:\n[Insert background here]'
      },
      {
        name: 'Worldbuilding: Magic System',
        isSystem: true,
        category: 'worldbuilding',
        content: 'System Name:\n\nSource of Magic:\n(Where does the power come from?)\n\nRules & Limitations:\n(What can\'t the magic do?)\n\nCost/Consequences:\n(What is the physical/mental toll of using magic?)\n\nUsers (Who can use it?):\n\nSocietal Impact:\n(How does this magic affect the economy, government, and daily life?)'
      }
    ]);
    console.log('Story templates seeded.');

    // 11. Seed Default Site Theme
    const defaultTheme = await SiteTheme.create({
      name: 'Midnight Indigo',
      isDefault: true,
    });
    console.log('Default Midnight Indigo theme created.');

    console.log('DATABASE SEEDED SUCCESSFULLY!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
