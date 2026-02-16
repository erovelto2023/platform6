import { getTools } from "@/lib/actions/tool.actions";

export const dynamic = 'force-dynamic';

export default async function DebugToolsPage() {
    const { data: allTools, error } = await getTools(false);

    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-2xl font-bold mb-4">Debug Tools DB</h1>

            <div className="mb-8 p-4 bg-slate-100 rounded border">
                <h2 className="font-bold">Summary</h2>
                <p>Status: {error ? 'Error' : 'Success'}</p>
                <p>Error: {error || 'None'}</p>
                <p>Total Tools: {allTools?.length || 0}</p>
                <p>Timestamp: {new Date().toISOString()}</p>
            </div>

            <h2 className="font-bold mb-2">Tools List</h2>
            <div className="space-y-2">
                {allTools?.map((t: any) => (
                    <div key={t._id} className="p-2 border rounded hover:bg-slate-50">
                        <div className="flex justify-between">
                            <span className="font-bold">{t.name}</span>
                            <span className={t.isEnabled ? "text-green-600" : "text-red-600"}>
                                {t.isEnabled ? "ENABLED" : "DISABLED"}
                            </span>
                        </div>
                        <div className="text-xs text-slate-500">{t.slug}</div>
                        <div className="text-xs text-slate-500">{t.path}</div>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h2 className="font-bold mb-2">Raw Data Snapshot (First 2)</h2>
                <pre className="bg-slate-900 text-green-400 p-4 rounded overflow-auto">
                    {JSON.stringify(allTools?.slice(0, 2), null, 2)}
                </pre>
            </div>
        </div>
    );
}
