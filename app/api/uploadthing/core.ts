import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

const handleAuth = async () => {
    const { userId } = await auth();
    console.log("UploadThing handleAuth userId:", userId);
    if (!userId) throw new Error("Unauthorized");
    return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    courseAttachment: f({
        text: { maxFileSize: "4MB" },
        image: { maxFileSize: "4MB" },
        video: { maxFileSize: "512MB" },
        audio: { maxFileSize: "32MB" },
        pdf: { maxFileSize: "64MB" },
        blob: { maxFileSize: "256MB" }
    })
        .middleware(handleAuth)
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);
            return { uploadedBy: metadata.userId };
        }),

    lessonFile: f({ blob: { maxFileSize: "256MB", maxFileCount: 1 } })
        .middleware(handleAuth)
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Lesson file uploaded:", file.url);
            return { uploadedBy: metadata.userId };
        }),

    nicheDownload: f({ blob: { maxFileSize: "32MB" } })
        .middleware(handleAuth)
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Niche download uploaded by:", metadata.userId);
            return { uploadedBy: metadata.userId };
        }),

    courseThumbnail: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(handleAuth)
        .onUploadComplete(async ({ metadata, file }) => {
            return { uploadedBy: metadata.userId };
        }),

    communityPostImage: f({ image: { maxFileSize: "8MB", maxFileCount: 4 } })
        .middleware(handleAuth)
        .onUploadComplete(async ({ metadata, file }) => {
            return { uploadedBy: metadata.userId };
        }),

    communityCoverImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
        .middleware(handleAuth)
        .onUploadComplete(async ({ metadata, file }) => {
            return { uploadedBy: metadata.userId };
        }),

    communityAvatar: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(handleAuth)
        .onUploadComplete(async ({ metadata, file }) => {
            return { uploadedBy: metadata.userId };
        }),

    pageBuilderImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(handleAuth)
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Page builder image uploaded:", file.url);
            return { uploadedBy: metadata.userId, url: file.url };
        }),

    pageBuilderMultipleImages: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
        .middleware(handleAuth)
        .onUploadComplete(async ({ metadata, file }) => {
            return { uploadedBy: metadata.userId, url: file.url };
        }),

    messageAttachment: f({
        image: { maxFileSize: "8MB", maxFileCount: 4 },
        pdf: { maxFileSize: "16MB", maxFileCount: 2 },
        blob: { maxFileSize: "32MB", maxFileCount: 1 }
    })
        .middleware(handleAuth)
        .onUploadComplete(async ({ metadata, file }) => {
            return { uploadedBy: metadata.userId, url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
