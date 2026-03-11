import { getGlossaryTerms } from "@/lib/actions/glossary.actions";

export default async function DebugPage() {
    console.log("=== GLOSSARY DEBUG START ===");
    
    try {
        // Test database connection
        const result = await getGlossaryTerms({ limit: 10 });
        console.log("Raw result from database:", result);
        console.log("Number of terms:", result?.terms?.length || 0);
        
        if (result?.terms && result.terms.length > 0) {
            console.log("First 3 terms:");
            result.terms.slice(0, 3).forEach((term: any, index: number) => {
                console.log(`${index + 1}. Term: ${term.term}, Category: ${term.category}, Slug: ${term.slug}`);
            });
        } else {
            console.log("No terms found in database");
        }
        
        return (
            <div style={{ padding: '20px', fontFamily: 'monospace' }}>
                <h1>Glossary Debug Page</h1>
                <p>Check browser console for debug information</p>
                
                <div style={{ background: '#f5f5f5', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
                    <h3>Database Query Result:</h3>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
                
                <div style={{ background: '#e8f5e8', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
                    <h3>Environment Variables:</h3>
                    <pre>MONGODB_URI: {process.env.MONGODB_URI ? 'SET' : 'NOT SET'}</pre>
                </div>
            </div>
        );
    } catch (error: any) {
        console.error("Debug page error:", error);
        return (
            <div style={{ padding: '20px', color: 'red' }}>
                <h1>Error</h1>
                <pre>{(error as Error).message}</pre>
            </div>
        );
    }
}
