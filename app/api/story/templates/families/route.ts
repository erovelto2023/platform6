import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { TemplateFamily, User, StoryTemplate } from '@/models';
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

    const userId = dbUser?._id;

    // Fetch system template families OR families owned by this user
    const query: any = {
      $or: [
        { isSystem: true },
        ...(userId ? [{ userId: userId }] : [])
      ]
    };

    const families = await TemplateFamily.find(query).sort({ name: 1 }).lean();
    
    for (let f of families) {
      f.templateCount = await StoryTemplate.countDocuments({ familyId: f._id });
    }

    const isAdmin = dbUser?.role === 'admin' || (clerkUser?.emailAddresses?.[0]?.emailAddress?.toLowerCase() === 'erovelto1@gmail.com');

    return NextResponse.json({ families, isAdmin: Boolean(isAdmin) });
  } catch (error) {
    console.error('Failed to fetch families:', error);
    return NextResponse.json({ error: 'Failed to fetch families' }, { status: 500 });
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
    const { name, description, isSystem } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const isAdmin = dbUser?.role === 'admin' || (email?.toLowerCase() === 'erovelto1@gmail.com');

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
