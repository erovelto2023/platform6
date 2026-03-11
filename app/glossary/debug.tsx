import { getGlossaryTerms } from "@/lib/actions/glossary.actions";

export default async function DebugPage() {
    try {
        // Test database connection
        const result = await getGlossaryTerms();
        
        return (
            <div style={{ padding: '20px', fontFamily: 'monospace' }}>
                <h1>Glossary Debug Page</h1>
                <p>Database connection successful</p>
                
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
