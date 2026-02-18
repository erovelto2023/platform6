"use server";

import connectToDatabase from "@/lib/db/connect";
import VideoProject from "@/lib/db/models/VideoProject";
import { revalidatePath } from "next/cache";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import axios from "axios";

export async function getVideoProjects(userId: string) {
    try {
        await connectToDatabase();
        const projects = await VideoProject.find({ userId }).sort({ updatedAt: -1 });
        return { success: true, data: JSON.parse(JSON.stringify(projects)) };
    } catch (error) {
        console.error("[GET_VIDEO_PROJECTS]", error);
        return { success: false, error: "Failed to fetch projects" };
    }
}

export async function getVideoProjectById(id: string) {
    try {
        await connectToDatabase();
        const project = await VideoProject.findById(id);
        if (!project) return { success: false, error: "Project not found" };
        return { success: true, data: JSON.parse(JSON.stringify(project)) };
    } catch (error) {
        console.error("[GET_VIDEO_PROJECT_BY_ID]", error);
        return { success: false, error: "Failed to fetch project" };
    }
}

export async function createVideoProject(userId: string, title: string = "Untitled Project") {
    try {
        await connectToDatabase();
        const project = await VideoProject.create({
            userId,
            title,
            clips: [],
            status: 'draft'
        });
        revalidatePath("/video-suite");
        return { success: true, data: JSON.parse(JSON.stringify(project)) };
    } catch (error) {
        console.error("[CREATE_VIDEO_PROJECT]", error);
        return { success: false, error: "Failed to create project" };
    }
}

export async function updateVideoProject(id: string, data: any) {
    try {
        await connectToDatabase();
        const project = await VideoProject.findByIdAndUpdate(id, data, { new: true });
        if (!project) return { success: false, error: "Project not found" };
        revalidatePath(`/video-suite/${id}`);
        return { success: true, data: JSON.parse(JSON.stringify(project)) };
    } catch (error) {
        console.error("[UPDATE_VIDEO_PROJECT]", error);
        return { success: false, error: "Failed to update project" };
    }
}

export async function deleteVideoProject(id: string) {
    try {
        await connectToDatabase();
        await VideoProject.findByIdAndDelete(id);
        revalidatePath("/video-suite");
        return { success: true };
    } catch (error) {
        console.error("[DELETE_VIDEO_PROJECT]", error);
        return { success: false, error: "Failed to delete project" };
    }
}

export async function renderVideoProject(projectId: string) {
    try {
        await connectToDatabase();
        const project = await VideoProject.findById(projectId);
        if (!project) return { success: false, error: "Project not found" };

        if (!project.clips || project.clips.length === 0) {
            return { success: false, error: "No clips to render" };
        }

        // 1. Update status
        await VideoProject.findByIdAndUpdate(projectId, {
            status: 'rendering',
            renderError: null
        });

        const tempDir = path.join(process.cwd(), "temp_renders", projectId);
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        // 2. Download clips locally if they are URLs
        // Note: fluent-ffmpeg can work with some URLs but local is more stable
        const localClips: string[] = [];
        for (let i = 0; i < project.clips.length; i++) {
            const clip = project.clips[i];
            const localPath = path.join(tempDir, `clip_${i}.mp4`);

            // Simple download (axios is already in package.json)
            const response = await axios({
                url: clip.url,
                method: 'GET',
                responseType: 'stream'
            });

            const writer = fs.createWriteStream(localPath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', () => resolve(null));
                writer.on('error', (err) => reject(err));
            });
            localClips.push(localPath);
        }

        // 3. Start FFmpeg concatenation
        const outputPath = path.join(tempDir, "output.mp4");
        const command = ffmpeg();

        localClips.forEach(clipPath => {
            command.input(clipPath);
        });

        return new Promise((resolve) => {
            command
                .on('error', async (err) => {
                    console.error('FFmpeg error:', err);
                    await VideoProject.findByIdAndUpdate(projectId, {
                        status: 'failed',
                        renderError: err.message
                    });
                    resolve({ success: false, error: "FFmpeg render failed. Is FFmpeg installed on your VPS?" });
                })
                .on('end', async () => {
                    console.log('Rendering finished!');
                    // In a real app, we'd upload this back to UploadThing/S3
                    // For now, we'll store the local path or move to public
                    const publicDir = path.join(process.cwd(), "public", "renders");
                    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

                    const finalPublicPath = path.join(publicDir, `${projectId}.mp4`);
                    fs.renameSync(outputPath, finalPublicPath);

                    await VideoProject.findByIdAndUpdate(projectId, {
                        status: 'completed',
                        exportUrl: `/renders/${projectId}.mp4`,
                        lastRenderedAt: new Date()
                    });

                    revalidatePath(`/video-suite/${projectId}`);
                    resolve({ success: true, data: { url: `/renders/${projectId}.mp4` } });
                })
                .mergeToFile(outputPath, tempDir);
        });

    } catch (error: any) {
        console.error("[RENDER_VIDEO_PROJECT]", error);
        await VideoProject.findByIdAndUpdate(projectId, {
            status: 'failed',
            renderError: error.message
        });
        return { success: false, error: error.message };
    }
}
