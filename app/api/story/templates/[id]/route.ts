import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { StoryTemplate, User } = require('@/models');
    
    const template = await StoryTemplate.findById(id);
    if (!template) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const dbUser = await User.findOne({ email: session.user.email });
    const isOwner = template.userId?.toString() === dbUser?._id.toString();

    if (!template.isSystem && !isOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error('Failed to fetch template:', error);
    return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { StoryTemplate, User } = require('@/models');
    
    const dbUser = await User.findOne({ email: session.user.email });
    const template = await StoryTemplate.findById(id);

    if (!template) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const isAdmin = dbUser?.role === 'admin';
    if (!isAdmin) {
      if (template.isSystem) {
        return NextResponse.json({ error: 'Cannot edit system templates' }, { status: 403 });
      }
      if (template.userId?.toString() !== dbUser?._id.toString()) {
        return NextResponse.json({ error: 'Cannot edit templates you do not own' }, { status: 403 });
      }
    }

    const body = await req.json();
    const { name, category, content, familyId, subgenreId, isSystem, description } = body;

    template.name = name || template.name;
    template.description = description !== undefined ? description : template.description;
    template.category = category || template.category;
    template.content = content !== undefined ? content : template.content;
    if (familyId !== undefined) template.familyId = familyId;
    if (subgenreId !== undefined) template.subgenreId = subgenreId;
    if (isAdmin && isSystem !== undefined) {
      template.isSystem = isSystem;
    }
    template.updatedAt = new Date();

    await template.save();

    return NextResponse.json({ template });
  } catch (error) {
    console.error('Failed to update template:', error);
    require('fs').appendFileSync('scratch/err.log', String(error) + '\n');
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { StoryTemplate, User } = require('@/models');
    
    const dbUser = await User.findOne({ email: session.user.email });
    const template = await StoryTemplate.findById(id);

    if (!template) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const isAdmin = dbUser?.role === 'admin';
    if (!isAdmin) {
      if (template.isSystem) {
        return NextResponse.json({ error: 'Cannot delete system templates' }, { status: 403 });
      }
      if (template.userId?.toString() !== dbUser?._id.toString()) {
        return NextResponse.json({ error: 'Cannot delete templates you do not own' }, { status: 403 });
      }
    }

    await StoryTemplate.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete template:', error);
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}
