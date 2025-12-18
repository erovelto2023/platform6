"use server";

const PINTEREST_ACCESS_TOKEN = "pina_AMA667YXACXKEAQAGAAAOD3L2R3SHGYBACGSOUZV2HACFZEIIVJBFNU2SPNOIJVZGW5N3FMBXW3U2TF2L436LBUEK5JKFLYA";
const API_BASE_URL = "https://api-sandbox.pinterest.com/v5";

export async function searchPins(query: string) {
    try {
        // In Sandbox/Standard API, we can typically only fetch the authenticated user's pins.
        // We will fetch them and filter by the query manually if the API doesn't support search params for 'pins'.
        // The /pins endpoint supports 'bookmark' for pagination.

        const response = await fetch(`${API_BASE_URL}/pins`, {
            headers: {
                "Authorization": `Bearer ${PINTEREST_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 } // Cache for 60 seconds
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Pinterest API Error:", errorText);
            throw new Error(`Pinterest API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Map Pinterest API data to our UI format
        // Pinterest v5 Pin Object: { id, title, description, link, media: { images: { "400x300": { url } } }, board_id, ... }
        let pins = data.items.map((item: any) => ({
            id: item.id,
            title: item.title || item.description || "Untitled Pin",
            image: item.media?.images?.["600x"]?.url || item.media?.images?.["400x300"]?.url || "",
            saves: item.save_count || 0, // Note: save_count might not be available in all scopes/endpoints, defaulting to 0
            repins: 0, // Not standard in v5 public response
            comments: item.comment_count || 0,
            score: Math.floor(Math.random() * 20) + 80, // Mock score for now as we lack algorithm
            trend: "stable",
            link: item.link
        }));

        // Client-side filtering since /pins endpoint lists all user pins
        if (query) {
            const lowerQuery = query.toLowerCase();
            pins = pins.filter((pin: any) =>
                pin.title.toLowerCase().includes(lowerQuery) ||
                (pin.description && pin.description.toLowerCase().includes(lowerQuery))
            );
        }

        return pins;

    } catch (error) {
        console.error("Failed to fetch pins:", error);
        // Fallback to mock data if API fails (e.g. token expired or sandbox issues) so the UI doesn't break
        return [];
    }
}

export async function getBoards() {
    try {
        const response = await fetch(`${API_BASE_URL}/boards`, {
            headers: {
                "Authorization": `Bearer ${PINTEREST_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) throw new Error("Failed to fetch boards");
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error(error);
        return [];
    }
}
