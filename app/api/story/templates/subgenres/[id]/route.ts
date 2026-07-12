import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { TemplateSubgenre, StoryTemplate, User } from '@/models';
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
    const subgenre = await TemplateSubgenre.findById(id);

    if (!subgenre) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const isAdmin = dbUser?.role === 'admin';
    if (!isAdmin) {
      if (subgenre.isSystem || subgenre.userId?.toString() !== dbUser?._id.toString()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    const body = await req.json();
    if (body.name) subgenre.name = body.name;
    if (body.description !== undefined) subgenre.description = body.description;
    if (isAdmin && body.isSystem !== undefined) subgenre.isSystem = body.isSystem;
    
    subgenre.updatedAt = new Date();
    await subgenre.save();

    return NextResponse.json({ subgenre });
  } catch (error) {
    console.error('Failed to update subgenre:', error);
    return NextResponse.json({ error: 'Failed to update subgenre' }, { status: 500 });
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
    const subgenre = await TemplateSubgenre.findById(id);

    if (!subgenre) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const isAdmin = dbUser?.role === 'admin';
    if (!isAdmin) {
      if (subgenre.isSystem || subgenre.userId?.toString() !== dbUser?._id.toString()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // Delete subgenre and all templates within it
    await TemplateSubgenre.findByIdAndDelete(id);
    await StoryTemplate.deleteMany({ subgenreId: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete subgenre:', error);
    return NextResponse.json({ error: 'Failed to delete subgenre' }, { status: 500 });
  }
}
