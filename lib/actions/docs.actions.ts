"use server";

import connectDB from "@/lib/db/connect";
import DocShelf from "@/lib/db/models/DocShelf";
import DocBook from "@/lib/db/models/DocBook";
import DocChapter from "@/lib/db/models/DocChapter";
import DocPage from "@/lib/db/models/DocPage";
import { revalidatePath } from "next/cache";

// --- SHELVES ---

export async function getShelves() {
    await connectDB();
    const shelves = await DocShelf.find({}).sort({ title: 1 }).lean();
    return JSON.parse(JSON.stringify(shelves));
}

export async function getShelf(shelfId: string) {
    await connectDB();
    const shelf = await DocShelf.findById(shelfId).lean();
    return JSON.parse(JSON.stringify(shelf));
}

export async function getShelfBySlug(slug: string) {
    await connectDB();
    const shelf = await DocShelf.findOne({ slug }).lean();
    return JSON.parse(JSON.stringify(shelf));
}

export async function createShelf(data: any) {
    await connectDB();
    const shelf = await DocShelf.create(data);
    revalidatePath('/docs');
    revalidatePath('/admin/docs');
    return JSON.parse(JSON.stringify(shelf));
}

// --- BOOKS ---

export async function getBooks(shelfId?: string) {
    await connectDB();

    // Validate shelfId is a valid MongoDB ObjectId if provided
    if (shelfId && !shelfId.match(/^[0-9a-fA-F]{24}$/)) {
        return [];
    }

    const query = shelfId ? { shelfId } : {};
    const books = await DocBook.find(query).populate('shelfId').sort({ title: 1 }).lean();
    return JSON.parse(JSON.stringify(books));
}

export async function createBook(data: any) {
    await connectDB();
    const book = await DocBook.create(data);
    revalidatePath('/docs');
    revalidatePath('/admin/docs');
    return JSON.parse(JSON.stringify(book));
}

export async function getBookStructure(bookId: string) {
    // Return Book + Chapters (with Pages) + Direct Pages
    await connectDB();
    const book = await DocBook.findById(bookId).lean();
    if (!book) return null;

    const chapters = await DocChapter.find({ bookId }).sort({ order: 1 }).lean();
    const pages = await DocPage.find({ bookId }).sort({ order: 1 }).lean();

    // Map pages to chapters or root
    const structure = {
        ...book,
        chapters: chapters.map((c: any) => ({
            ...c,
            pages: pages.filter((p: any) => p.chapterId?.toString() === c._id.toString())
        })),
        directPages: pages.filter((p: any) => !p.chapterId)
    };

    return JSON.parse(JSON.stringify(structure));
}

export async function getBookStructureBySlug(slug: string) {
    await connectDB();
    const book = await DocBook.findOne({ slug }).lean();
    if (!book) return null;

    const chapters = await DocChapter.find({ bookId: book._id }).sort({ order: 1 }).lean();
    const pages = await DocPage.find({ bookId: book._id }).sort({ order: 1 }).lean();

    const structure = {
        ...book,
        chapters: chapters.map((c: any) => ({
            ...c,
            pages: pages.filter((p: any) => p.chapterId?.toString() === c._id.toString())
        })),
        directPages: pages.filter((p: any) => !p.chapterId)
    };

    return JSON.parse(JSON.stringify(structure));
}

// --- CHAPTERS ---

export async function createChapter(data: any) {
    await connectDB();
    const chapter = await DocChapter.create(data);
    revalidatePath(`/docs/book/${data.bookId}`);
    return JSON.parse(JSON.stringify(chapter));
}

// --- PAGES ---

export async function createPage(data: any) {
    await connectDB();
    const page = await DocPage.create(data);
    revalidatePath('/docs');
    return JSON.parse(JSON.stringify(page));
}

export async function getPage(pageId: string) {
    await connectDB();
    const page = await DocPage.findById(pageId).populate('bookId').lean();
    return JSON.parse(JSON.stringify(page));
}

export async function getPageBySlug(bookId: string, slug: string) {
    await connectDB();
    const page = await DocPage.findOne({ bookId, slug }).populate('bookId').lean();
    return JSON.parse(JSON.stringify(page));
}

export async function updatePageContent(pageId: string, content: string) {
    await connectDB();
    const page = await DocPage.findByIdAndUpdate(pageId, { content }, { new: true });
    return JSON.parse(JSON.stringify(page));
}

// --- DELETE FUNCTIONS ---

export async function deleteShelf(shelfId: string) {
    "use server";
    await connectDB();

    // Delete all books in this shelf (and their chapters/pages)
    const books = await DocBook.find({ shelfId });
    for (const book of books) {
        await deleteBook(book._id.toString());
    }

    // Delete the shelf
    await DocShelf.findByIdAndDelete(shelfId);
    revalidatePath('/docs');
    revalidatePath('/admin/docs');
}

export async function deleteBook(bookId: string) {
    "use server";
    await connectDB();

    // Delete all chapters in this book
    const chapters = await DocChapter.find({ bookId });
    for (const chapter of chapters) {
        await deleteChapter(chapter._id.toString());
    }

    // Delete all pages in this book
    await DocPage.deleteMany({ bookId });

    // Delete the book
    await DocBook.findByIdAndDelete(bookId);
    revalidatePath('/docs');
    revalidatePath('/admin/docs');
}

export async function deleteChapter(chapterId: string) {
    "use server";
    await connectDB();

    // Get chapter to find bookId for revalidation
    const chapter = await DocChapter.findById(chapterId);
    if (!chapter) return;

    // Delete all pages in this chapter
    await DocPage.deleteMany({ chapterId });

    // Delete the chapter
    await DocChapter.findByIdAndDelete(chapterId);
    revalidatePath(`/docs/book/${chapter.bookId}`);
    revalidatePath('/admin/docs');
}

export async function deletePage(pageId: string) {
    "use server";
    await connectDB();

    // Get page to find bookId for revalidation
    const page = await DocPage.findById(pageId);
    if (!page) return;

    // Delete the page
    await DocPage.findByIdAndDelete(pageId);
    revalidatePath(`/docs/book/${page.bookId}`);
    revalidatePath('/admin/docs');
}
