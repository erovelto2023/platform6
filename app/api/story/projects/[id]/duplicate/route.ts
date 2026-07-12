import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { StoryProject, StoryDocument } from '@/models';
import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const originalProject = await StoryProject.findOne({
      _id: id,
      userId: (session.user as any).id,
    });

    if (!originalProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Duplicate project
    const newProject = await StoryProject.create({
      title: `${originalProject.title} (Copy)`,
      description: originalProject.description,
      isArchived: false,
      userId: (session.user as any).id,
    });

    // Duplicate documents
    const documents = await StoryDocument.find({ projectId: id });
    if (documents.length > 0) {
      const docsToCreate = documents.map(doc => ({
        projectId: newProject._id,
        name: doc.name,
        type: doc.type,
        content: doc.content,
      }));
      await StoryDocument.insertMany(docsToCreate);
    }

    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error) {
    console.error('Failed to duplicate project:', error);
    return NextResponse.json({ error: 'Failed to duplicate project' }, { status: 500 });
  }
}
