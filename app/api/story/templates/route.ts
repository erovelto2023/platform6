import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { StoryTemplate } from '@/models';
import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const familyId = searchParams.get('familyId');
    const subgenreId = searchParams.get('subgenreId');

    const User = require('@/models').User;
    const dbUser = await User.findOne({ email: session.user.email });
    const userId = dbUser?._id;

    // Build query: System templates OR templates owned by this user
    const query: any = {
      $or: [
        { isSystem: true },
        { userId: userId }
      ]
    };

    if (familyId) query.familyId = familyId;
    if (subgenreId) query.subgenreId = subgenreId;

    const templates = await StoryTemplate.find(query).sort({ category: 1, name: 1 });
    return NextResponse.json({ 
      templates,
      isAdmin: dbUser?.role === 'admin'
    });
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  // if (!session?.user) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  // Assuming only admins can create templates, or we allow any authenticated user for now
  try {
    const body = await req.json();
    const { name, category, content, familyId, subgenreId, isSystem, description } = body;

    if (!name || !category) {
      return NextResponse.json({ error: 'name and category are required' }, { status: 400 });
    }

    const User = require('@/models').User;
    let dbUser = session?.user?.email ? await User.findOne({ email: session.user.email }) : await User.findOne();
    const isAdmin = dbUser?.role === 'admin';

    const template = await StoryTemplate.create({
      name,
      description: description || '',
      category,
      content: content || '',
      familyId: familyId || null,
      subgenreId: subgenreId || null,
      isSystem: isAdmin && isSystem === true ? true : false,
      userId: dbUser?._id
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error('Failed to create template:', error);
    require('fs').appendFileSync('scratch/err.log', String(error) + '\n');
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
