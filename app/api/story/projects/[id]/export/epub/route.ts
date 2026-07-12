import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { StoryProject, StoryDocument } from '@/models';
import Epub from 'epub-gen-memory';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const project = await StoryProject.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const documents = await StoryDocument.find({ projectId: id, type: 'manuscript' });

    // Sort documents based on project.manuscriptOrder
    const order = project.manuscriptOrder || [];
    const orderedDocs = [...documents].sort((a, b) => {
      const indexA = order.indexOf(a._id.toString());
      const indexB = order.indexOf(b._id.toString());
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    const epubOptions = {
      title: project.title || 'Untitled Book',
      author: project.authorName || 'Unknown Author',
      cover: project.coverImage || undefined
    };

    const epubContent = orderedDocs.map(doc => ({
      title: doc.name,
      // Convert plain text to simple HTML paragraphs for the EPUB if it's not already HTML
      content: doc.content
        ? (doc.content.includes('<p>') 
            ? doc.content 
            : doc.content.split('\n\n').filter(Boolean).map((p: string) => `<p>${p}</p>`).join(''))
        : '<p>...</p>'
    }));

    // Generate EPUB buffer in memory
    const epubBuffer = await Epub(epubOptions, epubContent);

    // Return the EPUB file as a downloadable response
    return new NextResponse(epubBuffer as any, {
      headers: {
        'Content-Type': 'application/epub+zip',
        'Content-Disposition': `attachment; filename="${project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.epub"`
      }
    });

  } catch (error: any) {
    console.error('EPUB Export Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
