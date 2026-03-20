import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
    const path = request.nextUrl.searchParams.get('path') || '/locations';
    
    try {
        revalidatePath(path, 'page');
        revalidatePath(path, 'layout');
        return NextResponse.json({ revalidated: true, path, now: Date.now() });
    } catch (err) {
        return NextResponse.json({ revalidated: false, error: (err as Error).message });
    }
}
