import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import AffiliateCompany from '@/lib/db/models/AffiliateCompany';
import AffiliateProduct from '@/lib/db/models/AffiliateProduct';
import UserAffiliateCompany from '@/lib/db/models/UserAffiliateCompany';
import UserAffiliateProduct from '@/lib/db/models/UserAffiliateProduct';
import PersonalAffiliateOffer from '@/lib/db/models/PersonalAffiliateOffer';
import { Directory, Product, PillarPage, TemplateFamily, TemplateSubgenre, StoryTemplate } from '@/models';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    if (token !== 'check_db_7788') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const results: any = {};

    // Get collections and counts directly from MongoDB
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      results.rawCollections = {};
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        results.rawCollections[col.name] = count;
      }
    }

    // Get model samples
    results.users = {
      count: await User.countDocuments(),
      samples: await User.find().select('name email role clerkId').limit(10).lean()
    };

    results.affiliateCompanies = {
      count: await AffiliateCompany.countDocuments(),
      samples: await AffiliateCompany.find().select('name slug createdBy isPublic').limit(10).lean()
    };

    results.affiliateProducts = {
      count: await AffiliateProduct.countDocuments(),
      samples: await AffiliateProduct.find().select('name companyId price').limit(10).lean()
    };

    results.userAffiliateCompanies = {
      count: await UserAffiliateCompany.countDocuments(),
      samples: await UserAffiliateCompany.find().limit(10).lean()
    };

    results.userAffiliateProducts = {
      count: await UserAffiliateProduct.countDocuments(),
      samples: await UserAffiliateProduct.find().limit(10).lean()
    };

    results.personalAffiliateOffers = {
      count: await PersonalAffiliateOffer.countDocuments(),
      samples: await PersonalAffiliateOffer.find().limit(10).lean()
    };

    results.publishingProducts = {
      count: await Product.countDocuments(),
      samples: await Product.find().limit(10).lean()
    };

    results.publishingDirectories = {
      count: await Directory.countDocuments(),
      samples: await Directory.find().limit(10).lean()
    };

    results.publishingPillarPages = {
      count: await PillarPage.countDocuments(),
      samples: await PillarPage.find().select('keyword slug title').limit(10).lean()
    };

    const fullTemplates = searchParams.get('fullTemplates') === 'true';

    results.storyTemplates = {
      count: await StoryTemplate.countDocuments(),
      samples: await StoryTemplate.find().limit(fullTemplates ? 1000 : 10).lean()
    };

    results.storyTemplateFamilies = {
      count: await TemplateFamily.countDocuments(),
      samples: await TemplateFamily.find().limit(fullTemplates ? 1000 : 10).lean()
    };

    results.storyTemplateSubgenres = {
      count: await TemplateSubgenre.countDocuments(),
      samples: await TemplateSubgenre.find().limit(fullTemplates ? 1000 : 10).lean()
    };

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
