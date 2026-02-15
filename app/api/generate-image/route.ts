import { NextResponse } from 'next/server';
import Replicate from "replicate";

export async function POST(req: Request) {
    const userToken = req.headers.get("X-Replicate-Token");

    // STRICT BYOK: Only use the token provided by the user
    // If you want to fall back to the env var, use: const token = userToken || process.env.REPLICATE_API_TOKEN;
    const token = userToken;

    if (!token) {
        return NextResponse.json({ error: "Replicate API token is required. Please set it in Settings." }, { status: 401 });
    }

    const replicate = new Replicate({
        auth: token,
    });

    try {
        const { prompt, model = 'black-forest-labs/flux-schnell' } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const input = {
            prompt: prompt,
            num_inference_steps: 4,
            guidance: 3.5,
            output_format: "png"
        };

        const output = await replicate.run(model, { input });

        let imageUrl = "";
        if (Array.isArray(output)) {
            // @ts-ignore
            imageUrl = output[0].toString();
        } else {
            // @ts-ignore
            imageUrl = output.toString();
        }

        return NextResponse.json({ success: true, imageUrl });

    } catch (error: any) {
        console.error("Image Generation Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate image" }, { status: 500 });
    }
}
