"use server";

import { AccessToken } from "livekit-server-sdk";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;
const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.LIVEKIT_URL;

export async function createHuddleToken(
    userId: string,
    room: string
) {
    try {
        if (!apiKey || !apiSecret || !wsUrl) {
            return {
                success: false,
                error: "LiveKit configuration missing. Please add LIVEKIT_API_KEY, LIVEKIT_API_SECRET, and NEXT_PUBLIC_LIVEKIT_URL to .env.local"
            };
        }

        await connectToDatabase();
        const user = await User.findById(userId);

        if (!user) {
            return { success: false, error: "User not found" };
        }

        const participantName = `${user.firstName} ${user.lastName}`;

        // Create access token
        const at = new AccessToken(apiKey, apiSecret, {
            identity: userId,
            name: participantName,
        });

        at.addGrant({
            roomJoin: true,
            room: room,
            canPublish: true,
            canSubscribe: true,
        });

        const token = await at.toJwt();

        return {
            success: true,
            data: {
                token,
                wsUrl,
                room
            }
        };
    } catch (error) {
        console.error("[HUDDLE_TOKEN]", error);
        return {
            success: false,
            error: "Failed to generate token"
        };
    }
}
