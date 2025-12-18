import axios from 'axios';

const OPENVERSE_API_URL = 'https://api.openverse.org/v1';
let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

export async function getOpenverseToken() {
    if (accessToken && Date.now() < tokenExpiresAt) {
        return accessToken;
    }

    const clientId = process.env.OPENVERSE_CLIENT_ID;
    const clientSecret = process.env.OPENVERSE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.warn("Openverse credentials not found in environment variables.");
        return null;
    }

    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);

        const response = await axios.post(`${OPENVERSE_API_URL}/auth_tokens/token/`, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        console.log("Openverse token obtained successfully.");

        accessToken = response.data.access_token;
        tokenExpiresAt = Date.now() + (response.data.expires_in * 1000) - 60000; // Buffer 1 min

        return accessToken;
    } catch (error) {
        console.error("Failed to authenticate with Openverse:", error);
        return null;
    }
}

export async function searchOpenverseImages(query: string, page: number = 1, pageSize: number = 100) {
    let token = await getOpenverseToken();

    if (!token) {
        throw new Error("Openverse authentication failed or credentials missing.");
    }

    try {
        const response = await axios.get(`${OPENVERSE_API_URL}/images/`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                q: query,
                page,
                page_size: pageSize
            }
        });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            console.log("Openverse 401. Retrying with new token...");
            accessToken = null;
            token = await getOpenverseToken();
            if (!token) throw new Error("Openverse re-authentication failed.");

            const response = await axios.get(`${OPENVERSE_API_URL}/images/`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    q: query,
                    page,
                    page_size: pageSize
                }
            });
            return response.data;
        }
        throw error;
    }
}
