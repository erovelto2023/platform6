import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import dbConnect from '../lib/dbConnect';
import { StoryTemplate, TemplateFamily, TemplateSubgenre } from '../models';

async function main() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB.");

    const families = await TemplateFamily.find().lean();
    const subgenres = await TemplateSubgenre.find().lean();
    const templates = await StoryTemplate.find().lean();

    console.log(`\n=== FAMILIES (${families.length}) ===`);
    console.log(JSON.stringify(families, null, 2));

    console.log(`\n=== SUBGENRES (${subgenres.length}) ===`);
    console.log(JSON.stringify(subgenres, null, 2));

    console.log(`\n=== TEMPLATES (${templates.length}) ===`);
    console.log(JSON.stringify(templates, null, 2));

  } catch (error: any) {
    console.error("Error printing templates:", error);
  }
  process.exit(0);
}

main();
