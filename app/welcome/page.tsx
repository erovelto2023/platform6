import { redirect } from "next/navigation";

interface WelcomePageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function WelcomeAliasPage({ searchParams }: WelcomePageProps) {
    const params = await searchParams;
    const query = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
        if (value) query.set(key, value);
    });

    const queryString = query.toString();
    redirect(`/thank-you${queryString ? `?${queryString}` : ''}`);
}
