'use server';

import { DEFAULT_LIBRARIES } from "../whiteboard-libraries";

export async function getLibraryItems() {
    try {
        const libraryPromises = DEFAULT_LIBRARIES.map(async (lib) => {
            try {
                const response = await fetch(lib.url, { next: { revalidate: 86400 } }); // Cache for 24 hours
                if (!response.ok) {
                    console.error(`Failed to fetch library ${lib.name}: ${response.statusText}`);
                    return null;
                }
                const data = await response.json();
                return data.libraryItems || [];
            } catch (err) {
                console.error(`Error fetching library ${lib.name}:`, err);
                return null;
            }
        });

        const results = await Promise.all(libraryPromises);

        // Flatten the array of arrays into a single array of items
        const allItems = results.flat().filter(item => item !== null);

        return allItems;
    } catch (error) {
        console.error("Error fetching whiteboard libraries:", error);
        return [];
    }
}
