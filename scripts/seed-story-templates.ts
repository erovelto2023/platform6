import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import dbConnect from '../lib/dbConnect';
import { TemplateFamily, TemplateSubgenre, StoryTemplate } from '../models';

async function seed() {
    await dbConnect();

    // 1. Create Plot Outlines Family & Subgenre
    let plotFam = await TemplateFamily.findOne({ name: 'Story & Plot Outlines' });
    if (!plotFam) {
        plotFam = await TemplateFamily.create({
            name: 'Story & Plot Outlines',
            description: 'System templates for story plots, three-act structures, and hero journeys.',
            isSystem: true
        });
        console.log('Created Plot Outlines Family');
    }

    let plotSub = await TemplateSubgenre.findOne({ name: 'Plot Frameworks', familyId: plotFam._id });
    if (!plotSub) {
        plotSub = await TemplateSubgenre.create({
            name: 'Plot Frameworks',
            description: 'Outlines and blueprints for chapter planning.',
            familyId: plotFam._id,
            isSystem: true
        });
        console.log('Created Plot Frameworks Subgenre');
    }

    // 2. Create Character Development Family & Subgenre
    let charFam = await TemplateFamily.findOne({ name: 'Character Development' });
    if (!charFam) {
        charFam = await TemplateFamily.create({
            name: 'Character Development',
            description: 'System worksheets for character profiles, arcs, and dialogue.',
            isSystem: true
        });
        console.log('Created Character Family');
    }

    let charSub = await TemplateSubgenre.findOne({ name: 'Character Worksheets', familyId: charFam._id });
    if (!charSub) {
        charSub = await TemplateSubgenre.create({
            name: 'Character Worksheets',
            description: 'Worksheets to build hero, villain, and side character profiles.',
            familyId: charFam._id,
            isSystem: true
        });
        console.log('Created Character Worksheets Subgenre');
    }

    // 3. Create Worldbuilding Family & Subgenre
    let worldFam = await TemplateFamily.findOne({ name: 'Worldbuilding & Setting' });
    if (!worldFam) {
        worldFam = await TemplateFamily.create({
            name: 'Worldbuilding & Setting',
            description: 'System guides for magic systems, fantasy worlds, and sci-fi tech.',
            isSystem: true
        });
        console.log('Created Worldbuilding Family');
    }

    let worldSub = await TemplateSubgenre.findOne({ name: 'Worldbuilding Guides', familyId: worldFam._id });
    if (!worldSub) {
        worldSub = await TemplateSubgenre.create({
            name: 'Worldbuilding Guides',
            description: 'Guides for magic systems, lore, and setting detail.',
            familyId: worldFam._id,
            isSystem: true
        });
        console.log('Created Worldbuilding Guides Subgenre');
    }

    // Link existing 3 system templates to these subgenres
    await StoryTemplate.updateOne(
        { name: "Hero's Journey Outline" },
        { familyId: plotFam._id, subgenreId: plotSub._id, isSystem: true }
    );

    await StoryTemplate.updateOne(
        { name: 'Character Profile Worksheet' },
        { familyId: charFam._id, subgenreId: charSub._id, isSystem: true }
    );

    await StoryTemplate.updateOne(
        { name: 'Worldbuilding: Magic System' },
        { familyId: worldFam._id, subgenreId: worldSub._id, isSystem: true }
    );

    console.log('✅ Successfully seeded system template folders and linked templates!');
    process.exit(0);
}

seed();
