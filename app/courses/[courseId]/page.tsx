import { redirect } from "next/navigation";

interface LegacyCoursePageProps {
    params: Promise<{ courseId: string }>;
    searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function LegacyCoursePage({ params, searchParams }: LegacyCoursePageProps) {
    const { courseId } = await params;
    const sParams = await searchParams;

    const query = new URLSearchParams();
    Object.entries(sParams).forEach(([k, v]) => {
        if (v) query.set(k, v);
    });

    const qString = query.toString();
    return redirect(`/catalog/${courseId}${qString ? `?${qString}` : ''}`);
}
