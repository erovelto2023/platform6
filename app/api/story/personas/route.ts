import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import { ChatPersona } from '@/models';

const DEFAULT_WRITING_ASSISTANT = `You are a creative writing assistant helping an author write fiction. You are knowledgeable about storytelling, character development, plot structure, dialogue, and prose style.

Your role is to:
- Help brainstorm ideas and overcome writer's block
- Provide feedback on characters, plot, and prose
- Suggest improvements while respecting the author's voice
- Answer questions about craft and genre conventions
- Help with worldbuilding and research

Be encouraging but honest. Give specific, actionable suggestions. When asked to write, match the author's established tone and style.`;

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    
    // Check if we need to seed
    let personas = await ChatPersona.find({}).sort({ name: 1 });
    
    if (personas.length === 0) {
      // Seed default persona
      const defaultPersona = await ChatPersona.create({
        name: 'Writing Assistant',
        description: 'General-purpose fiction writing helper',
        systemPrompt: DEFAULT_WRITING_ASSISTANT,
        isSystem: true,
        isDefault: true,
      });
      personas = [defaultPersona];
    }

    return NextResponse.json({ personas });
  } catch (error) {
    console.error('Failed to fetch personas:', error);
    return NextResponse.json({ error: 'Failed to fetch personas' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await req.json();
    const { name, description, systemPrompt, isSystem, isDefault } = body;

    if (!name || !systemPrompt) {
      return NextResponse.json({ error: 'Name and System Prompt are required' }, { status: 400 });
    }

    // If this one is set to default, unset others
    if (isDefault) {
      await ChatPersona.updateMany({}, { isDefault: false });
    }

    const persona = await ChatPersona.create({
      name,
      description: description || '',
      systemPrompt,
      isSystem: isSystem || false,
      isDefault: isDefault || false,
      // For now we don't bind to userId so it's a global setting for this instance, 
      // but in production you'd bind custom ones to session.user.id
    });

    return NextResponse.json({ persona }, { status: 201 });
  } catch (error) {
    console.error('Failed to create persona:', error);
    return NextResponse.json({ error: 'Failed to create persona' }, { status: 500 });
  }
}
