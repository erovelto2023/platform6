export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
}

export function makeUniqueSlug(slug: string, existingSlugs: string[]): string {
    if (!existingSlugs.includes(slug)) return slug;

    let counter = 1;
    let newSlug = `${slug}-${counter}`;
    while (existingSlugs.includes(newSlug)) {
        counter++;
        newSlug = `${slug}-${counter}`;
    }
    return newSlug;
}
