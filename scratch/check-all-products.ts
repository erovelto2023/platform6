import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import connectDB from '../lib/db/connect';
import PersonalAffiliateOffer from '../lib/db/models/PersonalAffiliateOffer';
import AffiliateProduct from '../lib/db/models/AffiliateProduct';
import UserAffiliateProduct from '../lib/db/models/UserAffiliateProduct';
import Product from '../lib/db/models/Product';

async function main() {
  try {
    await connectDB();
    console.log("Connected to DB.");

    const personalOffers = await PersonalAffiliateOffer.find({});
    console.log(`PersonalAffiliateOffer count: ${personalOffers.length}`);
    if (personalOffers.length > 0) {
      console.log("PersonalAffiliateOffer sample:", personalOffers.slice(0, 3));
    }

    const affiliateProducts = await AffiliateProduct.find({});
    console.log(`AffiliateProduct count: ${affiliateProducts.length}`);

    const userAffiliateProducts = await UserAffiliateProduct.find({});
    console.log(`UserAffiliateProduct count: ${userAffiliateProducts.length}`);

    const products = await Product.find({});
    console.log(`Product count: ${products.length}`);
    if (products.length > 0) {
      console.log("Product sample:", products.slice(0, 3));
    }

  } catch (error) {
    console.error("ERROR checking products:", error);
  }
  process.exit(0);
}

main();
