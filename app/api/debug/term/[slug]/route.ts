import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/connect';
import GlossaryTerm from '@/lib/db/models/GlossaryTerm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await connectToDatabase();
  const term = await GlossaryTerm.findOne({ slug }).lean();
  return NextResponse.json(term);
}
