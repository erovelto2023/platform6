import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import { User, Product } from '@/models';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'You must be signed in to purchase.' }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    await dbConnect();
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    const userId = (session.user as any).id;

    // Add product to user's hasAccess array in MongoDB
    await User.findByIdAndUpdate(userId, {
      $addToSet: { hasAccess: product._id.toString() }
    });

    return NextResponse.json({
      success: true,
      message: 'Product access granted successfully!',
      productId: product._id.toString(),
      courseUrl: `/courses/${product._id}`
    });

  } catch (error: any) {
    console.error('Simulated checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
