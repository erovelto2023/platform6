import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { ProductFunnel } from '@/models';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    if (!productId) {
      return NextResponse.json({ error: 'productId is required.' }, { status: 400 });
    }

    await dbConnect();
    // Query active funnel linked to this primary product
    const funnel = await ProductFunnel.findOne({ primaryProduct: productId, isActive: true });

    if (funnel && funnel.upsellProduct) {
      return NextResponse.json({
        hasUpsell: true,
        funnelId: funnel._id.toString(),
        upsellProductId: funnel.upsellProduct.toString(),
      });
    }

    return NextResponse.json({ hasUpsell: false });
  } catch (error: any) {
    console.error('Funnel check error:', error);
    return NextResponse.json({ error: error.message }, { status: 550 });
  }
}
