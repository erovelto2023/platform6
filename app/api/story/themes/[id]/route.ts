import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { BookTheme } from '@/models';
import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const user: any = session?.user;
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const theme = await BookTheme.findOneAndUpdate(
      { _id: id, userId: user.id, isSystem: false }, // Prevent editing system themes
      { ...body, updatedAt: Date.now() },
      { returnDocument: 'after' }
    );

    if (!theme) {
      return NextResponse.json({ error: 'Theme not found or cannot be modified' }, { status: 404 });
    }

    return NextResponse.json({ theme });
  } catch (error: any) {
    console.error('Update Theme Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const user: any = session?.user;
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    const theme = await BookTheme.findOneAndDelete({ 
      _id: id, 
      userId: user.id, 
      isSystem: false 
    });

    if (!theme) {
      return NextResponse.json({ error: 'Theme not found or cannot be deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete Theme Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
