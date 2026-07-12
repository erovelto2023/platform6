import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';

export async function PUT(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { User, StoryTemplate } = require('@/models');
    const dbUser = await User.findOne({ email: session.user.email });
    const isAdmin = dbUser?.role === 'admin';

    const body = await req.json();
    const { type, oldName, newName, familyParam } = body;

    if (!oldName || !newName || !type) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const query: any = {};
    if (type === 'family') {
      query.family = oldName;
    } else if (type === 'subgenre') {
      query.subgenre = oldName;
      if (familyParam) query.family = familyParam; // Scoped to family
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (!isAdmin) {
      query.userId = dbUser?._id;
      // non-admins cannot modify system templates
      query.isSystem = false;
    }

    const update: any = {};
    if (type === 'family') {
      update.family = newName;
    } else {
      update.subgenre = newName;
    }

    const result = await StoryTemplate.updateMany(query, { $set: update });

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error('Failed to bulk edit templates:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const name = searchParams.get('name');
    const familyParam = searchParams.get('family');

    const { User, StoryTemplate } = require('@/models');
    const dbUser = await User.findOne({ email: session.user.email });
    const isAdmin = dbUser?.role === 'admin';

    if (!name || !type) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const query: any = {};
    if (type === 'family') {
      query.family = name;
    } else if (type === 'subgenre') {
      query.subgenre = name;
      if (familyParam) query.family = familyParam;
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (!isAdmin) {
      query.userId = dbUser?._id;
      // non-admins cannot delete system templates
      query.isSystem = false;
    }

    const result = await StoryTemplate.deleteMany(query);

    return NextResponse.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Failed to bulk delete templates:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
