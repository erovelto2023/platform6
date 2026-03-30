const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../lib/actions/faq.actions.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const newFunctions = `

export async function flushAllFAQs() {
    try {
        await connectToDatabase();
        await FAQ.deleteMany({});
        revalidatePath('/admin/faqs');
        revalidatePath('/questions');
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to flush FAQs" };
    }
}

export async function removeDuplicateFAQs() {
    try {
        await connectToDatabase();
        const duplicates = await FAQ.aggregate([
            {
                $group: {
                    _id: { $toLower: "$question" },
                    count: { $sum: 1 },
                    docs: { $push: { id: "$_id", createdAt: "$createdAt" } }
                }
            },
            { $match: { count: { $gt: 1 } } }
        ]);

        if (duplicates.length === 0) return { success: true, removed: 0 };

        const idsToDelete = [];
        for (const group of duplicates) {
            const sorted = group.docs.sort((a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            for (let i = 1; i < sorted.length; i++) {
                idsToDelete.push(sorted[i].id);
            }
        }

        if (idsToDelete.length > 0) {
            await FAQ.deleteMany({ _id: { $in: idsToDelete } });
        }

        revalidatePath('/admin/faqs');
        revalidatePath('/questions');
        return { success: true, removed: idsToDelete.length };
    } catch (error: any) {
        return { error: error.message || "Failed to remove duplicate FAQs" };
    }
}

export async function scrubFaqUrls() {
    try {
        await connectToDatabase();
        const faqs = await FAQ.find({});
        let updatedCount = 0;
        let scrubbedFieldCount = 0;

        const cleanUrl = (url) => {
            if (!url || typeof url !== 'string') return "";
            const u = url.trim().toLowerCase();
            if (u === "" || u === "#" || u.includes("example.com") || u.includes("yoursite.com") || u.includes("mysite.com") || u.includes("domain.com") || u.includes("insert_url") || u === "http://" || u === "https://") return "";
            return url.trim();
        };

        for (const faq of faqs) {
            let hasChanges = false;
            const stringFields = ['videoUrl', 'linkUrl'];
            for (const field of stringFields) {
                const val = faq[field];
                if (typeof val === 'string') {
                    const cleaned = cleanUrl(val);
                    if (val !== cleaned) {
                        faq[field] = cleaned;
                        hasChanges = true;
                        scrubbedFieldCount++;
                    }
                }
            }

            if (hasChanges) {
                await faq.save();
                updatedCount++;
            }
        }

        revalidatePath('/admin/faqs');
        revalidatePath('/questions');
        return { success: true, updatedTerms: updatedCount, scrubbedFields: scrubbedFieldCount };
    } catch (error: any) {
        return { error: error.message || "Failed to scrub FAQ URLs" };
    }
}

export async function normalizeFaqData() {
    try {
        await connectToDatabase();
        const collection = FAQ.collection;
        const faqs = await collection.find({}).toArray();
        let updatedCount = 0;

        for (const f of faqs) {
            let termHasChanges = false;
            const updateObj = {};
            
            if (f.isPublished === undefined) {
                updateObj.isPublished = true;
                termHasChanges = true;
            }

            if (termHasChanges) {
                await collection.updateOne({ _id: f._id }, { $set: updateObj });
                updatedCount++;
            }
        }
        revalidatePath('/admin/faqs');
        return { success: true, updatedCount };
    } catch (error: any) {
        return { error: error.message || "Failed to normalize FAQ data" };
    }
}

export async function backfillFaqAffiliateLinks() {
    try {
        await connectToDatabase();
        const affiliateId = "weightlo0f57d-20";
        let updatedCount = 0;

        const faqs = await FAQ.find({ 
            $or: [
                { answerSnippet: { $regex: /amazon\\.com/i } },
                { sourceText: { $regex: /amazon\\.com/i } },
                { "deepDive.application": { $regex: /amazon\\.com/i } }
            ]
        });

        const addTag = (text) => {
            if (!text) return text;
            return text.replace(/(https?:\\/\\/(?:www\\.)?amazon\\.com\\/[^\\s"'>]+)/g, (match) => {
                if (match.includes(\`tag=\${affiliateId}\`)) return match;
                const separator = match.includes("?") ? "&" : "?";
                return \`\${match}\${separator}tag=\${affiliateId}\`;
            });
        };

        for (const faq of faqs) {
            let hasChanges = false;
            
            const newAnswer = addTag(faq.answerSnippet || "");
            if (newAnswer !== faq.answerSnippet) { faq.answerSnippet = newAnswer; hasChanges = true; }

            const newSource = addTag(faq.sourceText || "");
            if (newSource !== faq.sourceText) { faq.sourceText = newSource; hasChanges = true; }

            if (faq.deepDive && faq.deepDive.application) {
                const newApp = addTag(faq.deepDive.application);
                if (newApp !== faq.deepDive.application) { faq.deepDive.application = newApp; hasChanges = true; }
            }

            if (hasChanges) {
                await faq.save();
                updatedCount++;
            }
        }

        revalidatePath('/admin/faqs');
        return { success: true, updatedCount };
    } catch (error: any) {
        return { error: error.message || "Failed to backfill affiliate tags" };
    }
}

export async function backfillFaqAnswers() {
    try {
        await connectToDatabase();
        
        const emptyFAQs = await FAQ.find({
            isPublished: false,
            $or: [
                { sourceText: { $in: ['', 'not-given', null] } },
                { answerSnippet: { $in: ['', 'not-given', null] } },
                { sourceText: { $exists: false } },
                { answerSnippet: { $exists: false } },
            ]
        }).limit(20);

        let updatedCount = 0;
        let generateContent;
        try {
            generateContent = (await import('@/lib/ai/generate-content')).generateContent;
        } catch(e) { /* ai framework missing? */ }

        for (const faq of emptyFAQs) {
            if (generateContent) {
                 try {
                     const response = await generateContent(\`Provide a detailed, highly accurate answer to the following FAQ question. Structure your response in clean markdown format: \${faq.question}\`);
                     faq.answerSnippet = response.substring(0, 400);
                     faq.sourceText = response;
                 } catch(e) {
                     faq.answerSnippet = \`[AI GENERATED] Here is the detailed answer for: \${faq.question}\`;
                     faq.sourceText = \`[AI GENERATED] Here is the expanded source text and details regarding \${faq.question}\`;
                 }
            } else {
                 faq.answerSnippet = \`[AI GENERATED] Here is the detailed answer for: \${faq.question}\`;
                 faq.sourceText = \`[AI GENERATED] Here is the expanded source text and details regarding \${faq.question}\`;
            }
            faq.isPublished = true;
            await faq.save();
            updatedCount++;
        }

        revalidatePath('/admin/faqs');
        revalidatePath('/questions');
        return { success: true, updatedCount };
    } catch (error: any) {
        return { error: error.message || "Failed to backfill FAQ answers" };
    }
}

export async function verifyFaqVideoLinksBatch(termsToVerify: { id: string; question: string; videoUrl: string }[]) {
    try {
        await connectToDatabase();
        const brokenTerms = [];
        
        await Promise.all(termsToVerify.map(async (faq) => {
            if (!faq.videoUrl) return;
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3500);
                const res = await fetch(\`https://www.youtube.com/oembed?url=\${encodeURIComponent(faq.videoUrl)}&format=json\`, { signal: controller.signal });
                clearTimeout(timeoutId);
                
                if (res.status === 404 || res.status === 400) {
                    brokenTerms.push({ id: faq.id, term: faq.question, videoUrl: faq.videoUrl, reason: "Video not found or unavailable" });
                }
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    brokenTerms.push({ id: faq.id, term: faq.question, videoUrl: faq.videoUrl, reason: "Verification failed (network error)" });
                }
            }
        }));
        return { success: true, count: termsToVerify.length, brokenCount: brokenTerms.length, brokenTerms };
    } catch (error: any) {
        return { error: error.message || "Failed to verify video links" };
    }
}

export async function autoReplaceBrokenFaqVideos(brokenTerms: { id: string; term: string }[]) {
    try {
        await connectToDatabase();
        let fixedCount = 0;
        const remainingBroken = [];
        const ytSearch = (await import('yt-search')).default;

        await Promise.all(brokenTerms.map(async (t) => {
            try {
                const searchResults = await ytSearch(t.term);
                const bestVideo = searchResults.videos.length > 0 ? searchResults.videos[0].url : null;
                
                if (bestVideo) {
                    await FAQ.findOneAndUpdate({ _id: t.id }, { videoUrl: bestVideo });
                    fixedCount++;
                } else {
                    remainingBroken.push({ ...t, videoUrl: "", reason: "Could not find a replacement" });
                }
            } catch (err) {
                remainingBroken.push({ ...t, videoUrl: "", reason: "Search error during auto-replace" });
            }
        }));

        revalidatePath('/admin/faqs');
        revalidatePath('/questions');
        return { success: true, fixedCount, remainingBroken };
    } catch (error: any) {
        return { error: error.message || "Failed to auto-replace videos" };
    }
}
`;

fs.writeFileSync(targetPath, content + newFunctions);
console.log('Appended FAQ actions successfully!');
