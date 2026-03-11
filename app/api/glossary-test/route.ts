import { NextResponse } from 'next/server';
import { getGlossaryTerms } from '@/lib/actions/glossary.actions';

export async function GET() {
    try {
        console.log('=== API TEST ENDPOINT CALLED ===');
        
        const result = await getGlossaryTerms({ limit: 10 });
        console.log('API Test - Raw database result:', result);
        
        const response = {
            success: true,
            terms: result?.terms || [],
            count: result?.terms?.length || 0,
            timestamp: new Date().toISOString()
        };
        
        console.log('API Test - Returning response:', response);
        
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
