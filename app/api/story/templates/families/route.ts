import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { TemplateFamily, User } from '@/models';
import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dbUser = await User.findOne({ email: session.user.email });
    const userId = dbUser?._id;

    const query: any = {
      $or: [
        { isSystem: true },
        { userId: userId }
      ]
    };

    const { StoryTemplate } = require('@/models');
    const families = await TemplateFamily.find(query).sort({ name: 1 }).lean();
    
    for (let f of families) {
      f.templateCount = await StoryTemplate.countDocuments({ familyId: f._id });
    }

    return NextResponse.json({ families, isAdmin: dbUser?.role === 'admin' });
  } catch (error) {
    console.error('Failed to fetch families:', error);
    return NextResponse.json({ error: 'Failed to fetch families' }, { status: 500 });
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
    const { name, description, isSystem } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const dbUser = await User.findOne({ email: session.user.email });
    const isAdmin = dbUser?.role === 'admin';

    const family = await TemplateFamily.create({
      name,
      description: description || '',
      isSystem: isAdmin && isSystem === true ? true : false,
      userId: dbUser?._id
    });

    return NextResponse.json({ family }, { status: 201 });
  } catch (error) {
    console.error('Failed to create family:', error);
    return NextResponse.json({ error: 'Failed to create family' }, { status: 500 });
  }
}
