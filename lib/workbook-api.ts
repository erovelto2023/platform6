// Helper functions for workbook project API calls

export async function saveWorkbookProject(projectData: any, currentProjectId: string | null) {
    const url = currentProjectId
        ? `/api/workbook-projects/${currentProjectId}`
        : '/api/workbook-projects';
    const method = currentProjectId ? 'PUT' : 'POST';

    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
    });

    if (!response.ok) {
        throw new Error('Failed to save project');
    }

    return response.json();
}

export async function loadWorkbookProject(projectId: string) {
    const response = await fetch(`/api/workbook-projects/${projectId}`);

    if (!response.ok) {
        throw new Error('Failed to load project');
    }

    return response.json();
}

export async function loadWorkbookProjectsList() {
    const response = await fetch('/api/workbook-projects');

    if (!response.ok) {
        throw new Error('Failed to load projects list');
    }

    const data = await response.json();
    return data.projects.map((p: any) => ({
        id: p._id,
        name: p.name,
        lastModified: p.updatedAt,
        pageCount: p.pageCount
    }));
}

export async function deleteWorkbookProject(projectId: string) {
    const response = await fetch(`/api/workbook-projects/${projectId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete project');
    }

    return response.json();
}
