import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import { StoryChat, StoryProject } from '@/models';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  await dbConnect();

  try {
    // Ensure user owns the project
    const project = await StoryProject.findOne({ _id: projectId, userId: (session.user as any).id });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const chats = await StoryChat.find({ projectId }).sort({ createdAt: 1 });
    return NextResponse.json({ chats });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { projectId, name, messages = [] } = await req.json();

    if (!projectId || !name) {
      return NextResponse.json({ error: 'Project ID and Name are required' }, { status: 400 });
    }

    await dbConnect();

    // Ensure user owns the project
    const project = await StoryProject.findOne({ _id: projectId, userId: (session.user as any).id });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const chat = await StoryChat.create({
      projectId,
      userId: (session.user as any).id,
      name,
      messages
    });

    return NextResponse.json({ chat }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 });
  }
}
