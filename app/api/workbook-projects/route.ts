import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import WorkbookProject from "@/models/workbook-project";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const projects = await WorkbookProject.find({ userId })
            .select("_id name width height currentPageIndex pages thumbnail createdAt updatedAt")
            .sort({ updatedAt: -1 })
            .lean();

        // Add page count to each project
        const projectsWithCount = projects.map(project => ({
            ...project,
            pageCount: project.pages?.length || 0,
        }));

        return NextResponse.json({ projects: projectsWithCount });
    } catch (error) {
        console.error("Error fetching workbook projects:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            width,
            height,
            currentPageIndex,
            marginsEnabled,
            bleedEnabled,
            pages,
            thumbnail,
        } = body;

        await connectDB();

        const project = await WorkbookProject.create({
            userId,
            name: name || "Untitled Project",
            width: width || 816,
            height: height || 1056,
            currentPageIndex: currentPageIndex || 0,
            marginsEnabled: marginsEnabled ?? true,
            bleedEnabled: bleedEnabled ?? false,
            pages: pages || [],
            thumbnail,
        });

        return NextResponse.json({
            success: true,
            project: {
                _id: project._id,
                name: project.name,
                pageCount: project.pages?.length || 0,
                updatedAt: project.updatedAt,
            },
        });
    } catch (error) {
        console.error("Error creating workbook project:", error);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );
    }
}
