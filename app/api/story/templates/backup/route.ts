import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { TemplateFamily, TemplateSubgenre, StoryTemplate, User } from '@/models';
import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = dbUser._id;

    // Fetch all families, subgenres, and templates visible to the user (isSystem: true OR owned by this user)
    const visibilityQuery = {
      $or: [
        { isSystem: true },
        { userId: userId }
      ]
    };

    const families = await TemplateFamily.find(visibilityQuery).lean();
    const subgenres = await TemplateSubgenre.find(visibilityQuery).lean();
    const templates = await StoryTemplate.find(visibilityQuery).lean();

    return NextResponse.json({
      success: true,
      data: {
        families,
        subgenres,
        templates
      }
    });
  } catch (error: any) {
    console.error('Failed to export templates:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isAdmin = dbUser.role === 'admin';
    const userId = dbUser._id;

    const body = await req.json();
    const { families = [], subgenres = [], templates = [] } = body;

    // We will keep a map of old ID -> new ID to restore relationships
    const familyIdMap: Record<string, string> = {};
    const subgenreIdMap: Record<string, string> = {};

    let familiesCreated = 0;
    let subgenresCreated = 0;
    let templatesCreated = 0;
    let templatesUpdated = 0;

    // 1. Process Families
    for (const fam of families) {
      const oldId = fam._id;
      // Check if family already exists by name and ownership (or system status)
      const existingFam = await TemplateFamily.findOne({
        name: fam.name,
        $or: [
          { isSystem: true },
          { userId: userId }
        ]
      });

      if (existingFam) {
        familyIdMap[oldId] = existingFam._id.toString();
      } else {
        const newFam = await TemplateFamily.create({
          name: fam.name,
          description: fam.description || '',
          isSystem: isAdmin && fam.isSystem === true,
          userId: userId
        });
        familyIdMap[oldId] = newFam._id.toString();
        familiesCreated++;
      }
    }

    // 2. Process Subgenres
    for (const sub of subgenres) {
      const oldId = sub._id;
      const newFamilyId = familyIdMap[sub.familyId];
      if (!newFamilyId) continue; // Skip if parent family didn't map

      // Check if subgenre already exists by name and parent family ID
      const existingSub = await TemplateSubgenre.findOne({
        name: sub.name,
        familyId: newFamilyId,
        $or: [
          { isSystem: true },
          { userId: userId }
        ]
      });

      if (existingSub) {
        subgenreIdMap[oldId] = existingSub._id.toString();
      } else {
        const newSub = await TemplateSubgenre.create({
          name: sub.name,
          description: sub.description || '',
          familyId: newFamilyId,
          isSystem: isAdmin && sub.isSystem === true,
          userId: userId
        });
        subgenreIdMap[oldId] = newSub._id.toString();
        subgenresCreated++;
      }
    }

    // 3. Process Templates
    for (const tpl of templates) {
      const newFamilyId = familyIdMap[tpl.familyId];
      const newSubgenreId = subgenreIdMap[tpl.subgenreId];
      if (!newFamilyId || !newSubgenreId) continue; // Skip if hierarchy missing

      // Check if template already exists by name, subgenre, and ownership
      const existingTpl = await StoryTemplate.findOne({
        name: tpl.name,
        familyId: newFamilyId,
        subgenreId: newSubgenreId,
        $or: [
          { isSystem: true },
          { userId: userId }
        ]
      });

      if (existingTpl) {
        // Update content and details (restore content backup)
        await StoryTemplate.findByIdAndUpdate(existingTpl._id, {
          description: tpl.description || '',
          category: tpl.category,
          content: tpl.content || '',
          isSystem: isAdmin && tpl.isSystem === true,
          updatedAt: new Date()
        });
        templatesUpdated++;
      } else {
        await StoryTemplate.create({
          name: tpl.name,
          description: tpl.description || '',
          category: tpl.category,
          content: tpl.content || '',
          familyId: newFamilyId,
          subgenreId: newSubgenreId,
          isSystem: isAdmin && tpl.isSystem === true,
          userId: userId
        });
        templatesCreated++;
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        familiesCreated,
        subgenresCreated,
        templatesCreated,
        templatesUpdated
      }
    });
  } catch (error: any) {
    console.error('Failed to import templates:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
