import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import { ChatPersona } from '@/models';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();
    const { name, description, systemPrompt, isDefault } = body;

    if (!name || !systemPrompt) {
      return NextResponse.json({ error: 'Name and System Prompt are required' }, { status: 400 });
    }

    if (isDefault) {
      await ChatPersona.updateMany({ _id: { $ne: id } }, { isDefault: false });
    }

    const persona = await ChatPersona.findByIdAndUpdate(
      id,
      {
        name,
        description: description || '',
        systemPrompt,
        isDefault: isDefault || false,
        updatedAt: new Date()
      },
      { returnDocument: 'after' }
    );

    if (!persona) {
      return NextResponse.json({ error: 'Persona not found' }, { status: 404 });
    }

    return NextResponse.json({ persona });
  } catch (error) {
    console.error('Failed to update persona:', error);
    return NextResponse.json({ error: 'Failed to update persona' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await dbConnect();
    
    // Prevent deletion of system personas unless handled specifically, but we'll allow it for now
    // if you want full control. To protect:
    // const existing = await ChatPersona.findById(id);
    // if (existing?.isSystem) return error...

    const persona = await ChatPersona.findByIdAndDelete(id);

    if (!persona) {
      return NextResponse.json({ error: 'Persona not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete persona:', error);
    return NextResponse.json({ error: 'Failed to delete persona' }, { status: 500 });
  }
}
