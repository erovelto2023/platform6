import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { BookTheme } from '@/models';
import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    // Fetch system themes + user's custom themes
    const user: any = session?.user;
    const query = user?.id 
      ? { $or: [{ isSystem: true }, { userId: user.id }] }
      : { isSystem: true };

    const themes = await BookTheme.find(query).sort({ createdAt: -1 });

    // Seed default themes if none exist
    if (themes.length === 0) {
      const defaultThemes = [
        { name: 'Dragon', isSystem: true, bodyFont: 'Palatino', chapterHeadingDropCap: true },
        { name: 'Aether', isSystem: true, bodyFont: 'Georgia', chapterHeadingDropCap: false },
        { name: 'Atreides', isSystem: true, bodyFont: 'Arial', chapterHeadingDropCap: true, chapterHeadingAlign: 'left' }
      ];
      await BookTheme.insertMany(defaultThemes);
      const seededThemes = await BookTheme.find(query).sort({ createdAt: -1 });
      return NextResponse.json({ themes: seededThemes });
    }

    return NextResponse.json({ themes });
  } catch (error: any) {
    console.error('Fetch Themes Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user: any = session?.user;
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const theme = await BookTheme.create({
      ...body,
      userId: user.id,
      isSystem: false // User created themes are never system
    });

    return NextResponse.json({ theme });
  } catch (error: any) {
    console.error('Create Theme Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
