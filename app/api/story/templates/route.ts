import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { StoryTemplate, User } from '@/models';
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
    const subgenreId = searchParams.get('subgenreId');
    const userId = dbUser?._id;

    // Build query: System templates OR templates owned by this user
    const query: any = {
      $or: [
        { isSystem: true },
        ...(userId ? [{ userId: userId }] : [])
      ]
    };

    if (familyId) query.familyId = familyId;
    if (subgenreId) query.subgenreId = subgenreId;

    const templates = await StoryTemplate.find(query).sort({ category: 1, name: 1 }).lean();
    
    const isAdmin = dbUser?.role === 'admin' || (clerkUser?.emailAddresses?.[0]?.emailAddress?.toLowerCase() === 'erovelto1@gmail.com');

    return NextResponse.json({ 
      templates,
      isAdmin: Boolean(isAdmin)
    });
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
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
    const { name, category, content, familyId, subgenreId, isSystem, description } = body;

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
    }

    const isAdmin = dbUser?.role === 'admin' || (email?.toLowerCase() === 'erovelto1@gmail.com');

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
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
