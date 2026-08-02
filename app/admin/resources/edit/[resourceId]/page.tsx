import { redirect } from "next/navigation";

export default async function ResourceEditAliasPage({ params }: { params: Promise<{ resourceId: string }> }) {
    const resolvedParams = await params;
    redirect(`/admin/resources/${resolvedParams.resourceId}`);
}
