import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { StoryTemplate, TemplateFamily, TemplateSubgenre } from '@/models';
import path from 'path';
import fs from 'fs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    if (token !== 'seed_db_7788') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const jsonPath = path.join(process.cwd(), 'scripts', 'story-hacker-templates.json');
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({ 
        success: false, 
        error: `Templates JSON file not found at ${jsonPath}` 
      }, { status: 404 });
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // Clear existing system-wide structures
    const delTemplates = await StoryTemplate.deleteMany({ isSystem: true });
    const delSubgenres = await TemplateSubgenre.deleteMany({ isSystem: true });
    const delFamilies = await TemplateFamily.deleteMany({ isSystem: true });

    // 1. Insert families and build name -> _id map
    const familyMap: Record<string, string> = {};
    for (const fam of data.families) {
      const doc = await TemplateFamily.create({
        name: fam.name,
        description: fam.description || '',
        isSystem: true,
      });
      familyMap[fam.name] = doc._id.toString();
    }

    // 2. Insert subgenres and build name -> _id map
    const subgenreMap: Record<string, string> = {};
    for (const sub of data.subgenres) {
      const familyId = familyMap[sub.familyName];
      if (!familyId) {
        console.warn(`Skipping subgenre "${sub.name}" - unknown family "${sub.familyName}"`);
        continue;
      }
      const doc = await TemplateSubgenre.create({
        name: sub.name,
        description: sub.description || '',
        familyId,
        isSystem: true,
      });
      subgenreMap[sub.name] = doc._id.toString();
    }

    // 3. Insert templates with proper familyId and subgenreId references
    let templatesSeeded = 0;
    for (const tmpl of data.templates) {
      const familyId = familyMap[tmpl.familyName];
      const subgenreId = subgenreMap[tmpl.subgenreName];
      if (!familyId || !subgenreId) {
        console.warn(`Skipping template "${tmpl.name}" - unknown family/subgenre`);
        continue;
      }
      await StoryTemplate.create({
        name: tmpl.name,
        description: tmpl.description || '',
        category: tmpl.category || '',
        content: tmpl.content || '',
        familyId,
        subgenreId,
        isSystem: true,
      });
      templatesSeeded++;
    }

    return NextResponse.json({
      success: true,
      message: 'Story Hacker templates seeded successfully!',
      stats: {
        familiesSeeded: Object.keys(familyMap).length,
        subgenresSeeded: Object.keys(subgenreMap).length,
        templatesSeeded,
        deleted: {
          families: delFamilies.deletedCount,
          subgenres: delSubgenres.deletedCount,
          templates: delTemplates.deletedCount
        }
      }
    });
  } catch (error: any) {
    console.error('Story templates seeding API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
