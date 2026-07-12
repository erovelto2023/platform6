import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { TemplateSubgenre, User } from '@/models';
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

    const dbUser = await User.findOne({ email: session.user.email });
    const userId = dbUser?._id;

    const query: any = {
      $or: [
        { isSystem: true },
        { userId: userId }
      ]
    };

    if (familyId) query.familyId = familyId;

    const { StoryTemplate } = require('@/models');
    const subgenres = await TemplateSubgenre.find(query).sort({ name: 1 }).lean();
    
    for (let s of subgenres) {
      s.templateCount = await StoryTemplate.countDocuments({ subgenreId: s._id });
    }

    return NextResponse.json({ subgenres, isAdmin: dbUser?.role === 'admin' });
  } catch (error) {
    console.error('Failed to fetch subgenres:', error);
    return NextResponse.json({ error: 'Failed to fetch subgenres' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, familyId, isSystem } = body;

    if (!name || !familyId) {
      return NextResponse.json({ error: 'Name and familyId are required' }, { status: 400 });
    }

    const dbUser = await User.findOne({ email: session.user.email });
    const isAdmin = dbUser?.role === 'admin';

    const subgenre = await TemplateSubgenre.create({
      name,
      description: description || '',
      familyId,
      isSystem: isAdmin && isSystem === true ? true : false,
      userId: dbUser?._id
    });

    return NextResponse.json({ subgenre }, { status: 201 });
  } catch (error) {
    console.error('Failed to create subgenre:', error);
    return NextResponse.json({ error: 'Failed to create subgenre' }, { status: 500 });
  }
}
