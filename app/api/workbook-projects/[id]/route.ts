import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import WorkbookProject from "@/models/workbook-project";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await connectDB();

        const project = await WorkbookProject.findOne({
            _id: id,
            userId,
        }).lean();

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ project });
    } catch (error) {
        console.error("Error fetching workbook project:", error);
        return NextResponse.json(
            { error: "Failed to fetch project" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;

        const project = await WorkbookProject.findOneAndUpdate(
            { _id: id, userId },
            {
                name,
                width,
                height,
                currentPageIndex,
                marginsEnabled,
                bleedEnabled,
                pages,
                thumbnail,
            },
            { new: true, runValidators: true }
        );

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

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
        console.error("Error updating workbook project:", error);
        return NextResponse.json(
            { error: "Failed to update project" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { id } = await params;

        const project = await WorkbookProject.findOneAndDelete({
            _id: id,
            userId,
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting workbook project:", error);
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
}
