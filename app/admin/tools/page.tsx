import { getTools, seedTools } from "@/lib/actions/tool.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolToggle, SeedToolsButton } from "./_components";

export default async function AdminToolsPage() {
    const { data: tools } = await getTools(false);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Tools Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Enable or disable tools to control what users can access
                    </p>
                </div>
                <SeedToolsButton />
            </div>

            {!tools || tools.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>No Tools Found</CardTitle>
                        <CardDescription>
                            Click "Seed Tools" to initialize the tools database
                        </CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {tools.map((tool: any) => (
                        <Card key={tool._id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="flex items-center gap-2">
                                            {tool.name}
                                            {!tool.isEnabled && (
                                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                                    Disabled
                                                </span>
                                            )}
                                        </CardTitle>
                                        <CardDescription className="mt-2">
                                            {tool.description}
                                        </CardDescription>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Path: <code className="bg-slate-100 px-2 py-0.5 rounded">{tool.path}</code>
                                        </p>
                                    </div>
                                    <ToolToggle toolId={tool._id} isEnabled={tool.isEnabled} />
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
