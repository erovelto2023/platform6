import { NextResponse } from 'next/server';
import { getGlossaryTerms } from '@/lib/actions/glossary.actions';

export async function GET() {
    try {
        const result = await getGlossaryTerms();
        
        const response = {
            success: true,
            terms: result?.terms || [],
            count: result?.terms?.length || 0,
            timestamp: new Date().toISOString()
        };
        
        return NextResponse.json(response);
        
    } catch (error) {
        console.error('API Test - Error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: (error as Error).message,
                timestamp: new Date().toISOString()
            }, 
            { status: 500 }
        );
    }
}
