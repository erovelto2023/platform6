import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { ProductFunnel } from '@/models';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const funnelId = searchParams.get('funnelId');
    if (!funnelId) {
      return NextResponse.json({ error: 'funnelId is required.' }, { status: 400 });
    }

    await dbConnect();
    const funnel = await ProductFunnel.findById(funnelId);
    if (!funnel) {
      return NextResponse.json({ error: 'Funnel not found.' }, { status: 404 });
    }

    return NextResponse.json({
      hasDownsell: !!funnel.downsellProduct,
      downsellProductId: funnel.downsellProduct ? funnel.downsellProduct.toString() : null,
      upsellProductId: funnel.upsellProduct ? funnel.upsellProduct.toString() : null,
      primaryProductId: funnel.primaryProduct ? funnel.primaryProduct.toString() : null,
    });
  } catch (error: any) {
    console.error('Funnel details fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 550 });
  }
}
