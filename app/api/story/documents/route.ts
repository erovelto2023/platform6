import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { StoryDocument, StoryProject } from '@/models';
import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
  }

  try {
    // Verify user owns the project
    const project = await StoryProject.findOne({
      _id: projectId,
      userId: (session.user as any).id,
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    const documents = await StoryDocument.find({ projectId }).sort({ updatedAt: -1 });
    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Failed to fetch documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { projectId, name, type, content } = body;

    if (!projectId || !name || !type) {
      return NextResponse.json({ error: 'projectId, name, and type are required' }, { status: 400 });
    }

    // Verify project ownership
    const project = await StoryProject.findOne({
      _id: projectId,
      userId: (session.user as any).id,
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    const document = await StoryDocument.create({
      projectId,
      name,
      type,
      content: content || '',
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error('Failed to create document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { documentId, content, name, aiAnalysis } = body;

    if (!documentId) {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 });
    }

    // Verify document exists and user owns the project
    const document = await StoryDocument.findById(documentId).populate('projectId');
    
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const project = document.projectId;
    if (project.userId.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (content !== undefined) document.content = content;
    if (name !== undefined) document.name = name;
    if (aiAnalysis !== undefined) document.aiAnalysis = { ...document.aiAnalysis, ...aiAnalysis };
    
    document.updatedAt = new Date();
    await document.save();

    return NextResponse.json({ document }, { status: 200 });
  } catch (error) {
    console.error('Failed to update document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}
