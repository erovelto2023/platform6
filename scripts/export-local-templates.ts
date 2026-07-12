/**
 * Export ALL Story Hacker templates from the LOCAL MongoDB database
 * and save them as the definitive story-hacker-templates.json
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import dbConnect from '../lib/dbConnect';
import { StoryTemplate, TemplateFamily, TemplateSubgenre } from '../models';
import fs from 'fs';
import path from 'path';

async function main() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB.');

    // Get ALL families
    const families = await TemplateFamily.find().lean();
    console.log(`Found ${families.length} families`);

    // Get ALL subgenres
    const subgenres = await TemplateSubgenre.find().lean();
    console.log(`Found ${subgenres.length} subgenres`);

    // Get ALL templates
    const templates = await StoryTemplate.find().lean();
    console.log(`Found ${templates.length} templates`);

    // Build ID maps
    const familyMap: Record<string, string> = {};
    families.forEach((f: any) => {
      familyMap[f._id.toString()] = f.name;
    });

    const subgenreMap: Record<string, string> = {};
    subgenres.forEach((s: any) => {
      subgenreMap[s._id.toString()] = s.name;
    });

    // Build the output JSON
    const output = {
      families: families.map((f: any) => ({
        name: f.name,
        description: f.description || '',
        isSystem: true
      })),
      subgenres: subgenres.map((s: any) => ({
        name: s.name,
        description: s.description || '',
        familyName: familyMap[s.familyId?.toString()] || 'Unknown',
        isSystem: true
      })),
      templates: templates.map((t: any) => ({
        name: t.name,
        description: t.description || '',
        category: t.category || '',
        content: t.content || '',
        familyName: familyMap[t.familyId?.toString()] || 'Unknown',
        subgenreName: subgenreMap[t.subgenreId?.toString()] || 'Unknown',
        isSystem: true
      }))
    };

    console.log(`\nExported from local database:`);
    console.log(`  Families:  ${output.families.length}`);
    console.log(`  Subgenres: ${output.subgenres.length}`);
    console.log(`  Templates: ${output.templates.length}`);

    // Print families
    console.log(`\nFamilies:`);
    output.families.forEach((f: any) => console.log(`  - ${f.name}`));

    // Print subgenres
    console.log(`\nSubgenres:`);
    output.subgenres.forEach((s: any) => console.log(`  - ${s.name} (${s.familyName})`));

    // Print templates
    console.log(`\nTemplates:`);
    output.templates.forEach((t: any) => console.log(`  - ${t.name} [${t.category}] (${t.subgenreName})`));

    // Save to file
    const outPath = path.join(__dirname, 'story-hacker-templates.json');
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
    console.log(`\n✅ Saved to ${outPath}`);
    console.log(`   File size: ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
