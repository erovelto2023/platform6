import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import mongoose from 'mongoose';

// Load env vars
dotenv.config({ path: '.env.local' });

// We need to import the model and connect utility
// Using dynamic imports or relative paths depending on tsx behavior
import connectToDatabase from '../lib/db/connect';
import FAQ from '../lib/db/models/FAQ';
import { slugify, makeUniqueSlug } from '../lib/utils/slugify';

const CSV_PATH = path.join(process.cwd(), 'excel', '123-Baby-shower-game.csv');

async function importCSV() {
    try {
        console.log('Connecting to database...');
        await connectToDatabase();
        console.log('Connected.');

        if (!fs.existsSync(CSV_PATH)) {
            console.error(`CSV file not found at ${CSV_PATH}`);
            process.exit(1);
        }

        const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
        let records;
        try {
            records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true,
                relax_quotes: true,
                relax_column_count: true,
                bom: true,
            });
        } catch (e: any) {
            console.error('Parsing error details:', e);
            process.exit(1);
        }

        console.log(`Parsed ${records.length} records. Fetching existing slugs...`);
        
        const existingFAQs = await FAQ.find({}, { slug: 1 }).lean();
        const existingSlugs = existingFAQs.map((f: any) => f.slug).filter(Boolean);

        const preparedFAQs = [];

        for (const record of records as any[]) {
            const question = record['Question'];
            const parentQuestion = record['Parent Question'];
            const linkTitle = record['Link Title'];
            const linkUrl = record['Link'];
            const sourceText = record['Text'];

            if (!question) continue;

            const baseSlug = slugify(question);
            const slug = makeUniqueSlug(baseSlug, existingSlugs);
            existingSlugs.push(slug);

            // Mapping to the FAQ model
            preparedFAQs.push({
                question,
                slug,
                parentQuestion: parentQuestion !== '123 baby shower game' ? parentQuestion : '', // Assuming '123 baby shower game' is the root context
                linkTitle,
                linkUrl,
                sourceText,
                h1Title: question, // Defaulting to question
                answerSnippet: sourceText !== 'not-given' ? sourceText.substring(0, 300) : question,
                isPublished: true,
                deepDive: {
                    problem: '',
                    methodology: '',
                    application: sourceText !== 'not-given' ? sourceText : ''
                }
            });
        }

        console.log(`Prepared ${preparedFAQs.length} FAQs for insertion.`);

        // Insert in batches of 100 to avoid memory/timeout issues
        const batchSize = 100;
        for (let i = 0; i < preparedFAQs.length; i += batchSize) {
            const batch = preparedFAQs.slice(i, i + batchSize);
            await FAQ.insertMany(batch);
            console.log(`Imported batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(preparedFAQs.length / batchSize)}`);
        }

        console.log('Import completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Import failed:', error);
        process.exit(1);
    }
}

importCSV();
