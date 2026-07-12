import dbConnect from '../lib/dbConnect';
import { StoryTemplate, TemplateFamily, TemplateSubgenre } from '../models';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

async function main() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB.');

    const jsonPath = path.join(__dirname, 'story-hacker-templates.json');
    if (!fs.existsSync(jsonPath)) {
      console.error(`Templates JSON file not found at ${jsonPath}`);
      process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Loaded ${data.families.length} families, ${data.subgenres.length} subgenres, ${data.templates.length} templates from JSON.`);

    // Clear existing system-wide structures
    const delTemplates = await StoryTemplate.deleteMany({ isSystem: true });
    const delSubgenres = await TemplateSubgenre.deleteMany({ isSystem: true });
    const delFamilies = await TemplateFamily.deleteMany({ isSystem: true });
    console.log(`Cleared: ${delFamilies.deletedCount} families, ${delSubgenres.deletedCount} subgenres, ${delTemplates.deletedCount} templates`);

    // 1. Insert families and build name -> _id map
    const familyMap: Record<string, string> = {};
    for (const fam of data.families) {
      const doc = await TemplateFamily.create({
        name: fam.name,
        description: fam.description || '',
        isSystem: true,
      });
      familyMap[fam.name] = doc._id.toString();
      console.log(`  ✅ Family: ${fam.name}`);
    }

    // 2. Insert subgenres and build name -> _id map
    const subgenreMap: Record<string, string> = {};
    for (const sub of data.subgenres) {
      const familyId = familyMap[sub.familyName];
      if (!familyId) {
        console.warn(`  ⚠️ Skipping subgenre "${sub.name}" - unknown family "${sub.familyName}"`);
        continue;
      }
      const doc = await TemplateSubgenre.create({
        name: sub.name,
        description: sub.description || '',
        familyId,
        isSystem: true,
      });
      subgenreMap[sub.name] = doc._id.toString();
      console.log(`  ✅ Subgenre: ${sub.name}`);
    }

    // 3. Insert templates with proper familyId and subgenreId references
    let templatesSeeded = 0;
    for (const tmpl of data.templates) {
      const familyId = familyMap[tmpl.familyName];
      const subgenreId = subgenreMap[tmpl.subgenreName];
      if (!familyId || !subgenreId) {
        console.warn(`  ⚠️ Skipping template "${tmpl.name}" - unknown family/subgenre`);
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
      console.log(`  ✅ Template: ${tmpl.name} [${tmpl.category}]`);
    }

    console.log('\n========================================');
    console.log(`✅ Seeded: ${Object.keys(familyMap).length} families, ${Object.keys(subgenreMap).length} subgenres, ${templatesSeeded} templates`);
    console.log('========================================');

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
