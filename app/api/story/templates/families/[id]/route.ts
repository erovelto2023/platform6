import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { TemplateFamily, TemplateSubgenre, StoryTemplate, User } from '@/models';
import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const dbUser = await User.findOne({ email: session.user.email });
    const family = await TemplateFamily.findById(id);

    if (!family) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const isAdmin = dbUser?.role === 'admin';
    if (!isAdmin) {
      if (family.isSystem || family.userId?.toString() !== dbUser?._id.toString()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    const body = await req.json();
    if (body.name) family.name = body.name;
    if (body.description !== undefined) family.description = body.description;
    if (isAdmin && body.isSystem !== undefined) family.isSystem = body.isSystem;
    
    family.updatedAt = new Date();
    await family.save();

    return NextResponse.json({ family });
  } catch (error) {
    console.error('Failed to update family:', error);
    return NextResponse.json({ error: 'Failed to update family' }, { status: 500 });
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
    const dbUser = await User.findOne({ email: session.user.email });
    const family = await TemplateFamily.findById(id);

    if (!family) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const isAdmin = dbUser?.role === 'admin';
    if (!isAdmin) {
      if (family.isSystem || family.userId?.toString() !== dbUser?._id.toString()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // Delete family, all subgenres, and all templates within it
    await TemplateFamily.findByIdAndDelete(id);
    await TemplateSubgenre.deleteMany({ familyId: id });
    await StoryTemplate.deleteMany({ familyId: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete family:', error);
    return NextResponse.json({ error: 'Failed to delete family' }, { status: 500 });
  }
}
