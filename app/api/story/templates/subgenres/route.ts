import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { TemplateSubgenre, User, StoryTemplate } from '@/models';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  await dbConnect();

  try {
    const clerkUser = await currentUser();
    let dbUser = null;

    if (clerkUser) {
      const email = clerkUser.emailAddresses?.[0]?.emailAddress;
      dbUser = await User.findOne({ $or: [{ clerkId: clerkUser.id }, { email }] });
    }

    const { searchParams } = new URL(req.url);
    const familyId = searchParams.get('familyId');
    const userId = dbUser?._id;

    const query: any = {
      $or: [
        { isSystem: true },
        ...(userId ? [{ userId: userId }] : [])
      ]
    };

    if (familyId) query.familyId = familyId;

    const subgenres = await TemplateSubgenre.find(query).sort({ name: 1 }).lean();
    
    for (let s of subgenres) {
      s.templateCount = await StoryTemplate.countDocuments({ subgenreId: s._id });
    }

    const isAdmin = dbUser?.role === 'admin' || (clerkUser?.emailAddresses?.[0]?.emailAddress?.toLowerCase() === 'erovelto1@gmail.com');

    return NextResponse.json({ subgenres, isAdmin: Boolean(isAdmin) });
  } catch (error) {
    console.error('Failed to fetch subgenres:', error);
    return NextResponse.json({ error: 'Failed to fetch subgenres' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = clerkUser.emailAddresses?.[0]?.emailAddress;
    let dbUser = await User.findOne({ $or: [{ clerkId: clerkUser.id }, { email }] });

    const body = await req.json();
    const { name, description, familyId, isSystem } = body;

    if (!name || !familyId) {
      return NextResponse.json({ error: 'Name and familyId are required' }, { status: 400 });
    }

    const isAdmin = dbUser?.role === 'admin' || (email?.toLowerCase() === 'erovelto1@gmail.com');

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
