import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/connect';
import GlossaryTerm from '@/lib/db/models/GlossaryTerm';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  await connectToDatabase();
  const term = await GlossaryTerm.findOne({ slug }).lean();
  return NextResponse.json(term);
}
