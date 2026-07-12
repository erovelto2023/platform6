import dbConnect from '../lib/dbConnect';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runTest() {
  try {
    const { User, Product } = require('../models');

    await dbConnect();
    console.log('Connected to MongoDB.');

    // Find the test customer
    const user = await User.findOne({ email: 'customer@example.com' });
    if (!user) {
      console.error('Customer user not found. Please run the seed script first.');
      return;
    }
    console.log(`Found test customer: ${user.name} (${user.email})`);
    console.log('Initial access:', user.hasAccess);

    // Find the Perfect Canine Masterclass product
    const product = await Product.findOne({ title: 'The Perfect Canine Masterclass' });
    if (!product) {
      console.error('Perfect Canine Masterclass product not found.');
      return;
    }
    console.log(`Found product: ${product.title} (ID: ${product._id})`);

    // Simulate checkout by updating hasAccess
    console.log('Simulating purchase...');
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { hasAccess: product._id.toString() }
    });

    // Verify
    const updatedUser = await User.findById(user._id);
    console.log('Updated access:', updatedUser.hasAccess);
    if (updatedUser.hasAccess.includes(product._id.toString())) {
      console.log('SUCCESS: Product access has been successfully granted to the customer user!');
    } else {
      console.error('FAILURE: Product access was not granted.');
    }

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await mongoose.disconnect();
  }
}

runTest();
